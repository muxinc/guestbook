import * as React from "react";

import {
  MIME_TYPE_STACK,
  NUMBER_AUDIO_BITS_PER_SECOND,
  NUMBER_VIDEO_BITS_PER_SECOND,
} from "@/constants/media-recorder";

import { useDeviceIdContext } from "@/contexts/device-id-context";
import { useVideoContext } from "@/contexts/video-context";
import { MessageType, useConsoleContext } from "@/contexts/console-context";
import { useRecorderContext, RecordingStatus } from "@/contexts/recorder-context";

import RecordButton from "./record-button";
import RecordingProgress from "./recording-progress";
import PreRecordCountdown from "./pre-record-countdown";

import formatBytes from "@/lib/utils";

const getSupportedMimeType = () => {
  return MIME_TYPE_STACK.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType)
  );
};

const Recorder = () => {
  const { videoDeviceId, audioDeviceId, requestUserMedia } = useDeviceIdContext();
  const { submitUpload } = useVideoContext();
  const { setMessage } = useConsoleContext();
  const { recordingStatus, setRecordingStatus } = useRecorderContext();

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const setupQueueRef = React.useRef<Promise<void>>(Promise.resolve());
  const [isConfiguring, setIsConfiguring] = React.useState(false);
  const [mediaError, setMediaError] = React.useState<string | null>(null);
  const [setupAttempt, setSetupAttempt] = React.useState(0);
  const mediaRecorderRef = React.useRef<MediaRecorder>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const [, setChunks] = React.useState<Blob[]>([]);

  // Store callbacks in ref to avoid dependency issues
  const callbacksRef = React.useRef({
    setMessage,
    setRecordingStatus,
    submitUpload,
  });

  // Update callbacks ref when they change
  React.useEffect(() => {
    callbacksRef.current = {
      setMessage,
      setRecordingStatus,
      submitUpload,
    };
  }, [setMessage, setRecordingStatus, submitUpload]);

  React.useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  React.useEffect(() => {
    // This hook should run under two circumstances:
    // 1. Initializing & videoDeviceId/audioDeviceId are set
    // 2. Ready & videoDeviceId/audioDeviceId are changed
    const isInitReady =
      recordingStatus === RecordingStatus.INITIALIZING &&
      videoDeviceId &&
      audioDeviceId;

    const videoSrcObject = videoRef.current?.srcObject as
      | MediaStream
      | null
      | undefined;
    const videoTrack = videoSrcObject?.getVideoTracks()[0];
    const audioTrack = videoSrcObject?.getAudioTracks()[0];
    const isReadyReady =
      recordingStatus === RecordingStatus.READY &&
      (videoDeviceId !== videoTrack?.getSettings().deviceId ||
        audioDeviceId !== audioTrack?.getSettings().deviceId);
    if (!isInitReady && !isReadyReady) return;

    let cancelled = false;
    let requestedStream: MediaStream | undefined;
    setIsConfiguring(true);
    setMediaError(null);

    // Release the old devices before opening another camera. Some browsers
    // and capture devices cannot run multiple camera streams at once.
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;

    const setup = async () => {
      if (!videoRef.current) return;

      const audioPrefs: boolean | MediaTrackConstraints = {
        deviceId: { exact: audioDeviceId },
      };
      const videoPrefs: boolean | MediaTrackConstraints = {
        deviceId: { exact: videoDeviceId },
        // When in portrait mode, iOS will invert this ratio. So like, 9 / 16.
        // Which, like, what if I want a horizontal crop of a vertical video?
        // AND THEN it'll still try to tell me that the width of the video > height.
        // Whatever.
        aspectRatio: 16 / 9,
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioPrefs,
        video: videoPrefs,
      });

      requestedStream = stream;
      // Ignore late results from an older selection or an unmounted recorder.
      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const mimeType = getSupportedMimeType();
      if (typeof mimeType === "undefined") {
        throw new Error("No supported mime type found");
      }
      const options: MediaRecorderOptions = {
        audioBitsPerSecond: NUMBER_AUDIO_BITS_PER_SECOND,
        videoBitsPerSecond: NUMBER_VIDEO_BITS_PER_SECOND,
        mimeType,
      };
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      callbacksRef.current.setMessage({
        content: "Configured Media Recorder",
        data: options,
        type: MessageType.RECORDER,
      });

      mediaRecorderRef.current.ondataavailable = (e) => {
        const chunk = e.data;

        callbacksRef.current.setMessage({
          content: `Saving chunk. (${formatBytes(chunk.size)}, ${chunk.type})`,
          type: MessageType.RECORDER,
        });

        // Add to ref immediately (no async delays)
        chunksRef.current.push(chunk);
        // Update state for UI purposes
        setChunks(prev => [...prev, chunk]);
      };

      // Set onstop handler here, when MediaRecorder is created
      mediaRecorderRef.current.onstop = () => {
        callbacksRef.current.setMessage({
          content: `Stopping recording...`,
          type: MessageType.RECORDER,
        });

        // Use chunks from ref (no race condition)
        const allChunks = chunksRef.current;

        console.log('All chunks:', allChunks.map(c => ({ size: c.size, type: c.type })));

        if (allChunks.length === 0) {
          console.error('No chunks available!');
          return;
        }

        // Use the MIME type from the actual chunks
        const finalBlob = new Blob(allChunks, { type: allChunks[0].type });

        console.log('Final blob size:', finalBlob.size);
        console.log('Total chunks size:', allChunks.reduce((sum, chunk) => sum + chunk.size, 0));

        const createdFile = new File(
          [finalBlob],
          "video-recording-new-new-final-FORREAL_v2",
          { type: finalBlob.type }
        );

        callbacksRef.current.setMessage({
          content: `Created file: ${formatBytes(createdFile.size)}, ${createdFile.type}`,
          type: MessageType.RECORDER,
        });

        callbacksRef.current.submitUpload(createdFile);

        // Reset both ref and state
        chunksRef.current = [];
        setChunks([]);
        callbacksRef.current.setRecordingStatus(RecordingStatus.READY);
      };

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.autoplay = true;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.controls = false;

      setIsConfiguring(false);
      callbacksRef.current.setRecordingStatus(RecordingStatus.READY);
    };
    // getUserMedia cannot be aborted. Wait for any superseded acquisition to
    // finish and release its stream before asking exclusive hardware to reopen.
    const setupTask = setupQueueRef.current.then(() => {
      if (!cancelled) return setup();
    }).catch((error: unknown) => {
      requestedStream?.getTracks().forEach((track) => track.stop());
      if (cancelled) return;
      streamRef.current = null;
      mediaRecorderRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      const message = "Unable to open the selected camera or microphone. Check that it is connected and not in use by another app, then try again or choose another source in Settings.";
      setMediaError(message);
      setIsConfiguring(false);
      callbacksRef.current.setMessage({
        content: message,
        data: error,
        type: MessageType.ERROR,
      });
    });
    setupQueueRef.current = setupTask;
    return () => {
      cancelled = true;
    };
  }, [
    audioDeviceId,
    recordingStatus,
    videoDeviceId,
    setupAttempt,
    // Don't include callback functions in dependencies
  ]);

  React.useEffect(() => {
    if (!mediaRecorderRef.current) return;
    if (recordingStatus !== RecordingStatus.RECORDING) return;
    mediaRecorderRef.current?.start(500);
  }, [recordingStatus])

  React.useEffect(() => {
    if (!mediaRecorderRef.current) return;
    if (recordingStatus !== RecordingStatus.STOPPING) return;
    mediaRecorderRef.current?.stop();
  }, [recordingStatus])

  return (
    <>
      <RecordingProgress />
      <div className={`relative bg-black ${recordingStatus === RecordingStatus.INITIALIZING ? "max-h-[25vh]" : "max-h-[50vh]"}`}>
        <PreRecordCountdown />

        <video
          className="w-full h-full scale-x-[-1] pointer-events-none"
          ref={videoRef}
          autoPlay
          muted
          playsInline
          controls={false}
        />

        {mediaError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-white" role="alert">
            <p>{mediaError}</p>
            <button className="rounded bg-white px-3 py-2 text-gray-700" onClick={() => setSetupAttempt((attempt) => attempt + 1)}>
              Try again
            </button>
          </div>
        ) : isConfiguring ? (
          <div className="absolute inset-0 flex items-center justify-center text-white" role="status">
            Connecting camera…
          </div>
        ) : recordingStatus === RecordingStatus.INITIALIZING ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-2xl text-white text-center">Connect your camera to begin</div>
              <button className="bg-white text-gray-700 rounded px-3 py-2 flex items-center gap-2" onClick={requestUserMedia}>
                <svg className="w-6 h-6 stroke-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Enable camera access
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
            <RecordButton />
          </div>
        )}
      </div>
    </>
  );
};

export default Recorder;
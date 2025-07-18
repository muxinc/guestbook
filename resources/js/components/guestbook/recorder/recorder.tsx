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
  const mediaRecorderRef = React.useRef<MediaRecorder>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const [chunks, setChunks] = React.useState<Blob[]>([]);

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

    // Did we pass the test? Ok let's go.
    const setup = async () => {
      if (!videoRef.current) return;

      const audioPrefs: boolean | MediaTrackConstraints = {
        deviceId: audioDeviceId,
      };
      const videoPrefs: boolean | MediaTrackConstraints = {
        deviceId: videoDeviceId,
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
      mediaRecorderRef.current.onstop = (e) => {
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
        let finalBlob = new Blob(allChunks, { type: allChunks[0].type });

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

      videoRef.current.srcObject = stream;
      videoRef.current.autoplay = true;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.controls = false;

      setRecordingStatus(RecordingStatus.READY);
    };
    setup();
  }, [
    audioDeviceId,
    recordingStatus,
    videoDeviceId,
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

        {recordingStatus === RecordingStatus.INITIALIZING ? (
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
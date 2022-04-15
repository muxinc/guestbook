import * as React from "react";

import RecordingStatus from "constants/RecordingStatus";
import {
  MIME_TYPE_STACK,
  NUMBER_AUDIO_BITS_PER_SECOND,
  NUMBER_VIDEO_BITS_PER_SECOND,
} from "constants/MediaRecorder";

import { useDeviceIdContext } from "contexts/DeviceIdContext";
import { useVideoContext } from "contexts/VideoContext";
import { MessageType, useConsoleContext } from "contexts/ConsoleContext";

import TimerButton from "./TimerButton";

import formatBytes from "utils/formatBytes";

const getSupportedMimeType = () => {
  return MIME_TYPE_STACK.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType)
  );
};

type Props = {
  className?: string;
};

const Recorder = ({ className = "" }: Props) => {
  const { videoDeviceId, audioDeviceId } = useDeviceIdContext();
  const { submitUpload } = useVideoContext();
  const { setMessage } = useConsoleContext();

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder>();

  const [recordingStatus, setRecordingStatus] = React.useState(
    RecordingStatus.INITIALIZING
  );
  const [chunks, setChunks] = React.useState<Blob[]>([]);

  React.useEffect(() => {
    setMessage({
      content: recordingStatus,
      type: MessageType.RECORDER,
    });
  }, [recordingStatus, setMessage]);

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
      setMessage({
        content: "Configured Media Recorder",
        data: options,
        type: MessageType.RECORDER,
      });

      mediaRecorderRef.current.ondataavailable = (e) => {
        const chunk = e.data;
        setMessage({
          content: `Saving chunk. (${formatBytes(chunk.size)}, ${chunk.type})`,
          type: MessageType.RECORDER,
        });
        setChunks((c) => [...c, chunk]);
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
    setMessage,
    setRecordingStatus,
    videoDeviceId,
  ]);

  // Pass these three functions to our countdown button.
  // They'll handle updating the
  const startCountdown = React.useCallback(() => {
    if (!mediaRecorderRef.current) return false;
    if (recordingStatus !== RecordingStatus.READY) {
      setMessage({
        content: `Recorder not ready!`,
        type: MessageType.RECORDER,
      });
      return false;
    }
    setRecordingStatus(RecordingStatus.COUNTING);
    return true;
  }, [recordingStatus, setMessage, setRecordingStatus]);

  const startRecording = React.useCallback(() => {
    setRecordingStatus(RecordingStatus.RECORDING);
    mediaRecorderRef.current?.start(500);
  }, [setRecordingStatus]);

  const stopRecording = React.useCallback(() => {
    mediaRecorderRef.current?.stop();
    // The useEffect down below will handle the rest.
  }, []);

  // Create a file on MediaRecorder's stop event
  React.useEffect(() => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = (e) => {
      setMessage({
        content: `Stopping recording...`,
        type: MessageType.RECORDER,
      });

      let finalBlob = new Blob(chunks, { type: getSupportedMimeType() });
      const objUrl = URL.createObjectURL(finalBlob);

      // you might instead create a new file from the aggregated chunk data
      const createdFile = new File(
        [finalBlob],
        "video-recording-new-new-final-FORREAL_v2",
        { type: finalBlob.type }
      );

      setMessage({
        content: `Created file: ${formatBytes(createdFile.size)}, ${
          createdFile.type
        }`,
        type: MessageType.RECORDER,
      });

      submitUpload(createdFile);
      setChunks([]);
      setRecordingStatus(RecordingStatus.READY);
    };
  }, [chunks, setChunks, setMessage, setRecordingStatus, submitUpload]);

  return (
    <div className={`relative bg-gray-900 p-2 sm:p-4 ${className}`}>
      <video
        className="w-full h-full scale-x-[-1] pointer-events-none"
        ref={videoRef}
        autoPlay
        muted
        playsInline
        controls={false}
      />
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
        <TimerButton
          onCountdownStart={startCountdown}
          countdownDuration={3}
          onCountdownEnd={startRecording}
          recordingDuration={5}
          onRecordingEnd={stopRecording}
        />
      </div>
    </div>
  );
};

export default Recorder;

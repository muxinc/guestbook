import * as React from "react";
import * as UpChunk from "@mux/upchunk";

import RecordingStatus from "constants/RecordingStatus";
import {
  MIME_TYPE,
  NUMBER_AUDIO_BITS_PER_SECOND,
  NUMBER_VIDEO_BITS_PER_SECOND,
} from "constants/MediaRecorder";
import TimerButton from "./TimerButton";
import { useDeviceIdContext } from "contexts/DeviceIdContext";

type Props = {
  recordingStatus: RecordingStatus;
  setRecordingStatus: (status: RecordingStatus) => void;
};

const Recorder = ({ recordingStatus, setRecordingStatus }: Props) => {
  const { videoDeviceId, audioDeviceId } = useDeviceIdContext();

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder>();

  const [chunks, setChunks] = React.useState<Blob[]>([]);
  const [file, setFile] = React.useState<File | null>(null);

  const [progress, setProgress] = React.useState(0);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  // Setup MediaRecorder when initializing
  // change cameras when initializing or ready
  React.useEffect(() => {
    if (
      recordingStatus !== RecordingStatus.INITIALIZING &&
      recordingStatus !== RecordingStatus.READY
    )
      return;
    const setup = async () => {
      if (!videoRef.current) return;

      const audioPrefs: boolean | MediaTrackConstraints = audioDeviceId
        ? { deviceId: audioDeviceId }
        : true;
      const videoPrefs: boolean | MediaTrackConstraints = videoDeviceId
        ? {
            deviceId: videoDeviceId,
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          }
        : true;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioPrefs,
        video: videoPrefs,
      });

      if (!MediaRecorder.isTypeSupported(MIME_TYPE)) {
        throw new Error("Sorry, this codec is not supported.");
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        audioBitsPerSecond: NUMBER_AUDIO_BITS_PER_SECOND,
        videoBitsPerSecond: NUMBER_VIDEO_BITS_PER_SECOND,
        mimeType: MIME_TYPE,
      });

      mediaRecorderRef.current.ondataavailable = (e) => {
        console.log("saving chunk");
        setChunks((c) => [...c, e.data]);
      };

      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.controls = false;

      setRecordingStatus(RecordingStatus.READY);
    };
    setup();
  }, [audioDeviceId, recordingStatus, setRecordingStatus, videoDeviceId]);

  // Pass these three functions to our countdown button.
  // They'll handle updating the
  const startCountdown = React.useCallback(() => {
    if (!mediaRecorderRef.current) return false;
    if (recordingStatus !== RecordingStatus.READY) {
      console.log("Recorder not ready!");
      return false;
    }
    setRecordingStatus(RecordingStatus.COUNTING);
    return true;
  }, [recordingStatus, setRecordingStatus]);
  const startRecording = React.useCallback(() => {
    setRecordingStatus(RecordingStatus.RECORDING);
    console.log("Now recording!");
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
      console.log("stopping recording!");
      let finalBlob = new Blob(chunks, { type: MIME_TYPE });
      const objUrl = URL.createObjectURL(finalBlob);

      // you might instead create a new file from the aggregated chunk data
      const createdFile = new File(
        [finalBlob],
        "video-recording-new-new-final-FORREAL_v2",
        { type: finalBlob.type }
      );
      setFile(createdFile);
      setChunks([]);
      setRecordingStatus(RecordingStatus.READY);
    };
  }, [chunks, setChunks, setRecordingStatus]);

  // Upload on new file detected
  const handleUpload = React.useCallback(async () => {
    try {
      if (!file) return;

      const response = await fetch("/api/upload", { method: "POST" });
      const url = await response.text();

      const upload = UpChunk.createUpload({
        endpoint: url, // Authenticated url
        file, // File object with your video file’s properties
        chunkSize: 30720, // Uploads the file in ~30 MB chunks
      });

      // Subscribe to events
      upload.on("error", (error) => {
        console.log(error);
        setStatusMessage(error.detail);
      });

      upload.on("progress", (progress) => {
        console.log(progress);
        setProgress(progress.detail);
      });

      upload.on("success", () => {
        console.log("successsss");
        setStatusMessage("Wrap it up, we're done here. 👋");
        setFile(null);
      });
    } catch (error) {
      console.error(error);
    }
  }, [file]);

  React.useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file, handleUpload]);

  return (
    <div className="w-full bg-gray-900 relative">
      <video
        className="mx-auto aspect-video h-full scale-x-[-1] pointer-events-none"
        ref={videoRef}
        autoPlay
      />
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
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

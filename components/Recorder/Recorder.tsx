import * as React from "react";
import * as UpChunk from "@mux/upchunk";

import RecordingStatus from "constants/RecordingStatus";
import {
  MIME_TYPE_STACK,
  NUMBER_AUDIO_BITS_PER_SECOND,
  NUMBER_VIDEO_BITS_PER_SECOND,
} from "constants/MediaRecorder";

import { useDeviceIdContext } from "contexts/DeviceIdContext";

import TimerButton from "./TimerButton";
import SignupDialog from "./SignupDialog";

const getSupportedMimeType = () => {
  return MIME_TYPE_STACK.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType)
  );
};

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
  const [fileUploadUrl, setFileUploadUrl] = React.useState<string | null>(null);

  const [progress, setProgress] = React.useState(0);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const [isSignupDialogOpen, setIsSignupDialogOpen] =
    React.useState<boolean>(false);

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
      const videoPrefs: boolean | MediaTrackConstraints = {
        facingMode: "user",
        aspectRatio: 16 / 9,
      };
      if (videoDeviceId) {
        videoPrefs.deviceId = videoDeviceId;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioPrefs,
        video: videoPrefs,
      });

      const mimeType = getSupportedMimeType();
      if (typeof mimeType === "undefined") {
        throw new Error("No supported mime type found");
      }
      // TODO: this doesn't turn off the old camera when switching to a new one
      // particularly in safari
      mediaRecorderRef.current = new MediaRecorder(stream, {
        audioBitsPerSecond: NUMBER_AUDIO_BITS_PER_SECOND,
        videoBitsPerSecond: NUMBER_VIDEO_BITS_PER_SECOND,
        mimeType,
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
      let finalBlob = new Blob(chunks, { type: getSupportedMimeType() });
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

  React.useEffect(() => {
    // When we detect a new file, we show the contact form.
    // The contact form is in charge of fetching our upload link
    if (file) {
      // We set a slight timeout just to make it less... confusing?
      const timeout = setTimeout(() => setIsSignupDialogOpen(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [file]);

  const handleUpload = React.useCallback(async () => {
    try {
      if (!file) return;
      if (!fileUploadUrl) return;

      const upload = UpChunk.createUpload({
        endpoint: fileUploadUrl, // Authenticated url
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
        setFileUploadUrl(null);
        setFile(null);
      });
    } catch (error) {
      console.error(error);
    }
  }, [file, fileUploadUrl]);

  React.useEffect(() => {
    if (file && fileUploadUrl) {
      handleUpload();
    }
  }, [file, fileUploadUrl, handleUpload]);

  return (
    <>
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
      <SignupDialog
        isDialogOpen={isSignupDialogOpen}
        setIsDialogOpen={setIsSignupDialogOpen}
        setFileUploadUrl={setFileUploadUrl}
      />
    </>
  );
};

export default Recorder;

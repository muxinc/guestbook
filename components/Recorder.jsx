import * as React from "react";
import * as UpChunk from "@mux/upchunk";
import { motion } from "framer-motion";

import RecordingStatus from "../constants/RecordingStatus";
import {
  MIME_TYPE,
  NUMBER_AUDIO_BITS_PER_SECOND,
  NUMBER_VIDEO_BITS_PER_SECOND,
} from "../constants/MediaRecorder";

const Recorder = ({
  videoDeviceId,
  recordingStatus,
  setRecordingStatus,
  setCountdownSec,
}) => {
  const videoRef = React.useRef();
  const mediaRecorderRef = React.useRef();

  const [chunks, setChunks] = React.useState([]);
  const [file, setFile] = React.useState();

  const [progress, setProgress] = React.useState(0);
  const [statusMessage, setStatusMessage] = React.useState(null);

  const handleUpload = React.useCallback(async () => {
    try {
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
      console.log(error);
      setErrorMessage(error);
    }
  }, [file]);

  // Start countdown
  const handleClickRecord = () => {
    if (!mediaRecorderRef.current) return;

    if (recordingStatus !== RecordingStatus.READY) {
      console.log("Recorder not ready!");
      return;
    }

    setRecordingStatus(RecordingStatus.COUNTING);
  };

  // Start recording
  React.useEffect(() => {
    if (recordingStatus !== RecordingStatus.RECORDING) return;
    console.log("Now recording!");

    mediaRecorderRef.current.start(500);

    // Automatically stop the recording after 10 seconds.
    setTimeout(() => {
      mediaRecorderRef.current.stop();
    }, 5000);
  }, [recordingStatus]);

  // Setup MediaRecorder
  React.useEffect(() => {
    if (recordingStatus !== RecordingStatus.INITIALIZING) return;

    const setup = async () => {
      const videoPrefs = videoDeviceId ? { deviceId: videoDeviceId } : true;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
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
    };
    setup();
    setRecordingStatus(RecordingStatus.READY);
  }, [recordingStatus, setRecordingStatus, videoDeviceId]);

  // Handle MediaRecorder onstop
  React.useEffect(() => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = (e) => {
      console.log("stopping recording!");
      let finalBlob = new Blob(chunks, { type: MIME_TYPE });
      const objUrl = URL.createObjectURL(finalBlob);

      // you might instead create a new file from the aggregated chunk data
      const createdFile = new File(
        [finalBlob],
        "video-recording-new-new-final-FORREAL",
        { type: finalBlob.type }
      );
      setFile(createdFile);
      setChunks([]);
      setRecordingStatus(RecordingStatus.READY);
      setCountdownSec(5);
    };
  }, [chunks, setChunks]);

  // Upload on new file detected
  React.useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file, handleUpload]);

  return (
    <div className="w-full bg-gray-900 h-[50vh] relative">
      {recordingStatus === RecordingStatus.READY && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
          <div className="bg-gray-200 p-3 mb-4 w-48 flex items-center justify-center rounded-full opacity-90">
            <motion.button
              className="cursor-pointer bg-red-800 rounded-full w-12 h-12 block"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClickRecord}
            ></motion.button>
          </div>
        </div>
      )}
      <video
        className="mx-auto aspect-video h-full pointer-events-none"
        ref={videoRef}
        autoPlay
      />
    </div>
  );
};

export default Recorder;

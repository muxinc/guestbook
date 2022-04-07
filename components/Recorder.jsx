import * as React from "react";
import RecordingStatus from "../constants/RecordingStatus";
import {
  MIME_TYPE,
  NUMBER_AUDIO_BITS_PER_SECOND,
  NUMBER_VIDEO_BITS_PER_SECOND,
} from "../constants/MediaRecorder";

const Recorder = ({ videoDeviceId, recordingStatus, setRecordingStatus, setCountdownSec }) => {
  const videoRef = React.useRef();
  const mediaRecorderRef = React.useRef();

  const [chunks, setChunks] = React.useState([]);

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

  React.useEffect(() => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = (e) => {
      console.log("stopping recording!");
      let finalBlob = new Blob(chunks, { type: MIME_TYPE });
      const objUrl = URL.createObjectURL(finalBlob);

      // you might instead create a new file from the aggregated chunk data
      // const createdFile = new File([finalBlob], 'video-recording-new-new-final-FORREAL', {type: finalBlob.type});

      // create a video element in the browser and add it to the document body
      let video = document.createElement("video");
      video.src = objUrl;
      video.controls = true;
      video.muted = false;

      document.body.appendChild(video);
      setChunks([]);
      setRecordingStatus(RecordingStatus.READY);
      setCountdownSec(5);
    };
  }, [chunks, setChunks]);

  return (
    <div className="w-full bg-gray-900 h-[50vh] relative">
      {recordingStatus === RecordingStatus.READY && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
          <div className="bg-gray-200 p-3 mb-4 w-48 flex items-center justify-center rounded-full opacity-90">
            <button
              className="cursor-pointer bg-red-800 rounded-full w-12 h-12 block"
              onClick={handleClickRecord}
            ></button>
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

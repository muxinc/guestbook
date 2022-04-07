import * as React from "react";
import RecordingStatus from "../constants/RecordingStatus"
import { MIME_TYPE, NUMBER_AUDIO_BITS_PER_SECOND, NUMBER_VIDEO_BITS_PER_SECOND } from "../constants/MediaRecorder";

const Recorder = ({ videoDeviceId, recordingStatus, setRecordingStatus }) => {

  const videoRef = React.useRef();
  const [chunks, setChunks] = React.useState([]);

  React.useEffect(() => {
    if (recordingStatus !== RecordingStatus.INITIALIZING) return;

    const setup = async () => {
      const videoPrefs = videoDeviceId ? { deviceId: videoDeviceId } : true;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: videoPrefs });

      if (! MediaRecorder.isTypeSupported(MIME_TYPE)) {
        throw new Error('Sorry, this codec is not supported.');
      }

      const mediaRecorder = new MediaRecorder(stream, {
        audioBitsPerSecond: NUMBER_AUDIO_BITS_PER_SECOND,
        videoBitsPerSecond: NUMBER_VIDEO_BITS_PER_SECOND,
        mimeType: MIME_TYPE
      });

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      }

      mediaRecorder.onstop = (e) => {
        let finalBlob = new Blob(chunks, { type: MIME_TYPE });
        const objUrl = URL.createObjectURL(finalBlob);

        // you might instead create a new file from the aggregated chunk data
        // const createdFile = new File([finalBlob], 'video-recording-new-new-final-FORREAL', {type: finalBlob.type});

        // create a video element in the browser and add it to the document body
        let video = document.createElement('video');
        video.src = objUrl;
        video.controls = true;
        video.muted = false;

        document.body.appendChild(video);
      };

      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.controls = false;
    }
    setup();
  }, [recordingStatus, videoDeviceId, chunks]);

  return (
    <div className="w-full bg-gray-900 h-[50vh] relative">
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
        <div className="bg-gray-200 p-3 mb-4 w-48 flex items-center justify-center rounded-full opacity-90">
          <button className="cursor-pointer bg-red-800 rounded-full w-12 h-12 block"></button>
        </div>
      </div>
      <video className="mx-auto aspect-video h-full" ref={videoRef} autoPlay />
    </div>
  )
}

export default Recorder;
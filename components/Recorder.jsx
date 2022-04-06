import * as React from "react";

const Recorder = ({ videoDeviceId }) => {

  const videoRef = React.useRef();

  React.useEffect(() => {
    const setup = async () => {
      const videoPrefs = videoDeviceId ? { deviceId: videoDeviceId } : true;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: videoPrefs });
      const recorder = await new MediaRecorder(stream);

      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.controls = false;
    }
    setup();
  }, [videoDeviceId]);

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
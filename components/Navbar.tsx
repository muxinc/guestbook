import * as React from "react";
import SelectDevice from "./SelectDevice";

type Props = {
  videoDeviceId: string;
  setVideoDeviceId: (id: string) => void;
  audioDeviceId: string;
  setAudioDeviceId: (id: string) => void;
};

const Navbar = ({
  videoDeviceId,
  setVideoDeviceId,
  audioDeviceId,
  setAudioDeviceId,
}: Props) => (
  <>
    <div className="text-white p-4 bg-pink-400">
      <h1 className="text-5xl font-bold">🌴 React Miami</h1>
      <p className="text-xl">Sign the video guestbook</p>
      <p className="text-sm">An open-source project from Mux</p>
    </div>
    <SelectDevice
      videoDeviceId={videoDeviceId}
      audioDeviceId={audioDeviceId}
      setVideoDeviceId={setVideoDeviceId}
      setAudioDeviceId={setAudioDeviceId}
    />
  </>
);

export default Navbar;

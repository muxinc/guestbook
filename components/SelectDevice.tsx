import * as React from "react";
import { LocalStorageKeys } from "../constants/LocalStorage";

type Props = {
  videoDeviceId: string;
  audioDeviceId: string;
  setVideoDeviceId: (id: string) => void;
  setAudioDeviceId: (id: string) => void;
};

const SelectDevice = ({
  videoDeviceId,
  setVideoDeviceId,
  audioDeviceId,
  setAudioDeviceId,
}: Props) => {
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);

  React.useEffect(() => {
    const detect = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setDevices(devices);
    };

    detect();
  }, []);

  return (
    <div>
      <select
        className="border p-2 w-full mb-2"
        onChange={(e) => {
          localStorage.setItem(
            LocalStorageKeys.AUDIO_DEVICE_ID,
            e.target.value
          );
          setAudioDeviceId(e.target.value);
        }}
        value={videoDeviceId}
      >
        {devices
          .filter((d) => d.kind === "audioinput")
          .map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label}
            </option>
          ))}
      </select>

      <select
        className="border p-2 w-full mb-2"
        onChange={(e) => {
          localStorage.setItem(
            LocalStorageKeys.VIDEO_DEVICE_ID,
            e.target.value
          );
          setVideoDeviceId(e.target.value);
        }}
        value={audioDeviceId}
      >
        {devices
          .filter((d) => d.kind === "videoinput")
          .map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label}
            </option>
          ))}
      </select>
    </div>
  );
};

export default SelectDevice;

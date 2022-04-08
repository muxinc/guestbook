import { useContext } from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";

enum LocalStorageKeys {
  AUDIO_DEVICE_ID = "mux-guestbook:audioDeviceId",
  VIDEO_DEVICE_ID = "mux-guestbook:videoDeviceId",
}

interface VideoDeviceInfo extends MediaDeviceInfo {
  kind: "videoinput";
}
interface AudioDeviceInfo extends MediaDeviceInfo {
  kind: "audioinput";
}

type DeviceIdContextValue = {
  videoDeviceId: string | undefined;
  setVideoDeviceId: (id: string) => void;
  audioDeviceId: string | undefined;
  setAudioDeviceId: (id: string) => void;
  videoDevices: VideoDeviceInfo[] | undefined;
  audioDevices: AudioDeviceInfo[] | undefined;
};
type DefaultValue = undefined;
type ContextValue = DeviceIdContextValue | DefaultValue;

export const DeviceIdContext = createContext<ContextValue>(undefined);

interface ProviderProps {
  children: React.ReactNode;
}

const DeviceIdProvider = ({ children }: ProviderProps) => {
  const [videoDevices, setVideoDevices] = useState<VideoDeviceInfo[]>();
  const [audioDevices, setAudioDevices] = useState<AudioDeviceInfo[]>();
  const [videoDeviceId, setVideoDeviceId] = useState<string>();
  const [audioDeviceId, setAudioDeviceId] = useState<string>();

  useEffect(() => {
    const setState = async () => {
      /* First we get a list of devices */
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }); // safari won't return a list of devices until we approve this

      const devices = await navigator.mediaDevices.enumerateDevices();

      const videoDevices = devices.filter(
        (d) => d.kind === "videoinput"
      ) as VideoDeviceInfo[];
      const audioDevices = devices.filter(
        (d) => d.kind === "audioinput"
      ) as AudioDeviceInfo[];

      setVideoDevices(videoDevices);
      setAudioDevices(audioDevices);

      /* 
      Once we have a list of devices, 
      we use that and localstorage to set our initial device IDs
      */
      const videoDeviceId = localStorage.getItem(
        LocalStorageKeys.VIDEO_DEVICE_ID
      );
      const audioDeviceId = localStorage.getItem(
        LocalStorageKeys.AUDIO_DEVICE_ID
      );
      const videoDeviceIds = videoDevices.map((d) => d.deviceId);
      const audioDeviceIds = audioDevices.map((d) => d.deviceId);
      if (
        typeof videoDeviceId === "string" &&
        videoDeviceIds.includes(videoDeviceId)
      ) {
        setVideoDeviceId(videoDeviceId);
      } else {
        setVideoDeviceId(videoDeviceIds[0]);
      }
      if (
        typeof audioDeviceId === "string" &&
        audioDeviceIds.includes(audioDeviceId)
      ) {
        setAudioDeviceId(audioDeviceId);
      } else {
        setAudioDeviceId(audioDeviceIds[0]);
      }
    };
    setState();
  }, []);

  /* We want our setters to keep state in sync with localStorage */
  const setVideoDeviceIdLocalStorage = (id: string) => {
    localStorage.setItem(LocalStorageKeys.VIDEO_DEVICE_ID, id);
    setVideoDeviceId(id);
  };
  const setAudioDeviceIdLocalStorage = (id: string) => {
    localStorage.setItem(LocalStorageKeys.AUDIO_DEVICE_ID, id);
    setAudioDeviceId(id);
  };

  /* Finally, we wrap this all up in a provider to give it to our children */
  const value = {
    videoDeviceId,
    setVideoDeviceId: setVideoDeviceIdLocalStorage,
    audioDeviceId,
    setAudioDeviceId: setAudioDeviceIdLocalStorage,
    videoDevices,
    audioDevices,
  };
  return (
    <DeviceIdContext.Provider value={value}>
      {children}
    </DeviceIdContext.Provider>
  );
};

export const useDeviceIdContext = () =>
  useContext(DeviceIdContext) as DeviceIdContextValue;
export default DeviceIdProvider;

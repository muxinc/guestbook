import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useConsoleContext, MessageType } from "./console-context";

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
  requestUserMedia: () => Promise<void>;
};
type DefaultValue = undefined;
type ContextValue = DeviceIdContextValue | DefaultValue;

export const DeviceIdContext = createContext<ContextValue>(undefined);

interface ProviderProps {
  children: React.ReactNode;
}

const DeviceIdProvider = ({ children }: ProviderProps) => {
  const { setMessage } = useConsoleContext();

  const [videoDevices, setVideoDevices] = useState<VideoDeviceInfo[]>();
  const [audioDevices, setAudioDevices] = useState<AudioDeviceInfo[]>();
  const [videoDeviceId, setVideoDeviceId] = useState<string>();
  const [audioDeviceId, setAudioDeviceId] = useState<string>();

  /* We want our setters to keep state in sync with localStorage */
  const setVideoDeviceIdLocalStorage = useCallback((id: string) => {
    localStorage.setItem(LocalStorageKeys.VIDEO_DEVICE_ID, id);
    setVideoDeviceId(id);
  }, []);

  const setAudioDeviceIdLocalStorage = useCallback((id: string) => {
    localStorage.setItem(LocalStorageKeys.AUDIO_DEVICE_ID, id);
    setAudioDeviceId(id);
  }, []);

  const requestUserMedia = useCallback(async () => {
    try {
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

      setMessage({
        content: `Found ${videoDevices.length} video devices`,
        type: MessageType.RECORDER,
      });
      setMessage({
        content: `Found ${audioDevices.length} audio devices`,
        type: MessageType.RECORDER,
      });

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
      const videoDevice = videoDevices.find(
        (d) => d.deviceId === videoDeviceId
      );
      const audioDevice = audioDevices.find(
        (d) => d.deviceId === audioDeviceId
      );
      if (
        typeof videoDeviceId === "string" &&
        typeof videoDevice !== "undefined"
      ) {
        setMessage({
          content: `Found video device preference in localStorage (${videoDeviceId})`,
          type: MessageType.RECORDER,
        });
        setVideoDeviceIdLocalStorage(videoDeviceId);
      } else {
        // First, we try to find a front-facing camera
        const frontCamera = videoDevices.find((d) =>
          d.label.toLowerCase().includes("front")
        );
        // Then we default to the first device
        setVideoDeviceIdLocalStorage(
          frontCamera?.deviceId ?? videoDevices[0].deviceId
        );
      }
      if (
        typeof audioDeviceId === "string" &&
        typeof audioDevice !== "undefined"
      ) {
        setMessage({
          content: `Found audio device preference in localStorage (${audioDeviceId})`,
          type: MessageType.RECORDER,
        });
        setAudioDeviceIdLocalStorage(audioDeviceId);
      } else {
        setAudioDeviceIdLocalStorage(audioDevices[0].deviceId);
      }
    } catch (error) {
      setMessage({
        type: MessageType.ERROR,
        content: "Error requesting user media",
      });
    }
  }, [setMessage, setVideoDeviceIdLocalStorage, setAudioDeviceIdLocalStorage]);

  /* These two effects alert us when the active device changes */
  useEffect(() => {
    const videoDevice = videoDevices?.find(
      (device) => device.deviceId === videoDeviceId
    );
    if (typeof videoDevice !== "undefined") {
      setMessage({
        content: `Setting ${videoDevice.label} as video device`,
        type: MessageType.RECORDER,
      });
    }
  }, [setMessage, videoDeviceId, videoDevices]);

  useEffect(() => {
    const audioDevice = audioDevices?.find(
      (device) => device.deviceId === audioDeviceId
    );
    if (typeof audioDevice !== "undefined") {
      setMessage({
        content: `Setting ${audioDevice.label} as audio device`,
        type: MessageType.RECORDER,
      });
    }
  }, [setMessage, audioDeviceId, audioDevices]);

  /* Finally, we wrap this all up in a provider to give it to our children */
  const value = {
    videoDeviceId,
    setVideoDeviceId: setVideoDeviceIdLocalStorage,
    audioDeviceId,
    setAudioDeviceId: setAudioDeviceIdLocalStorage,
    videoDevices,
    audioDevices,
    requestUserMedia,
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

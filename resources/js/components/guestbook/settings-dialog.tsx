import * as React from "react";

// import { VisuallyHidden } from "@reach/visually-hidden";

import { useDeviceIdContext } from "@/contexts/device-id-context";
import { usePreferenceContext } from "@/contexts/preference-context";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  className?: string;
};

const SettingsDialog = ({ className = "" }: Props) => {
  const {
    videoDevices,
    audioDevices,
    videoDeviceId,
    setVideoDeviceId,
    audioDeviceId,
    setAudioDeviceId,
  } = useDeviceIdContext();

  console.log(videoDevices, audioDevices);
  const { isSoundEnabled, setIsSoundEnabled, isMotionEnabled } =
    usePreferenceContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`p-4 cursor-pointer group ${className}`}>
        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="text-xl group-hover:rotate-6 w-8 h-8" >
          <path clipRule="evenodd" fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
        </svg>
          {/* <VisuallyHidden>Open Settings</VisuallyHidden> */}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="mb-2">
          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={isSoundEnabled}
              onChange={(e) => setIsSoundEnabled(e.target.checked)}
            />
            Enable Sound
          </label>
        </div>
        <hr className="mb-4 border-gray-400" />
        <select
          className="border border-gray-400 p-2 w-full mb-4 bg-transparent appearance-none"
          onChange={(e) => setAudioDeviceId(e.target.value)}
          value={audioDeviceId}
        >
          {audioDevices &&
            audioDevices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label}
              </option>
            ))}
        </select>

        <select
          className="border border-gray-400 p-2 w-full mb-4 bg-transparent appearance-none"
          onChange={(e) => setVideoDeviceId(e.target.value)}
          value={videoDeviceId}
        >
          {videoDevices &&
            videoDevices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label}
              </option>
            ))}
        </select>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;

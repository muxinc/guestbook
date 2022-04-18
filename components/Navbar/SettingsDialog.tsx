import * as React from "react";

import { BsFillGearFill } from "react-icons/bs";

import { VisuallyHidden } from "@reach/visually-hidden";

import { useDeviceIdContext } from "contexts/DeviceIdContext";
import { usePreferenceContext } from "contexts/PreferenceContext";

import Dialog from "components/Dialog";

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
  const { isSoundEnabled, setIsSoundEnabled, isMotionEnabled } =
    usePreferenceContext();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <>
      <button
        className={`p-4 cursor-pointer group ${className}`}
        onClick={() => setIsDialogOpen(true)}
      >
        <BsFillGearFill className="text-xl text-white group-hover:rotate-6" />
        <VisuallyHidden>Open Settings</VisuallyHidden>
      </button>
      {/* These fellas are styled down below, for greater specificity */}
      <Dialog
        isDialogOpen={isDialogOpen}
        onDismiss={() => setIsDialogOpen(false)}
        label="Settings"
      >
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
        <hr className="mb-4" />
        <select
          className="border rounded-sm p-2 w-full mb-4 bg-transparent appearance-none"
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
          className="border rounded-sm p-2 w-full mb-4 bg-transparent appearance-none"
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
      </Dialog>
    </>
  );
};

export default SettingsDialog;

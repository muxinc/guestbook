import * as React from "react";

import { BsFillGearFill } from "react-icons/bs";

import { DialogOverlay, DialogContent } from "@reach/dialog";
import { VisuallyHidden } from "@reach/visually-hidden";
import "@reach/dialog/styles.css";

import * as styles from "./SettingsModal.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { useDeviceIdContext } from "contexts/DeviceIdContext";
import { usePreferenceContext } from "contexts/PreferenceContext";

const MotionDialogOverlay = motion(DialogOverlay);
const MotionDialogContent = motion(DialogContent);

type Props = {
  className?: string;
};

const SettingsModal = ({ className }: Props) => {
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
        className={`p-4 group ${className}`}
        onClick={() => setIsDialogOpen(true)}
      >
        <BsFillGearFill className="text-xl text-white group-hover:rotate-6" />
        <VisuallyHidden>Open Settings</VisuallyHidden>
      </button>
      {/* These fellas are styled down below, for greater specificity */}
      <AnimatePresence>
        {isDialogOpen && (
          <MotionDialogOverlay
            onDismiss={() => setIsDialogOpen(false)}
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MotionDialogContent
              aria-label="Settings"
              className={styles.content}
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
            >
              <div className="text-white mb-2">
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
                className="border p-2 w-full mb-4"
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
                className="border p-2 w-full mb-4"
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
            </MotionDialogContent>
          </MotionDialogOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsModal;

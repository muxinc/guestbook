import { useEffect, useCallback } from "react";
import { motion, Variants } from "motion/react";
import {
  useRecorderContext,
  CountdownStatus,
  RecordingStatus,
  RECORDING_DURATION,
} from "@/contexts/recorder-context";
import { useVideoContext } from "@/contexts/video-context";

const recordingIndicatorVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
  },
  pressed: {
    scale: 0.9,
  },
};

const RecordButton = () => {
  const {
    recordingStatus,
    countdownSecondsRemaining,
    countdownStatus,
    setCountdownStatus,
  } = useRecorderContext();
  const { openVideo, setOpenVideo } = useVideoContext();

  const startCountdown = useCallback(() => {
    setCountdownStatus(CountdownStatus.COUNTING);
  }, [setCountdownStatus]);

  const isButtonDisabled =
    countdownStatus !== CountdownStatus.READY ||
    recordingStatus !== RecordingStatus.READY;

  useEffect(() => {
    const shortcut = (evt: KeyboardEvent) => {
      if (['r', ' '].includes(evt.key)) {
        if (openVideo) setOpenVideo(null)
        else startCountdown();
        evt.preventDefault();
      }
    };

    document.addEventListener('keyup', shortcut);

    return function () {
      document.removeEventListener('keyup', shortcut)
    }
  }, [openVideo, setOpenVideo, startCountdown]);

  return (
    <motion.button
      initial="initial"
      whileHover="hover"
      whileFocus="hover"
      whileTap="pressed"
      animate={{ opacity: isButtonDisabled ? 0 : 1 }}
      disabled={isButtonDisabled}
      className={`bg-white/80 p-3 mb-3 w-40 sm:w-48 h-14 sm:h-16 relative flex items-center justify-center rounded-full text-red-700 transform-gpu`}
      onClick={startCountdown}
    >
      <motion.div
        layout
        className="h-full aspect-square"
        variants={recordingIndicatorVariants}
      >
        <svg
          viewBox="0 0 100 100"
          className="overflow-visible scale-x-[-1] rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r="50"
            className="fill-red-700 stroke-transparent"
            key="ready"
          />
        </svg>
      </motion.div>
    </motion.button>
  );
};

export default RecordButton;

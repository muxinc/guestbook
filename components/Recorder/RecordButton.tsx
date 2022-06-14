import { useState, useCallback } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

import useSound from "use-sound";
import { useEffect } from "react";
import { usePreferenceContext } from "contexts/PreferenceContext";
import { useRecorderContext, CountdownStatus, RecordingStatus, RECORDING_DURATION } from "contexts/RecorderContext";

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

const TimerButton = () => {
  const { recordingStatus, countdownSecondsRemaining, countdownStatus, setCountdownStatus } = useRecorderContext();

  const startCountdown = useCallback(() => {
    setCountdownStatus(CountdownStatus.COUNTING);
  }, [setCountdownStatus])

  return (
    <motion.button
      initial="initial"
      whileHover="hover"
      whileFocus="hover"
      whileTap="pressed"
      disabled={countdownStatus !== CountdownStatus.READY || recordingStatus !== RecordingStatus.READY}
      className={`bg-white/80 p-3 mb-3 w-40 sm:w-48 h-14 sm:h-16 relative flex items-center justify-center rounded-full text-pink-600 transform-gpu`}
      onClick={startCountdown}
    >
      {countdownStatus !== CountdownStatus.READY && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-2xl sm:text-4xl font-bold grow ${recordingStatus === RecordingStatus.RECORDING ? "animate-pulse" : ""
            }`}
        >
          {countdownSecondsRemaining}
        </motion.div>
      )}
      <motion.div
        layout
        className="h-full aspect-square"
        variants={recordingIndicatorVariants}
      >
        <svg
          viewBox="0 0 100 100"
          className="overflow-visible scale-x-[-1] rotate-90"
        >
          <AnimatePresence>
            {recordingStatus === RecordingStatus.RECORDING ? (
              <motion.circle
                initial={{ pathLength: 1 }}
                animate={{ pathLength: 0 }}
                transition={{ duration: RECORDING_DURATION }}
                cx="50"
                cy="50"
                r="40"
                strokeWidth="20"
                className="fill-transparent stroke-pink-600"
                key="recording"
              />
            ) : (
              <motion.circle
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                cx="50"
                cy="50"
                r="50"
                className="fill-pink-600 stroke-transparent"
                key="ready"
              />
            )}
          </AnimatePresence>
        </svg>
      </motion.div>
    </motion.button>
  );
};

export default TimerButton;

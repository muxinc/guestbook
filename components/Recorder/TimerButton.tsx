import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

import useSound from "use-sound";
import { useEffect } from "react";

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

enum CountdownState {
  READY,
  COUNTING,
  RECORDING,
}

type Props = {
  onCountdownStart: () => boolean;
  countdownDuration: number;
  onCountdownEnd: () => void;
  recordingDuration: number;
  onRecordingEnd: () => void;
};

const TimerButton = ({
  onCountdownStart,
  countdownDuration,
  onCountdownEnd,
  recordingDuration,
  onRecordingEnd,
}: Props) => {
  const [playSound] = useSound("sounds/beep.mp3", { volume: 0.5 });

  const [countdownState, setCountdownState] = useState(CountdownState.READY);
  const [secondsRemaining, setSecondsRemaining] =
    useState<number>(countdownDuration);

  const startCountdown = () => {
    const allowedToCountdown = onCountdownStart();
    if (allowedToCountdown) {
      setCountdownState(CountdownState.COUNTING);
      setSecondsRemaining(countdownDuration);
    }
  };

  // Let's manage our two countdowns. Pre-recording and recording.
  useEffect(() => {
    if (
      countdownState !== CountdownState.COUNTING &&
      countdownState !== CountdownState.RECORDING
    )
      return;

    const nextSecond = secondsRemaining - 1;
    const interval = setTimeout(() => {
      setSecondsRemaining(nextSecond);
      if (nextSecond === 0) {
        if (countdownState === CountdownState.COUNTING) {
          // Transition from countdown to recording
          setSecondsRemaining(recordingDuration);
          setCountdownState(CountdownState.RECORDING);
          onCountdownEnd();
        } else if (countdownState === CountdownState.RECORDING) {
          // Transition from recording to finished
          setCountdownState(CountdownState.READY);
          onRecordingEnd();
        }
      }
    }, 1000);

    return () => {
      clearTimeout(interval);
    };
  }, [
    countdownState,
    onCountdownEnd,
    onRecordingEnd,
    playSound,
    recordingDuration,
    secondsRemaining,
  ]);

  // Oh one more thing. After the countdown number has changed,
  // we play a sound if appropriate
  useEffect(() => {
    if (countdownState === CountdownState.COUNTING && secondsRemaining > 0) {
      playSound();
    }
  }, [countdownState, secondsRemaining, playSound]);

  const countdownText =
    countdownState === CountdownState.COUNTING ? secondsRemaining : "REC";

  return (
    <motion.button
      initial="initial"
      whileHover="hover"
      whileFocus="hover"
      whileTap="pressed"
      disabled={countdownState !== CountdownState.READY}
      className={`bg-gray-300/90 p-3 mb-3 w-44 flex items-center justify-center rounded-full text-pink-600`}
      onClick={startCountdown}
    >
      {countdownState !== CountdownState.READY && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-4xl font-bold grow ${
            countdownState === CountdownState.RECORDING ? "animate-pulse" : ""
          }`}
        >
          {countdownText}
        </motion.div>
      )}
      <motion.div
        layout
        variants={recordingIndicatorVariants}
        className="w-12 h-12 block"
      >
        <svg
          viewBox="0 0 100 100"
          className="overflow-visible rotate-90 scale-x-[-1]"
        >
          <AnimatePresence>
            {countdownState === CountdownState.RECORDING ? (
              <motion.circle
                initial={{ pathLength: 1 }}
                animate={{ pathLength: 0 }}
                transition={{ duration: recordingDuration }}
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

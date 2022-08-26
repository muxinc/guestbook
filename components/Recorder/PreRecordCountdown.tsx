import { useCallback } from "react";
import { motion, Variants } from "framer-motion";
import {
  useRecorderContext,
  CountdownStatus,
  COUNTDOWN_DURATION,
} from "contexts/RecorderContext";

const PreRecordCountdown = () => {
  const {
    countdownSecondsRemaining,
    countdownStatus,
    setCountdownStatus,
    setCountdownSecondsRemaining,
  } = useRecorderContext();

  const cancelCountdown = useCallback(() => {
    setCountdownStatus(CountdownStatus.READY);
    setCountdownSecondsRemaining(COUNTDOWN_DURATION);
  }, [setCountdownStatus, setCountdownSecondsRemaining]);

  if (countdownStatus !== CountdownStatus.COUNTING) return null;

  return (
    <motion.div
      className={`bg-white/80 p-3 absolute inset-0 flex items-center justify-center text-red-700 transform-gpu z-10`}
      onClick={cancelCountdown}
    >
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-[100px] md:text-[140px] font-bold inline-block`}
      >
        {countdownSecondsRemaining}
      </motion.div>
    </motion.div>
  );
};

export default PreRecordCountdown;

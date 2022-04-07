import React, { useEffect } from "react";
import { motion } from "framer-motion";
import RecordingStatus from "../constants/RecordingStatus";

const variants = {
  visible: { opacity: 1, transform: "scale(1)" },
  hidden: { opacity: 0, transform: "scale(0)" }
};

const Countdown = ({ seconds, setSeconds, setRecordingStatus }) => {
  useEffect(() => {
    const nextSecond = seconds - 1;

    const timeout = setTimeout(() => {
      setSeconds(nextSecond);
      if (nextSecond === 0) {
        setRecordingStatus(RecordingStatus.RECORDING);
      };
    }, 1000);

    return () => clearTimeout(timeout);
  }, [seconds, setSeconds, setRecordingStatus]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.75 }}
      className="fixed inset-0 bg-gray-800 flex items-center justify-center opacity-75 z-10"
    >
      <motion.div
        key={seconds}
        className="text-[200px] text-white"
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        {seconds}
      </motion.div>
    </motion.div>
  );
};

export default Countdown;
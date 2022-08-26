import * as React from "react";
import {
  useRecorderContext,
  RecordingStatus,
  RECORDING_DURATION,
} from "contexts/RecorderContext";
import { motion } from "framer-motion";

const RecordingProgress = () => {
  const { recordingStatus, setRecordingStatus } = useRecorderContext();

  if (recordingStatus !== RecordingStatus.RECORDING) return null;

  return (
    <motion.div
      className="p-4 sm:p-16 absolute w-full text-center bg-red-700"
      animate={{ x: "100%" }}
      transition={{ duration: RECORDING_DURATION }}
    ></motion.div>
  );
};

export default RecordingProgress;

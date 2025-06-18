import {
  useRecorderContext,
  RecordingStatus,
  RECORDING_DURATION,
} from "@/contexts/recorder-context";
import { motion } from "motion/react";

const RecordingProgress = () => {
  const { recordingStatus } = useRecorderContext();

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

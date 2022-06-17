import React from 'react';
import Celebration from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useRecorderContext, RecordingStatus } from "contexts/RecorderContext";

const Confetti = () => {
  const { width, height } = useWindowSize();
  const [isClient, setClient] = React.useState(false);

  const { recordingStatus } = useRecorderContext();
  const [run, shouldRun] = React.useState(false);

  React.useEffect(() => {
    setClient(true);
  }, []);

  React.useEffect(() => {
    if (recordingStatus !== RecordingStatus.STOPPING) return;
    shouldRun(true);

    const interval = setTimeout(() => {
      shouldRun(false);
    }, 5000);
  }, [recordingStatus, shouldRun]);

  return (
    <>
      {isClient && <Celebration width={width} height={height} recycle={run} />}
    </>
  )
}

export default Confetti;

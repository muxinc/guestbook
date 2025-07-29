import React from 'react';
import Celebration from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useRecorderContext, RecordingStatus } from "@/contexts/recorder-context";

const Confetti = () => {
  const { width, height } = useWindowSize();
  const [isClient, setClient] = React.useState(false);

  const { recordingStatus } = useRecorderContext();
  const [show, shouldShow] = React.useState(false)
  const [run, shouldRun] = React.useState(false);

  React.useEffect(() => {
    // Hey look the app loaded!
    setClient(true);
  }, []);

  React.useEffect(() => {
    // To prevent the confetti from firing on load,
    // we block it from rendering until we're recording
    if (recordingStatus === RecordingStatus.RECORDING) {
      shouldShow(true)
    }
  }, [recordingStatus])

  React.useEffect(() => {
    if (recordingStatus !== RecordingStatus.STOPPING) return;
    shouldRun(true);

    const interval = setTimeout(() => {
      shouldRun(false);
    }, 10000);
  }, [recordingStatus, shouldRun]);

  return (
    <>
      {isClient && <Celebration width={width} height={height} style={{opacity: show ? 1 : 0}}  recycle={run} />}
    </>
  )
}

export default Confetti;

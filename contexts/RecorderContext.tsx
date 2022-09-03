import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import useSound from "use-sound";
import { usePreferenceContext } from "contexts/PreferenceContext";
import { MessageType, useConsoleContext } from "contexts/ConsoleContext";

export enum CountdownStatus {
  READY,
  COUNTING
}

export enum RecordingStatus {
  INITIALIZING = "initializing",
  READY = "ready",
  RECORDING = "recording",
  STOPPING = "stopping"
};

export const COUNTDOWN_DURATION = 3;
export const RECORDING_DURATION = 3;

type RecorderContextValue = {
  recordingStatus: RecordingStatus;
  setRecordingStatus: (status: RecordingStatus) => void;
  countdownSecondsRemaining: number;
  countdownStatus: CountdownStatus;
  setCountdownStatus: (status: CountdownStatus) => void;
  setCountdownSecondsRemaining: (seconds: number) => void;
};

type DefaultValue = undefined;
type ContextValue = RecorderContextValue | DefaultValue;

export const RecorderContext = createContext<ContextValue>(undefined);

interface ProviderProps {
  children: React.ReactNode;
}

const RecorderProvider = ({ children }: ProviderProps) => {
  const { isSoundEnabled } = usePreferenceContext();
  const { setMessage } = useConsoleContext();

  const [playBeep] = useSound("sounds/beep.mp3", {
    volume: 0.5,
    soundEnabled: isSoundEnabled,
  });

  const [playDing] = useSound("sounds/ding.mp3", {
    volume: 0.8,
    soundEnabled: isSoundEnabled,
  });

  // Recording status will always start off as INITIALIZING on page load.
  const [recordingStatus, setRecordingStatus] = useState(
    RecordingStatus.INITIALIZING
  );

  const [countdownStatus, setCountdownStatus] = useState(CountdownStatus.READY);
  const [countdownSecondsRemaining, setCountdownSecondsRemaining] =
    useState<number>(COUNTDOWN_DURATION);

  // Update the console with a message any time the recording status changes.
  useEffect(() => {
    setMessage({
      content: recordingStatus,
      type: MessageType.RECORDER,
    });
  }, [recordingStatus, setMessage]);

  // Pre-recording countdown
  useEffect(() => {
    if (countdownStatus !== CountdownStatus.COUNTING) return;
    const nextSecond = countdownSecondsRemaining - 1;
    const interval = setTimeout(() => {
      setCountdownSecondsRemaining(nextSecond);
      if (nextSecond === 0) {
        // Transition from countdown to recording
        setRecordingStatus(RecordingStatus.RECORDING);
        setCountdownStatus(CountdownStatus.READY);
      }
    }, 1000);

    return () => {
      clearTimeout(interval);
    };
  }, [countdownStatus, countdownSecondsRemaining, setCountdownSecondsRemaining]);

  // Manage the recording timer
  useEffect(() => {
    if (recordingStatus !== RecordingStatus.RECORDING) return;
    const interval = setTimeout(() => {
      // Transition from recording to finished
      setRecordingStatus(RecordingStatus.STOPPING);

      // Reset the pre-recording countdown state
      setCountdownStatus(CountdownStatus.READY);
      setCountdownSecondsRemaining(COUNTDOWN_DURATION);
      playDing();
    }, RECORDING_DURATION * 1000);

    return () => {
      clearTimeout(interval);
    };
  }, [recordingStatus, setCountdownSecondsRemaining, playDing]);

  // After the countdown number has changed, we play a sound if appropriate
  useEffect(() => {
    if (countdownStatus === CountdownStatus.COUNTING && countdownSecondsRemaining > 0) {
      playBeep();
    }
  }, [countdownStatus, countdownSecondsRemaining, playBeep]);

  /* Finally, we wrap this all up in a provider to give it to our children */
  const value = {
    recordingStatus,
    setRecordingStatus,
    countdownStatus,
    setCountdownStatus,
    countdownSecondsRemaining,
    setCountdownSecondsRemaining
  };

  return (
    <RecorderContext.Provider value={value}>{children}</RecorderContext.Provider>
  );
};

export const useRecorderContext = () =>
  useContext(RecorderContext) as RecorderContextValue;

export default RecorderProvider;

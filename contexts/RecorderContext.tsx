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

enum CountdownState {
  READY,
  COUNTING,
  RECORDING,
}

enum RecordingStatus {
  INITIALIZING = "initializing",
  READY = "ready",
  RECORDING = "recording",
  COUNTING = "counting",
  STOPPING = "stopping"
};

const COUNTDOWN_DURATION = 2;
const RECORDING_DURATION = 3;

type RecorderContextValue = {
  recordingStatus: RecordingStatus;
  setRecordingStatus: (status: RecordingStatus) => void;
  secondsRemaining: number;
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

  const [countdownState, setCountdownState] = useState(CountdownState.READY);
  const [secondsRemaining, setSecondsRemaining] =
    useState<number>(COUNTDOWN_DURATION);

  // Begin counting down as long as the recorder is ready
  const startCountdown = useCallback(() => {
    if (recordingStatus !== RecordingStatus.READY) {
      setMessage({
        content: `Recorder not ready!`,
        type: MessageType.RECORDER,
      });
      return false;
    }

    setSecondsRemaining(COUNTDOWN_DURATION);
    setCountdownState(CountdownState.COUNTING);
  }, [recordingStatus, setMessage]);

  // Update the console with a message any time the recording status changes.
  useEffect(() => {
    setMessage({
      content: recordingStatus,
      type: MessageType.RECORDER,
    });
  }, [recordingStatus, setMessage]);

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
          setSecondsRemaining(RECORDING_DURATION);
          setCountdownState(CountdownState.RECORDING);
          setRecordingStatus(RecordingStatus.RECORDING);
        } else if (countdownState === CountdownState.RECORDING) {
          // Transition from recording to finished
          setCountdownState(CountdownState.READY);
          setRecordingStatus(RecordingStatus.STOPPING);
          playDing();
        }
      }
    }, 1000);

    return () => {
      clearTimeout(interval);
    };
  }, [
    countdownState,
    playBeep,
    playDing,
    secondsRemaining,
  ]);

  // After the countdown number has changed, we play a sound if appropriate
  useEffect(() => {
    if (countdownState === CountdownState.COUNTING && secondsRemaining > 0) {
      playBeep();
    }
  }, [countdownState, secondsRemaining, playBeep]);

  /* Finally, we wrap this all up in a provider to give it to our children */
  const value = {
    recordingStatus,
    setRecordingStatus,
    secondsRemaining
  };

  return (
    <RecorderContext.Provider value={value}>{children}</RecorderContext.Provider>
  );
};

export const useRecorderContext = () =>
  useContext(RecorderContext) as RecorderContextValue;

export default RecorderProvider;

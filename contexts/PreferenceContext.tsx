import { useContext, createContext, useEffect } from "react";
import useLocalStorageState, {
  booleanValidator,
} from "utils/useLocalStorageState";
import styles from "./PreferenceContext.module.css";

type PreferenceContextValue = {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (isSoundEnabled: boolean) => void;
  isMotionEnabled: boolean;
};
type DefaultValue = undefined;
type ContextValue = PreferenceContextValue | DefaultValue;

export const PreferenceContext = createContext<ContextValue>(undefined);

interface ProviderProps {
  children: React.ReactNode;
}

const PreferenceProvider = ({ children }: ProviderProps) => {
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorageState({
    initialValue: false,
    key: "isSoundEnabled",
    validator: booleanValidator,
  });
  const [isMotionEnabled, setIsMotionEnabled] = useLocalStorageState({
    initialValue: true,
    key: "isMotionEnabled",
    validator: booleanValidator,
  });

  /* Let's listen for changes in reduceMotion */
  useEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion)");
    const onQueryChange = (e: MediaQueryListEvent) => {
      setIsMotionEnabled(!e.matches);
    };
    reduceMotionQuery.addEventListener("change", onQueryChange);
    return () => {
      reduceMotionQuery.removeEventListener("change", onQueryChange);
    };
  });

  /* Finally, we wrap this all up in a provider to give it to our children */
  const value = {
    isSoundEnabled,
    setIsSoundEnabled,
    isMotionEnabled,
  };
  return (
    <PreferenceContext.Provider value={value}>
      <div className={!isMotionEnabled ? styles.reduceMotion : ""}>
        {children}
      </div>
    </PreferenceContext.Provider>
  );
};

export const usePreferenceContext = () =>
  useContext(PreferenceContext) as PreferenceContextValue;
export default PreferenceProvider;

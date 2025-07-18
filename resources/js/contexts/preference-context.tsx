import { useContext, createContext, useEffect } from "react";
import useLocalStorageState, {
  booleanValidator,
} from "@/hooks/use-local-storage-state";
import styles from "./preference-context.module.css";

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
    initialValue: true,
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
    if (typeof window === 'undefined') return;
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion)");
    const onQueryChange = (e: MediaQueryListEvent) => {
      setIsMotionEnabled(!e.matches);
    };
    reduceMotionQuery.addEventListener("change", onQueryChange);
    return () => {
      reduceMotionQuery.removeEventListener("change", onQueryChange);
    };
  }, [setIsMotionEnabled]);

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

export const usePreferenceContext = () => {
  const context = useContext(PreferenceContext);
  return context as PreferenceContextValue;
};

export default PreferenceProvider;

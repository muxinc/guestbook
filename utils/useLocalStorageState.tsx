import { useEffect } from "react";
import { useState } from "react";

export const booleanValidator = (value: unknown): value is boolean =>
  typeof value === "boolean";

type Config<T> = {
  initialValue: T;
  key: string;
  validator: (value: unknown) => value is T;
};

function useLocalStorageState<T>({ initialValue, key, validator }: Config<T>) {
  const scopedKey = `mux-guestbook:${key}`;

  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(scopedKey);
      if (item) {
        const parsedItem = JSON.parse(item);
        if (validator(parsedItem)) {
          setValue(parsedItem);
        }
      }
    }
  }, []);

  const setValueAndPersist = (newValue: T) => {
    setValue(newValue);
    window.localStorage.setItem(scopedKey, JSON.stringify(newValue));
  };

  return [value, setValueAndPersist] as const;
}

export default useLocalStorageState;

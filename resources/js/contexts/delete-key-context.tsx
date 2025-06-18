// the responsibility of the deletekeycontext is to keep
// localstorage `mux-guestbook:delete-keys` and clientstate in sync

import { useContext, createContext, useEffect, useCallback } from "react";
import useLocalStorageState, {
  objectValidator,
} from "@/hooks/use-local-storage-state";

type SetDeleteKeyFn = (id: string, key: string) => void;
type DeleteKeyContextValue = {
  deleteKeys: { [video_id: string]: string };
  setDeleteKey: SetDeleteKeyFn;
};
type DefaultValue = undefined;
type ContextValue = DeleteKeyContextValue | DefaultValue;

export const DeleteKeyContext = createContext<ContextValue>(undefined);

interface ProviderProps {
  children: React.ReactNode;
}

const DeleteKeyProvider = ({ children }: ProviderProps) => {
  const [deleteKeys, setDeleteKeys] = useLocalStorageState({
    initialValue: {},
    key: "delete-keys",
    validator: objectValidator,
  });
  const setDeleteKey: SetDeleteKeyFn = (id, key) => {
    setDeleteKeys({ ...deleteKeys, [id]: key });
  };

  /* Finally, we wrap this all up in a provider to give it to our children */
  const value = {
    deleteKeys,
    setDeleteKey,
  };
  return (
    <DeleteKeyContext.Provider value={value}>
      {children}
    </DeleteKeyContext.Provider>
  );
};

export const useDeleteKeyContext = () =>
  useContext(DeleteKeyContext) as DeleteKeyContextValue;
export default DeleteKeyProvider;

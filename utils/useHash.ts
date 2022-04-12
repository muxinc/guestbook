import { useCallback, useEffect, useState, useMemo } from "react";

const useHash = (): [string, (newHash: string) => void] => {
  const [hash, setHash] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.hash : ""
  );
  const cleanHash = useMemo(() => hash.replace("#", ""), [hash]);

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const setWindowHash = useCallback(
    (newHash: string) => {
      if (hash !== newHash) {
        window.location.hash = newHash;
      }
    },
    [hash]
  );

  return [cleanHash, setWindowHash];
};

export default useHash;

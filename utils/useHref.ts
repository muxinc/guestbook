import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const useHref = () => {
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(typeof window !== "undefined" ? window.location.origin : "");
  }, [])
  const { asPath } = useRouter();

  return `${origin}${asPath}`;
}

export default useHref
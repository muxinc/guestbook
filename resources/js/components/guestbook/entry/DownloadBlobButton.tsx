import { useState } from "react";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  href: string;
  filename: string;
};
/**
 * Modern browsers can download files that aren't from same origin this is a workaround to download a remote file
 * @param `href` Remote URL for the file to be downloaded
 */
const DownloadBlobButton = ({
  className = "",
  style,
  href,
  filename,
}: Props) => {
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);

  const download = (href: string, name: string) => {
    setFetching(true);
    fetch(href)
      .then((response) => response.blob())
      .then((blob) => {
        setFetching(false);
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobURL;
        a.style.display = "";
        a.download = name;
        document.body.appendChild(a);
        a.click();
      })
      .catch((e) => {
        setError(true);
        console.error(e);
      });
  };

  return (
    <button
      className={className}
      style={style}
      disabled={fetching}
      onClick={() => download(href, filename)}
    >
      {error ? "Error" : "Download"}
    </button>
  );
};

export default DownloadBlobButton;

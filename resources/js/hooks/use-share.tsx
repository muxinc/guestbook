import * as React from "react";

interface ShareData {
  title: string;
  text: string;
}

export function useShare(shareData: ShareData) {
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    if (typeof navigator?.share !== "undefined") {
      if (typeof navigator.canShare !== "undefined") {
        setCanShare(navigator.canShare(shareData));
      } else {
        setCanShare(true);
      }
    }
  }, [shareData]);

  const share = React.useCallback(() => {
    if (canShare) {
      navigator
        .share(shareData)
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  }, [canShare, shareData]);

  return {
    canShare,
    share,
  };
}

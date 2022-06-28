import * as React from "react";
import { supabase } from "utils/supabaseClient";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

import MuxVideo from "@mux-elements/mux-video-react";

import { SupabaseEntry } from "contexts/VideoContext";
import event from "constants/event";
import Navbar from "components/Navbar";
import SEO from "components/SEO";

import useHref from "utils/useHref";

type Entry = {
  playback_id: string;
};
type Props = {
  entry: Entry;
};

const Entry: NextPage<Props> = ({ entry: { playback_id } }) => {
  const href = useHref();

  const shareData = React.useMemo(
    () => ({
      title: event.title,
      text: event.shareText,
      url: href,
    }),
    [href]
  );

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

  const shareIt = React.useCallback(() => {
    if (canShare) {
      navigator
        .share(shareData)
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  }, [canShare, shareData]);

  return (
    <>
      <SEO image={`https://image.mux.com/${playback_id}/thumbnail.jpg`} />
      <Navbar withSettings={false} />
      <div className="max-w-[120vh] mx-auto px-4 sm:px-8">
        <MuxVideo
          style={{ width: "100%" }}
          playbackId={playback_id}
          metadata={{
            video_id: `video-guestbook-entry-${playback_id}`,
            video_title: `Video Guestbook Entry ${playback_id}`,
          }}
          streamType="on-demand"
          autoPlay
          controls
          muted
          loop
        />
      </div>
      <div className="flex justify-center space-x-4 p-4 sm:p-8">
        <a
          className="underline hover:no-underline"
          href={`https://twitter.com/share?text=${shareData.text}&url=${shareData.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tweet
        </a>
        <a
          className="underline hover:no-underline"
          href={`https://stream.mux.com/${playback_id}/low.mp4`}
          download
        >
          Download
        </a>
        {canShare && <button onClick={shareIt}>Share Link</button>}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (!params?.id || typeof params.id !== "string") {
    return {
      notFound: true,
    };
  }

  const { data, error } = await supabase
    .from<SupabaseEntry>("entries")
    .select("*")
    .eq("id", params.id);

  if (error) {
    return {
      notFound: true,
    };
  }

  const entry = data[0];

  return {
    props: {
      entry,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default Entry;

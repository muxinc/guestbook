import * as React from "react";
import { supabase } from "utils/supabaseClient";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

import MuxVideo from "@mux-elements/mux-video-react";

import { SupabaseEntry } from "contexts/VideoContext";
import event from "constants/event";
import Navbar from "components/Navbar";
import SEO from "components/SEO";

import useHref from "utils/useHref";

type Props = {
  playback_id: string;
  aspect_ratio: `${string}:${string}` | null;
};

const Entry: NextPage<Props> = ({ playback_id, aspect_ratio }) => {
  const href = useHref();

  const navigatorShareData = React.useMemo(
    () => ({
      title: event.title,
      text: event.navigatorShareText,
      url: href,
    }),
    [href]
  );

  const twitterShareData = React.useMemo(
    () => ({
      title: event.title,
      text: event.twitterShareText,
      url: href,
    }),
    [href]
  );

  const [canShare, setCanShare] = React.useState(false);
  React.useEffect(() => {
    if (typeof navigator?.share !== "undefined") {
      if (typeof navigator.canShare !== "undefined") {
        setCanShare(navigator.canShare(navigatorShareData));
      } else {
        setCanShare(true);
      }
    }
  }, [navigatorShareData]);

  const shareIt = React.useCallback(() => {
    if (canShare) {
      navigator
        .share(navigatorShareData)
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  }, [canShare, navigatorShareData]);

  const [aspectWidth, aspectHeight] = aspect_ratio
    ? aspect_ratio.split(":")
    : [16, 9];

  return (
    <>
      <SEO image={`https://image.mux.com/${playback_id}/thumbnail.jpg`} />
      <Navbar withSettings={false} />
      <div className="relative px-4 sm:px-8">
        <MuxVideo
          className="w-full max-w-screen-xl mx-auto max-h-[70vh]"
          style={{ aspectRatio: `${aspectWidth}/${aspectHeight}` }}
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
          playsInline
        />
      </div>
      <div className="flex justify-center space-x-4 p-4 sm:p-8">
        <a
          className="underline hover:no-underline"
          href={`https://twitter.com/share?text=${twitterShareData.text}&url=${twitterShareData.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tweet
        </a>
        <a
          className="underline hover:no-underline"
          href={`https://stream.mux.com/${playback_id}/low.mp4`}
          download="cascadiajs.mp4"
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

  if (!Array.isArray(data) || data.length === 0) {
    return {
      notFound: true,
    };
  }
  if (error) {
    console.error(error);
    throw new Error(error?.message);
  }

  const { playback_id, aspect_ratio } = data[0];

  return {
    props: {
      playback_id,
      aspect_ratio,
    },
    // keep in cache for 10 seconds
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default Entry;

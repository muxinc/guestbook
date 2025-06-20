import * as React from "react";
import { supabase } from "utils/supabaseClient";
import type { GetStaticPaths, GetStaticPropsResult, GetStaticProps, NextPage } from "next";

import MuxVideo from "@mux-elements/mux-video-react";
import event, { eventId } from "constants/event";
import { useDeleteKeyContext } from "contexts/DeleteKeyContext";
import Navbar from "components/Navbar";
import SEO from "components/SEO";

import useHref from "utils/useHref";
import OptInForm from "components/OptInForm";
import DownloadBlobButton from "components/DownloadBlobButton";
import { useRouter } from "next/router";

type Props = {
  id: string;
  playback_id: string;
  aspect_ratio: string | null;
};

const Entry: NextPage<Props> = ({ id, playback_id, aspect_ratio }) => {
  const router = useRouter();
  const { deleteKeys } = useDeleteKeyContext();
  const href = useHref();

  const shareData = React.useMemo(
    () => ({
      title: event.title,
      text: `${event.shareText} ${href}`,
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

  const deleteAsset = React.useCallback(
    (deleteKey: string) => {
      fetch("/api/delete", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ delete_key: deleteKey }),
      }).then(() => {
        router.push("/delete/success");
      });
    },
    [router]
  );

  const [aspectWidth, aspectHeight] = aspect_ratio
    ? aspect_ratio.split(":")
    : [16, 9];

  return (
    <>
      <SEO
        image={`https://image.mux.com/${playback_id}/animated.gif`}
        video={`https://stream.mux.com/${playback_id}/low.mp4`}
      />
      <Navbar
        subheading={`Thanks for signing the guestbook!`}
        withSettings={false}
      />
      <div className="relative py-4 sm:py-0 px-4 sm:px-8">
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
      <div className="flex flex-wrap justify-center space-x-4 py-8 px-4 sm:px-8">
        <a
          className="underline hover:no-underline"
          href={`https://twitter.com/share?text=${encodeURIComponent(
            event.shareText
          )}&url=${href}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tweet
        </a>
        <DownloadBlobButton
          className="underline hover:no-underline disabled:text-gray-700 disabled:no-underline"
          href={`https://stream.mux.com/${playback_id}/low.mp4`}
          filename={`${event.utmCampaign}-[${id}].mp4`}
        />
        {canShare && (
          <button className="underline hover:no-underline" onClick={shareIt}>
            Share
          </button>
        )}
        {Object.keys(deleteKeys).includes(id) && (
          <button
            className="underline hover:no-underline text-red-700"
            onClick={() => deleteAsset(deleteKeys[id])}
          >
            Delete
          </button>
        )}
      </div>
      <OptInForm className="py-8 px-4 sm:px-8 text-sm w-full max-w-screen-lg mx-auto" />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const notFoundResp: GetStaticPropsResult<Props> = {
    notFound: true,
    revalidate: 5,
  }

  if (!params?.id || typeof params.id !== "string") {
    console.warn("params do not contain an id of type string", params);
    return notFoundResp;
  }

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", params.id);

  if (!Array.isArray(data) || data.length === 0) {
    return notFoundResp;
  }
  if (error) {
    console.error(error);
    throw new Error(error?.message);
  }

  const { playback_id, aspect_ratio, event_id } = data[0];

  if (event_id !== eventId) {
    console.warn("Entry is not for this event");
    return notFoundResp;
  }

  if (!playback_id) {
    console.warn("Entry has no playback id");
    return notFoundResp;
  }

  return {
    props: {
      id: params.id,
      playback_id,
      aspect_ratio,
    },
    revalidate: process.env.VERCEL_URL !== "guestbook.mux.dev" && 30,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default Entry;

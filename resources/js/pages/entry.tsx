import * as React from "react";
import { usePage, router } from "@inertiajs/react";
import type { PageProps } from "@inertiajs/core";
import MuxVideo from "@mux/mux-video-react";
import event, { eventId } from "@/constants/event";
import { useDeleteKeyContext } from "@/contexts/delete-key-context";
import Navbar from "@/components/guestbook/nav-bar";
import SEO from "@/components/guestbook/entry/SEO";
import OptInForm from "@/components/guestbook/entry/OptInForm";
import DownloadBlobButton from "@/components/guestbook/entry/DownloadBlobButton";
import { useShare } from "@/hooks/use-share";

interface EntryData {
  id: string;
  playback_id: string;
  aspect_ratio: string | null;
}

interface Props extends PageProps {
  entry: EntryData;
}

export default function Entry() {
  const { entry } = usePage<Props>().props;
  const { deleteKeys } = useDeleteKeyContext();
  const href = window.location.href;

  const { canShare, share: shareIt } = useShare({
    title: event.title,
    text: `${event.shareText} ${href}`,
  });

  const deleteAsset = React.useCallback(
    (deleteKey: string) => {
      fetch("/api/delete", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ delete_key: deleteKey }),
      }).then(() => {
        router.visit("/delete/success");
      });
    },
    []
  );

  const [aspectWidth, aspectHeight] = entry.aspect_ratio
    ? entry.aspect_ratio.split(":")
    : [16, 9];

  return (
    <>
      <SEO
        image={`https://image.mux.com/${entry.playback_id}/animated.gif`}
        video={`https://stream.mux.com/${entry.playback_id}/low.mp4`}
      />
      <Navbar
        subheading={`Thanks for signing the guestbook!`}
        withSettings={false}
      />
      <div className="relative py-4 sm:py-0 px-4 sm:px-8">
        <MuxVideo
          className="w-full max-w-screen-xl mx-auto max-h-[70vh]"
          style={{ aspectRatio: `${aspectWidth}/${aspectHeight}` }}
          playbackId={entry.playback_id}
          metadata={{
            video_id: `video-guestbook-entry-${entry.playback_id}`,
            video_title: `Video Guestbook Entry ${entry.playback_id}`,
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
          href={`https://stream.mux.com/${entry.playback_id}/low.mp4`}
          filename={`${event.utmCampaign}-[${entry.id}].mp4`}
        />
        {canShare && (
          <button className="underline hover:no-underline" onClick={shareIt}>
            Share
          </button>
        )}
        {Object.keys(deleteKeys).includes(entry.id) && (
          <button
            className="underline hover:no-underline text-red-700"
            onClick={() => deleteAsset(deleteKeys[entry.id])}
          >
            Delete
          </button>
        )}
      </div>
      <OptInForm className="py-8 px-4 sm:px-8 text-sm w-full max-w-screen-lg mx-auto" />
    </>
  );
}
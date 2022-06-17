import * as React from "react";
import { supabase } from "../../utils/supabaseClient";
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import Head from "next/head";

import MuxVideo from "@mux-elements/mux-video-react";
import Navbar from "../../components/Navbar";
import { SupabaseEntry } from "../../contexts/VideoContext";

type Entry = {
  playback_id: string;
}

type Props = {
  entry: Entry;
};

const Entry: NextPage<Props> = ({ entry: { playback_id } }) => {

  const shareData = React.useMemo(() => ({
    title: 'AWS Summit NYC',
    text: 'OMG! We had so much fun at AWS Summit NYC!',
    url: document.location.href,
  }), []);

  const shareIt = React.useCallback(() => {
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
  }, [shareData]);

  return (
    <>
      <Head>
        <title key="title">Mux Video Guestbook</title>
        <meta
          key="description"
          name="description"
          content="For all those good memories, from your friends at Mux."
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📖</text></svg>"
        />

        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:site" name="twitter:site" content="@MuxHQ" />

        <meta key="og:site_name" property="og:site_name" content="Mux Video Guestbook" />
        <meta key="og:url" property="og:url" content={`https://guestbook.mux.dev`} />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mux Video Guestbook" />
        <meta key="og:description" property="og:description" content="For all those good memories, from your friends at Mux." />
        <meta
          key="og:image"
          property="og:image"
          content="https://mux.com/files/mux-video-logo-square.png"
        />
        <meta key="og:locale" property="og:locale" content="en_US" />
      </Head>

      <main className="h-[100vh] h-[100svh] flex flex-col">
        <Navbar />
        <MuxVideo
          style={{ height: '100%', maxWidth: '100%' }}
          playbackId={playback_id}
          metadata={{
            video_id: `video-guestbook-entry-${playback_id}`,
            video_title: `Video Guestbook Entry ${playback_id}`,
          }}
          streamType="on-demand"
          controls
          autoPlay
          muted
          loop
        />
        <div>
          <a
            href={`https://twitter.com/share?text=${shareData.text}&url=${shareData.url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tweet
          </a>
          {navigator?.canShare && navigator.canShare(shareData) && <div onClick={shareIt}>Share</div>}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (!params?.id || typeof params.id !== 'string') {
    return {
      notFound: true,
    };
  }

  const { data, error } = await supabase
    .from<SupabaseEntry>("entries")
    .select("*")
    .eq('id', params.id);

  if (error) {
    return {
      notFound: true,
    };
  }

  const entry = data[0];

  return {
    props: {
      entry
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export default Entry;

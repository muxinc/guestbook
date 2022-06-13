import { supabase } from "../../utils/supabaseClient";
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import Head from "next/head";
import { useRouter } from 'next/router'

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
  return (
    <>
      <Head>
        <title>Mux Video Guestbook | React Miami</title>
        <meta
          name="description"
          content="For all those good React Miami memories, from your good friends at Mux."
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌴</text></svg>"
        />
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

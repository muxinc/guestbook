import { supabase } from "../../utils/supabaseClient";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from 'next/router'

import MuxVideo from "@mux-elements/mux-video-react";
import Navbar from "../../components/Navbar";

const Entry: NextPage = ({ data }) => {
  const { playback_id } = data[0];

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

// This gets called on every request
export async function getServerSideProps(context) {
  const id = context.params.id;

  const { data, error } = await supabase
    .from<SupabaseEntry>("entries")
    .select("*")
    .eq('id', id);

  // Pass data to the page via props
  return { props: { data } }
}

export default Entry;

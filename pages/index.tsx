import type { NextPage } from "next";
import Head from "next/head";

import Recorder from "../components/Recorder";
import Grid from "../components/Grid";
import Navbar from "../components/Navbar";
import Confetti from "../components/Confetti";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mux Video Guestbook</title>
        <meta
          name="description"
          content="For all those good memories, from your friends at Mux."
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📖</text></svg>"
        />
      </Head>
      <main className="h-[100vh] h-[100svh] flex flex-col">
        <Confetti />
        <Navbar />
        <Recorder className="max-h-[50vh]" />
        <Grid className="grow" />
      </main>
    </>
  );
};

export default Home;

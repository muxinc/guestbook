import type { NextPage } from "next";

import Recorder from "components/Recorder";
import Grid from "components/Grid";
import Navbar from "components/Navbar";
import Confetti from "components/Confetti";
import SEO from "components/SEO";
import VideoStore from "contexts/VideoStore";

const Home: NextPage = () => {
  return (
    <VideoStore>
      <SEO />
      <main className="h-[100vh] h-[100svh] flex flex-col">
        <Confetti />
        <Navbar />
        <Recorder className="max-h-[50vh]" />
        <Grid className="grow" />
      </main>
    </VideoStore>
  );
};

export default Home;

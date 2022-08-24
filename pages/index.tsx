import type { GetStaticProps, NextPage } from "next";

import Recorder from "components/Recorder";
import Grid from "components/Grid";
import Navbar from "components/Navbar";
import Confetti from "components/Confetti";
import SEO from "components/SEO";
import VideoStore from "contexts/VideoStore";

import { getStaticVideoProps, Video } from "contexts/VideoContext";

interface HomePageProps {
  initialVideos: Video[]
}
const Home: NextPage<HomePageProps> = ({ initialVideos }) => {
  return (
    <VideoStore initialVideos={initialVideos}>
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

// since the only initial props we need are those for the VideoContext,
// we can very simply just call getStaticVideoProps and be done with it.
export const getStaticProps: GetStaticProps<HomePageProps> = async (context) => await getStaticVideoProps(context)

export default Home;

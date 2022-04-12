import type { NextPage } from "next";
import Head from "next/head";

import { useState } from "react";
import Recorder from "../components/Recorder";
import Grid from "../components/Grid";
import Navbar from "../components/Navbar";
import RecordingStatus from "../constants/RecordingStatus";

const Home: NextPage = () => {
  const [recordingStatus, setRecordingStatus] = useState(
    RecordingStatus.INITIALIZING
  );

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
      <main
        className="bg-gray-800 bg-brick h-[100vh] h-[100svh] grid"
        style={{
          gridTemplateRows: "auto auto 1fr",
        }}
      >
        <Navbar />
        <Recorder
          recordingStatus={recordingStatus}
          setRecordingStatus={setRecordingStatus}
        />
        <Grid />
      </main>
    </>
  );
};

export default Home;

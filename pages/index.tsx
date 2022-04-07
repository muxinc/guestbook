import type { NextPage } from "next";
import Head from "next/head";

import { useEffect, useState } from "react";
import Recorder from "../components/Recorder";
import Grid from "../components/Grid";
import Navbar from "../components/Navbar";
import Countdown from "../components/Countdown";
import RecordingStatus from "../constants/RecordingStatus";
import { LocalStorageKeys } from "../constants/LocalStorage";

const Home: NextPage = () => {
  const [videoDeviceId, setVideoDeviceId] = useState<string>();
  const [audioDeviceId, setAudioDeviceId] = useState<string>();
  const [recordingStatus, setRecordingStatus] = useState(
    RecordingStatus.INITIALIZING
  );
  const [countdownSec, setCountdownSec] = useState(5);

  useEffect(() => {
    // Load localStorage
    const videoDeviceId = localStorage.getItem(
      LocalStorageKeys.VIDEO_DEVICE_ID
    );
    const audioDeviceId = localStorage.getItem(
      LocalStorageKeys.AUDIO_DEVICE_ID
    );
    if (typeof videoDeviceId === "string") {
      setVideoDeviceId(videoDeviceId);
    }
    if (typeof audioDeviceId === "string") {
      setAudioDeviceId(audioDeviceId);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Mux Photobooth | React Miami</title>
        <meta
          name="description"
          content="A photobooth, for all those good React Miami memories, from your good friends at Mux."
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌴</text></svg>"
        />
      </Head>
      <main className="bg-gray-800 h-screen">
        <Navbar
          setVideoDeviceId={setVideoDeviceId}
          setAudioDeviceId={setAudioDeviceId}
        />
        {countdownSec > 0 && recordingStatus === RecordingStatus.COUNTING && (
          <Countdown
            seconds={countdownSec}
            setSeconds={setCountdownSec}
            setRecordingStatus={setRecordingStatus}
          />
        )}
        <Recorder
          audioDeviceId={audioDeviceId}
          videoDeviceId={videoDeviceId}
          recordingStatus={recordingStatus}
          setRecordingStatus={setRecordingStatus}
          setCountdownSec={setCountdownSec}
        />
        <Grid />
      </main>
    </>
  );
};

export default Home;

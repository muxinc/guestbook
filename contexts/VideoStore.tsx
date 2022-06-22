import DeviceIdProvider from "contexts/DeviceIdContext";
import VideoProvider from "contexts/VideoContext";
import RecorderProvider from "contexts/RecorderContext";

import { MotionConfig } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const VideoStore = ({ children }: Props) => (
  <DeviceIdProvider>
    <VideoProvider>
      <RecorderProvider>{children}</RecorderProvider>
    </VideoProvider>
  </DeviceIdProvider>
);

export default VideoStore;

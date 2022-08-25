import DeviceIdProvider from "contexts/DeviceIdContext";
import VideoProvider, { Video } from "contexts/VideoContext";
import RecorderProvider from "contexts/RecorderContext";

interface Props {
  initialVideos: Video[];
  children: React.ReactNode;
};

const VideoStore = ({ initialVideos, children }: Props) => (
  <DeviceIdProvider>
    <VideoProvider initialVideos={initialVideos}>
      <RecorderProvider>{children}</RecorderProvider>
    </VideoProvider>
  </DeviceIdProvider>
);

export default VideoStore;

import DeviceIdProvider from "@/contexts/device-id-context";
import VideoProvider, { Video } from "@/contexts/video-context";
import RecorderProvider from "@/contexts/recorder-context";

interface Props {
  initialVideos: Video[];
  children: React.ReactNode;
};

const VideoStore = ({ initialVideos = [], children }: Props) => (
  <DeviceIdProvider>
    <VideoProvider initialVideos={initialVideos}>
      <RecorderProvider>{children}</RecorderProvider>
    </VideoProvider>
  </DeviceIdProvider>
);

export default VideoStore;

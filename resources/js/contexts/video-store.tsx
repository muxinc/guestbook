import DeviceIdProvider from "@/contexts/device-id-context";
import VideoProvider from "@/contexts/video-context";
import RecorderProvider from "@/contexts/recorder-context";
import { Entry } from "@/types";

interface Props {
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

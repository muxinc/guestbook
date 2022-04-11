import DeviceIdProvider from "contexts/DeviceIdContext";
import PreferenceProvider from "contexts/PreferenceContext";
import VideoProvider from "contexts/VideoContext";

import { MotionConfig } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const Store = ({ children }: Props) => (
  <DeviceIdProvider>
    <PreferenceProvider>
      <VideoProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </VideoProvider>
    </PreferenceProvider>
  </DeviceIdProvider>
);

export default Store;

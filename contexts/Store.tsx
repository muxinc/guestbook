import DeviceIdProvider from "contexts/DeviceIdContext";
import PreferenceProvider from "contexts/PreferenceContext";
import VideoProvider from "contexts/VideoContext";
import ConsoleProvider from "contexts/ConsoleContext";

import { MotionConfig } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const Store = ({ children }: Props) => (
  <ConsoleProvider>
    <DeviceIdProvider>
      <PreferenceProvider>
        <VideoProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </VideoProvider>
      </PreferenceProvider>
    </DeviceIdProvider>
  </ConsoleProvider>
);

export default Store;

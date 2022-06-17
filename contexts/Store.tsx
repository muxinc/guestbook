import DeviceIdProvider from "contexts/DeviceIdContext";
import PreferenceProvider from "contexts/PreferenceContext";
import VideoProvider from "contexts/VideoContext";
import ConsoleProvider from "contexts/ConsoleContext";
import RecorderProvider from "contexts/RecorderContext";

import { MotionConfig } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const Store = ({ children }: Props) => (
  <ConsoleProvider>
    <DeviceIdProvider>
      <PreferenceProvider>
        <VideoProvider>
          <RecorderProvider>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
          </RecorderProvider>
        </VideoProvider>
      </PreferenceProvider>
    </DeviceIdProvider>
  </ConsoleProvider>
);

export default Store;

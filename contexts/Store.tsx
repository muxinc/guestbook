import DeviceIdProvider from "contexts/DeviceIdContext";
import PreferenceProvider from "contexts/PreferenceContext";
import { MotionConfig } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const Store = ({ children }: Props) => (
  <DeviceIdProvider>
    <PreferenceProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </PreferenceProvider>
  </DeviceIdProvider>
);

export default Store;

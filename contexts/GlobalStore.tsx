import PreferenceProvider from "contexts/PreferenceContext";
import ConsoleProvider from "contexts/ConsoleContext";

import { MotionConfig } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const Store = ({ children }: Props) => (
  <ConsoleProvider>
    <PreferenceProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </PreferenceProvider>
  </ConsoleProvider>
);

export default Store;

import PreferenceProvider from "contexts/PreferenceContext";
import ConsoleProvider from "contexts/ConsoleContext";

import { MotionConfig } from "framer-motion";
import DeleteKeyProvider from "./DeleteKeyContext";

type Props = {
  children: React.ReactNode;
};

const Store = ({ children }: Props) => (
  <ConsoleProvider>
    <PreferenceProvider>
      <DeleteKeyProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </DeleteKeyProvider>
    </PreferenceProvider>
  </ConsoleProvider>
);

export default Store;

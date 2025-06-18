import PreferenceProvider from "@/contexts/preference-context";
import ConsoleProvider from "@/contexts/console-context";

import { MotionConfig } from "motion/react";
import DeleteKeyProvider from "./delete-key-context";

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

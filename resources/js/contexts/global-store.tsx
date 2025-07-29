import PreferenceProvider from "@/contexts/preference-context";
import ConsoleProvider from "@/contexts/console-context";

import { MotionConfig } from "motion/react";
import DeleteKeyProvider from "./delete-key-context";
import DeviceIdProvider from "./device-id-context";

type Props = {
  children: React.ReactNode;
};

const Store = ({ children }: Props) => (
  <ConsoleProvider>
    <PreferenceProvider>
      <DeleteKeyProvider>
        <DeviceIdProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </DeviceIdProvider>
      </DeleteKeyProvider>
    </PreferenceProvider>
  </ConsoleProvider>
);

export default Store;

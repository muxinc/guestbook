import * as React from "react";

import { DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";

import styles from "./Dialog.module.css";
import { AnimatePresence, motion } from "framer-motion";

const MotionDialogOverlay = motion(DialogOverlay);
const MotionDialogContent = motion(DialogContent);

type Props = {
  isDialogOpen: boolean;
  onDismiss: () => void;
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
};

const Dialog = ({
  isDialogOpen,
  onDismiss,
  children,
  className = "",
  overlayClassName = "",
}: Props) => {
  return (
    <AnimatePresence>
      {isDialogOpen ? (
        <MotionDialogOverlay
          onDismiss={onDismiss}
          className={`${styles.overlay} ${overlayClassName}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <MotionDialogContent
            aria-label="Settings"
            className={`${styles.content} text-white ${className}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
          >
            {children}
          </MotionDialogContent>
        </MotionDialogOverlay>
      ) : null}
    </AnimatePresence>
  );
};

export default Dialog;

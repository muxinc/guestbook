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
  label: string;
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  styledDialog?: boolean;
};

const Dialog = ({
  isDialogOpen,
  onDismiss,
  children,
  label,
  className = "",
  overlayClassName = "",
  styledDialog = true,
}: Props) => {
  const dialogStyles = styledDialog
    ? `${styles.content} ${styles.styled} text-white`
    : styles.content;
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
            aria-label={label}
            className={`${dialogStyles} ${className}`}
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

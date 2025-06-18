import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Entry } from "@/types";
import VideoCard from "./video-card";
// import { useVideoContext } from "contexts/VideoContext";

import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";

const MotionDialogOverlay = motion(DialogOverlay);
const MotionDialogContent = motion(DialogContent);

const Grid = ({ entries }: { entries: Entry[] }) => {
  const [openEntry, setOpenEntry] = useState<Entry | null>(null);

  return (
    <>
      <section
        className={`bg-gray-200 p-8 overflow-y-scroll overflow-x-hidden grow`}
      >
        <motion.div
          className="grid gap-6 justify-center grid-cols-[repeat(auto-fill,_minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(160px,1fr))]"
          layoutScroll
        >
          {entries?.map((entry) => (
            <motion.button
              key={entry.id}
              onClick={() => setOpenEntry(entry)}
              whileHover={{ scale: 1.04 }}
              whileFocus={{ scale: 1.04 }}
              whileTap={{ scale: 0.9 }}
              className={`cursor-pointer entry-${entry.id}`}
            >
              <VideoCard entry={entry} label="Open Video" />
            </motion.button>
          ))}
        </motion.div>
      </section>

      <Dialog open={openEntry !== null} onOpenChange={(open) => !open && setOpenEntry(null)}>
        <AnimatePresence>
          {openEntry && (
            <>
              <MotionDialogOverlay
                className="bg-black/80 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <MotionDialogContent
                className="w-[95vw] max-w-xl p-0 bg-transparent mx-auto my-16 outline-none border-none"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                exit={{ y: -100 }}

              >
                <DialogTitle>
                  Guestbook entry
                </DialogTitle>
                <VideoCard
                  entry={openEntry}
                  label="Close Video"
                  fullscreen={true}
                  className="w-full h-full"
                />
              </MotionDialogContent>
            </>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  );
};

export default Grid;

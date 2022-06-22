import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import { Status, useVideoContext, Video } from "contexts/VideoContext";
import Dialog from "components/Dialog";
import useHash from "utils/useHash";

import VideoCard from "./Video";

type Props = {
  className?: string;
};

const Grid = ({ className = "" }: Props) => {
  const { videos } = useVideoContext();

  const [openVideo, setOpenVideo] = useState<Video | null>(null);

  return (
    <>
      <section
        className={`bg-gray-200 p-8 overflow-y-scroll overflow-x-hidden ${className}`}
      >
        <motion.div
          className="grid gap-6 justify-center grid-cols-[repeat(auto-fill,_minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(160px,1fr))]"
          layoutScroll
        >
          {videos.map((video) => (
            <motion.button
              key={video.id}
              onClick={() => setOpenVideo(video)}
              whileHover={{ scale: 1.04 }}
              whileFocus={{ scale: 1.04 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer"
            >
              <VideoCard video={video} label="Open Video" />
            </motion.button>
          ))}
        </motion.div>
      </section>
      <Dialog
        isDialogOpen={openVideo !== null}
        onDismiss={() => setOpenVideo(null)}
        label="Video"
        styledDialog={false}
        className="w-[95vw] max-w-xl p-0 bg-transparent mx-auto my-16 outline-none"
      >
        {openVideo && (
          <VideoCard
            video={openVideo}
            label="Close Video"
            fullscreen={true}
            className="w-full h-full"
          />
        )}
      </Dialog>
    </>
  );
};

export default Grid;

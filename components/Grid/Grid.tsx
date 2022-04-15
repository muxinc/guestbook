import { useMemo } from "react";

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
  const [hash, setHash] = useHash();
  const openVideo = useMemo(
    () => videos.find((video) => video.id.toString() === hash),
    [hash, videos]
  );

  return (
    <>
      <section
        className={`bg-gray-700 p-4 overflow-y-scroll overflow-x-hidden ${className}`}
      >
        <motion.div
          className="grid gap-2 justify-center grid-cols-[repeat(auto-fill,_minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(160px,1fr))]"
          layoutScroll
        >
          {videos.map((video) => (
            <motion.button
              key={video.id}
              onClick={() => setHash(video.id.toString())}
              whileHover={{ scale: 1.04 }}
              whileFocus={{ scale: 1.04 }}
              whileTap={{ scale: 0.9 }}
            >
              <VideoCard video={video} label="Open Video" />
            </motion.button>
          ))}
        </motion.div>
      </section>
      <Dialog
        isDialogOpen={typeof openVideo !== "undefined"}
        onDismiss={() => setHash("")}
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

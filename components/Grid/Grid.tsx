import { useState } from "react";
import { motion } from "framer-motion";
import { Status, useVideoContext, Video } from "contexts/VideoContext";
import VideoCard from "./Video";
import Dialog from "components/Dialog";

const Grid = () => {
  const { videos } = useVideoContext();
  const [openVideo, setOpenVideo] = useState<Video | null>(null);

  return (
    <>
      <section className="bg-gray-700 p-4 overflow-y-scroll overflow-x-hidden">
        <motion.div
          className="grid gap-2 justify-center grid-cols-[repeat(auto-fill,_minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(160px,1fr))]"
          layoutScroll
        >
          {videos.map(
            (video) =>
              video.status !== Status.PENDING && (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => setOpenVideo(video)}
                  label="Open Video"
                />
              )
          )}
        </motion.div>
      </section>
      <Dialog
        isDialogOpen={openVideo !== null}
        onDismiss={() => setOpenVideo(null)}
        label="Video"
        styledDialog={false}
      >
        {openVideo && (
          <VideoCard
            video={openVideo}
            onClick={() => setOpenVideo(null)}
            label="Close Video"
            className="mx-auto my-16 w-[95vw] max-w-xl"
            highQuality={true}
          />
        )}
      </Dialog>
    </>
  );
};

export default Grid;

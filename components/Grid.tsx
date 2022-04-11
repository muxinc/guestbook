import { motion } from "framer-motion";
import { useVideoContext, Status, isReadyVideo } from "contexts/VideoContext";
import Image from "next/image";

const Grid = () => {
  const { videos } = useVideoContext();

  return (
    <div className="bg-gray-700 flex flex-wrap justify-between gap-2 py-4 overflow-y-scroll overflow-x-hidden">
      {videos.map((video) => (
        <motion.div
          key={video.id}
          className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center cursor-pointer relative overflow-hidden"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.9 }}
        >
          {isReadyVideo(video) ? (
            <Image
              src={`https://image.mux.com/${video.playbackId}/animated.gif`}
              layout="fill"
              objectFit="cover"
              alt=""
            />
          ) : (
            video.status
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default Grid;

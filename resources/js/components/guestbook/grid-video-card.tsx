import { useState } from "react";
import { motion } from "motion/react";
import { type Entry } from "@/types";
import { Status } from "@/constants/status";

type Props = {
  entry: Entry;
};

const GridVideoCard = ({ entry }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      className="relative bg-white overflow-hidden aspect-square group rounded-3xl transition-all duration-200 hover:rounded-none"
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Thumbnail/Loading State */}
      <div className="relative w-full h-full">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            {entry.status.toUpperCase() === Status.ERROR ? (
              <div className="text-4xl">😵</div>
            ) : (
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                {entry.status.toUpperCase() === Status.UPLOADING && typeof entry.upload_progress === "number" && (
                  <div className="mt-2 text-sm text-gray-600">
                    {entry.upload_progress.toFixed()}%
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Video Thumbnail */}
        {entry.status.toUpperCase() === Status.READY && entry.playback_id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            className="w-full h-full"
          >
            <img
              src={`https://image.mux.com/${entry.playback_id}/thumbnail.jpg?time=0&width=240`}
              alt=""
              className="w-full h-full object-cover"
              onLoad={() => setIsLoaded(true)}
            />
          </motion.div>
        )}

        {/* Play Icon Overlay (only shows on hover) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={false}
        >
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
            <svg 
              className="w-6 h-6 text-white ml-1" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GridVideoCard; 
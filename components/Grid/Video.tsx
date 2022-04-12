import { useState, MouseEventHandler } from "react";

import { Video, isReadyVideo, Status } from "contexts/VideoContext";

import { motion } from "framer-motion";
import Image from "next/image";

const transitionStatuses = [
  // these are the statuses that are initialized by the client
  // and should be animated in
  Status.INITIALIZING,
  Status.UPLOADING,
  Status.UPLOADED,
];

type Props = {
  video: Video;
  onClick: MouseEventHandler<HTMLButtonElement>;
  label: string;
  className?: string;
  highQuality?: boolean;
};

const Video = ({
  video,
  onClick,
  label,
  className = "",
  highQuality = false,
}: Props) => {
  const [rotate, setRotate] = useState(() => -4 + Math.random() * 8);
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      className={`bg-gray-100 p-1 aspect-square grid justify-items-stretch rounded overflow-hidden ${className}`}
      style={{
        gridTemplateRows: "3fr 1fr",
        gridTemplateAreas: '"photo" "label"',
      }}
      initial={
        transitionStatuses.includes(video.status as Status)
          ? { y: "-160%" } // new video? slide in!
          : { opacity: 0, scale: 0.9, rotate } // just fade in if these videos are already initialized
      }
      animate={{
        y: transitionStatuses.includes(video.status as Status)
          ? ["-160%", "-50%", "0%"]
          : "0%",
        rotate: transitionStatuses.includes(video.status as Status)
          ? [0, 0, rotate]
          : rotate,
        opacity: 1,
        scale: 1,
      }}
      whileHover={{ scale: 1.04, zIndex: 1 }}
      whileFocus={{ scale: 1.04, zIndex: 1 }}
      whileTap={{ scale: 0.9 }}
      layout
      transition={{
        y: { duration: 3, times: [0, 0.88, 1], delay: 0.5 },
        rotate: { duration: 3, times: [0, 0.88, 1], delay: 0.5 },
        layout: { duration: 0.5 },
        default: { duration: 0.1 },
      }}
    >
      <div
        className="relative bg-gray-400 h-full rounded-sm overflow-hidden"
        style={{ gridArea: "photo" }}
      >
        {isReadyVideo(video) ? (
          highQuality ? (
            <Image
              // TODO: replace with player
              src={`https://image.mux.com/${video.playbackId}/animated.gif?width=640`}
              layout="fill"
              objectFit="cover"
              alt=""
            />
          ) : (
            // TOOD: fade in
            <Image
              src={`https://image.mux.com/${video.playbackId}/animated.gif`}
              layout="fill"
              objectFit="cover"
              alt=""
            />
          )
        ) : (
          <>
            <svg
              viewBox="0 0 100 100"
              className="absolute w-full h-full inset-0"
            >
              {/* TODO: loading spinner */}
              <motion.circle
                cx="50"
                cy="50"
                r="30"
                strokeWidth={10}
                className="fill-transparent stroke-gray-500"
              />
            </svg>
            <div className="absolute w-full h-full inset-0 flex items-center justify-center text-gray-800">
              {video.statusMessage}
            </div>
          </>
        )}
      </div>
      <div
        className="font-mono h-full flex items-center justify-center"
        style={{ gridArea: "label" }}
      >
        {video.status}
      </div>
    </motion.button>
  );
};

export default Video;

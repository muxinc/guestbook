import { useState, MouseEventHandler } from "react";

import { motion } from "framer-motion";
import MuxVideo from "@mux-elements/mux-video-react";

import { Video, Status } from "contexts/VideoContext";

const MotionMuxVideo = motion(MuxVideo);

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
  layoutId: string;
  className?: string;
  fullscreen?: boolean;
};

const Video = ({
  video,
  onClick,
  label,
  fullscreen = false,
  className = "",
}: Props) => {
  const [rotate] = useState(() => -4 + Math.random() * 8);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      className={`bg-gray-200 p-1 aspect-square grid justify-items-stretch rounded overflow-hidden ${className}`}
      style={{
        gridTemplateRows: "3fr 1fr",
        gridTemplateAreas: '"photo" "label"',
      }}
      initial={
        transitionStatuses.includes(video.status)
          ? { y: "-160%" } // new video? slide in!
          : { opacity: 0, scale: 0.9, rotate } // just fade in if these videos are already initialized
      }
      animate={{
        y: transitionStatuses.includes(video.status)
          ? ["-160%", "-50%", "0%"]
          : "0%",
        rotate: transitionStatuses.includes(video.status)
          ? [0, 0, rotate]
          : rotate,
        opacity: 1,
        scale: 1,
      }}
      whileHover={fullscreen ? {} : { scale: 1.04, zIndex: 1 }}
      whileFocus={fullscreen ? {} : { scale: 1.04, zIndex: 1 }}
      whileTap={fullscreen ? {} : { scale: 0.9 }}
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
        {video.status === Status.READY ? (
          fullscreen ? (
            <MotionMuxVideo
              className="h-full w-full object-cover"
              playbackId={video.playbackId}
              streamType="on-demand"
              controls={false}
              autoPlay
              loop
              onLoadedData={() => setIsLoaded(true)}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <motion.img
              animate={{
                opacity: isLoaded ? 1 : 0,
              }}
              transition={{
                duration: 3,
              }}
              src={`https://image.mux.com/${video.playbackId}/animated.gif`}
              alt=""
              className="object-cover w-full h-full"
              onLoad={() => setIsLoaded(true)}
              loading="lazy"
            />
          )
        ) : (
          <>
            <svg
              viewBox="0 0 100 100"
              className="absolute w-full h-full inset-0"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="30"
                strokeWidth={10}
                animate={{
                  pathLength:
                    video.status === Status.UPLOADING &&
                    typeof video.uploadStatus === "number"
                      ? (0.9 * video.uploadStatus) / 100
                      : 0.9,
                  rotate: video.status === Status.UPLOADING ? 270 : [270, 630],
                }}
                transition={{
                  rotate:
                    video.status === Status.UPLOADING
                      ? {}
                      : { duration: 1, ease: "linear", repeat: Infinity },
                }}
                className={`fill-transparent stroke-gray-500`}
              />
            </svg>
            <div className="absolute w-full h-full inset-0 flex items-center justify-center text-gray-800">
              {video.status === Status.UPLOADING &&
              typeof video.uploadStatus === "number"
                ? `${video.uploadStatus.toFixed()}%`
                : null}
            </div>
          </>
        )}
      </div>
      <div
        className="font-mono h-full flex items-center justify-center text-gray-700"
        style={{ gridArea: "label" }}
      >
        {video.status}
      </div>
    </motion.button>
  );
};

export default Video;

import { useEffect, useState } from "react";

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
  label: string;
  className?: string;
  fullscreen?: boolean;
};

const Video = ({ video, label, fullscreen = false, className = "" }: Props) => {
  const [rotate] = useState(() => -4 + Math.random() * 8);
  const [isLoaded, setIsLoaded] = useState(() => false);

  return (
    <motion.div
      aria-label={label}
      className={`bg-white border border-gray-300 p-1 aspect-square grid justify-items-stretch overflow-hidden ${className}`}
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
      layout
      transition={{
        y: { duration: 3, times: [0, 0.88, 1], delay: 0.5 },
        rotate: { duration: 3, times: [0, 0.88, 1], delay: 0.5 },
        layout: { duration: 0.5 },
        default: { duration: 0.1 },
      }}
    >
      <div
        className="relative bg-gray-400 h-full overflow-hidden"
        style={{ gridArea: "photo" }}
      >
        {/* Loading Spinner */}
        {!isLoaded && (
          <>
            {" "}
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
                  rotate:
                    video.status === Status.UPLOADING ? 270 : [270, 270 + 360],
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
            <div className="absolute w-full h-full inset-0 flex items-center justify-center">
              {video.status === Status.UPLOADING &&
              typeof video.uploadStatus === "number"
                ? `${video.uploadStatus.toFixed()}%`
                : null}
            </div>
          </>
        )}
        {/* image or video element */}
        {video.status === Status.READY &&
          (fullscreen ? (
            <MotionMuxVideo
              className="h-full w-full object-cover cursor-pointer"
              playbackId={video.playbackId}
              streamType="on-demand"
              loop
              autoPlay
              onLoadedData={() => setIsLoaded(true)}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              onClick={(e) => {
                // Fallback functionality in case autoplay fails
                const videoElement = e.currentTarget as HTMLVideoElement;
                // I feel like there's a more accessible way to do this.
                if (videoElement.paused) {
                  videoElement.play();
                } else {
                  videoElement.pause();
                }
              }}
            />
          ) : (
            <motion.img
              animate={{
                opacity: isLoaded ? 1 : 0,
              }}
              transition={{
                duration: 1,
              }}
              src={`https://image.mux.com/${video.playbackId}/animated.gif`}
              data-src={`https://image.mux.com/${video.playbackId}/animated.gif`}
              alt=""
              className="object-cover w-full h-full"
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={(e) => {
                const image = e.currentTarget as HTMLImageElement;
                image.src = "";
                setTimeout(() => {
                  image.src = image.dataset.src ?? "";
                }, 2000);
              }}
            />
          ))}
      </div>
      <div
        className="font-mono h-full flex items-center justify-center text-gray-700"
        style={{ gridArea: "label" }}
      >
        {video.status}
      </div>
    </motion.div>
  );
};

export default Video;

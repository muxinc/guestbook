import { useState } from "react";
import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import MuxVideo from "@mux/mux-video-react";
import { type Entry } from "@/types";
import { Status } from "@/constants/status";

import { Link } from '@inertiajs/react'
// import VisuallyHidden from "@reach/visually-hidden";

const transitionStatuses = [
  // these are the statuses that are initialized by the client
  // and should be animated in
  Status.INITIALIZING,
  Status.UPLOADING,
  Status.UPLOADED,
];

type Props = {
  entry: Entry;
  label: string;
  className?: string;
  fullscreen?: boolean;
};

const VideoCard = ({ entry, label, fullscreen = false, className = "" }: Props) => {
  const [isLoaded, setIsLoaded] = useState(() => false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = `${origin}/entry/${entry.id}`;

  return (
    <motion.div
      aria-label={label}
      className={`bg-white border border-gray-300 p-1 aspect-square grid justify-items-stretch overflow-hidden ${className}`}
      style={{
        gridTemplateRows: "3fr 1fr",
        gridTemplateAreas: '"photo" "label"',
      }}
      initial={
        transitionStatuses.includes(entry.status.toUpperCase() as Status)
          ? { y: "-160%" } // new video? slide in!
          : { opacity: 0, scale: 0.9, rotate: entry.rotation } // just fade in if these videos are already initialized
      }
      animate={{
        y: transitionStatuses.includes(entry.status.toUpperCase() as Status)
          ? ["-160%", "-50%", "0%"]
          : "0%",
        rotate: transitionStatuses.includes(entry.status.toUpperCase() as Status)
          ? [0, 0, entry.rotation]
          : entry.rotation,
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
      {/* 
          at the top of the video card, of course is the video.
          in fullscreen, this video is actually a video
          in grid, this video is just a gif
      */}
      <div
        className="relative bg-gray-400 h-full overflow-hidden"
        style={{ gridArea: "photo" }}
      >
        {/* Loading Spinner */}
        {!isLoaded && (
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
                  entry.status.toUpperCase() === Status.UPLOADING &&
                    typeof entry.upload_progress === "number"
                      ? (0.9 * entry.upload_progress) / 100
                      : 0.9,
                  rotate:
                  entry.status.toUpperCase() === Status.UPLOADING ? 270 : [270, 270 + 360],
                }}
                transition={{
                  rotate:
                  entry.status.toUpperCase() === Status.UPLOADING
                      ? {}
                      : { duration: 1, ease: "linear", repeat: Infinity },
                }}
                className={`fill-transparent stroke-gray-500`}
              />
            </svg>
            <div className="absolute w-full h-full inset-0 flex items-center justify-center">
              {entry.status.toUpperCase() === Status.UPLOADING &&
              typeof entry.upload_progress === "number"
                ? `${entry.upload_progress.toFixed()}%`
                : null}
            </div>
          </>
        )}
        {/* image or video element */}
        {entry.status.toUpperCase() === Status.READY && (
          <motion.div
            className="relative h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {fullscreen && entry.playback_id ? (
              <MuxVideo
                className="h-full w-full object-cover cursor-pointer"
                playbackId={entry.playback_id}
                streamType="on-demand"
                loop
                autoPlay
                playsInline
                onLoadedData={() => setIsLoaded(true)}
                onLoadedMetadata={() => setIsLoaded(true)}
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
              <img
                src={`https://image.mux.com/${entry.playback_id}/animated.gif?width=240`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onLoad={() => setIsLoaded(true)}
              />
            )}
          </motion.div>
        )}
      </div>

      {/* 
        the footer of the video can have one of two things:
        in fullscreen, a QR code.
        in the grid, ust the video status
      */}
      {fullscreen ? (
        <Link href={link}>
            <div className="my-5 flex gap-8 px-5">
              <QRCodeSVG value={link} />
              {/* <VisuallyHidden>Go to Video</VisuallyHidden> */}
              <div className="flex flex-col justify-center">
                <h2 className="font-bold text-xl sm:text-3xl mb-1 text-gray-700">
                  Take your video with you!
                </h2>
                <p className="sm:text-xl text-gray-600">
                  Scan or Click
                </p>
              </div>
            </div>
        </Link>
      ) : (
        <div
          className="font-mono h-full flex items-center justify-center text-gray-700"
          style={{ gridArea: "label" }}
        >
          {entry.status.toUpperCase()}
        </div>
      )}
    </motion.div>
  );
};

export default VideoCard;

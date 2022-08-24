import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import MuxVideo from "@mux-elements/mux-video-react";

import { Video, Status } from "contexts/VideoContext";
import Link from "next/link";
import VisuallyHidden from "@reach/visually-hidden";
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
  label: string;
  className?: string;
  fullscreen?: boolean;
};

const Video = ({ video, label, fullscreen = false, className = "" }: Props) => {
  const [isLoaded, setIsLoaded] = useState(() => false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = `${origin}/entry/${video.id}`;

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
          : { opacity: 0, scale: 0.9, rotate: video.rotation } // just fade in if these videos are already initialized
      }
      animate={{
        y: transitionStatuses.includes(video.status)
          ? ["-160%", "-50%", "0%"]
          : "0%",
        rotate: transitionStatuses.includes(video.status)
          ? [0, 0, video.rotation]
          : video.rotation,
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
        {video.status === Status.READY && (
          <motion.div
            className="relative h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {fullscreen && video.playbackId ? (
              <MuxVideo
                className="h-full w-full object-cover cursor-pointer"
                playbackId={video.playbackId}
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
              <Image
                src={`https://image.mux.com/${video.playbackId}/animated.gif`}
                alt=""
                layout="fill"
                objectFit="cover"
                onLoad={() => setIsLoaded(true)}
              />
            )}
          </motion.div>
        )}
      </div>

      {fullscreen ? (
        <Link href={link}>
          <a>
            <div className="my-5 flex gap-8 px-5">
              <QRCodeSVG value={link} />
              <VisuallyHidden>Go to Video</VisuallyHidden>
              <div className="flex flex-col justify-center">
                <h2 className="font-bold text-xl sm:text-3xl mb-1 text-gray-700">
                  Scan or Click
                </h2>
                <p className="sm:text-xl text-gray-600">
                  Take your video with you!
                </p>
              </div>
            </div>
          </a>
        </Link>
      ) : (
        <div
          className="font-mono h-full flex items-center justify-center text-gray-700"
          style={{ gridArea: "label" }}
        >
          {video.status}
        </div>
      )}
    </motion.div>
  );
};

export default Video;

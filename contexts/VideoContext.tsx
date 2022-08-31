import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import * as UpChunk from "@mux/upchunk";
import { supabase } from "utils/supabaseClient";

import formatBytes from "utils/formatBytes";
import { MessageType, useConsoleContext } from "./ConsoleContext";
import { GetStaticProps } from "next";

export const getVideoRotation = () => -4 + Math.random() * 8;
import { Database } from "utils/DatabaseDefinitions";
import { useDeleteKeyContext } from "./DeleteKeyContext";

export enum Status {
  INITIALIZING = "INITIALIZING", // about to upload
  UPLOADING = "UPLOADING",
  UPLOADED = "UPLOADED",
  PENDING = "PENDING", // uploading from another client
  PREPARING = "PREPARING",
  READY = "READY",
  ERROR = "ERROR",
  UNKNOWN = "UNKNOWN",
}
export interface Video {
  id: number;
  status: Status;
  // TODO: conditional fields based on type
  uploadStatus?: number;
  playbackId?: string | null;
  // despite being a UI concern, the amount that a video card is rotated lives here in data
  // so that both he server and the client would rotate the video the same way.
  // This prevents hydration errors.
  rotation: number;
}
type VideoContextValue = {
  videos: Video[];
  setVideo: (video: Video) => void;
  setOpenVideo: (video: Video | null) => void;
  submitUpload: (file: File) => void;
  openVideo: Video | null;
};
type DefaultValue = undefined;
type ContextValue = VideoContextValue | DefaultValue;

export const VideoContext = createContext<ContextValue>(undefined);

interface ProviderDataProps {
  initialVideos: Video[];
}
interface ProviderProps extends ProviderDataProps {
  children: React.ReactNode;
}
enum SupabaseStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  READY = "ready",
}
export type SupabaseEntry = {
  id: number;
  event_id: number;
  created_at: string;
  playback_id: string;
  status: SupabaseStatus;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  aspect_ratio: `${string}:${string}` | null;
};
const supabaseToVideoStatus: Record<SupabaseStatus, Status> = {
  [SupabaseStatus.PENDING]: Status.PENDING,
  [SupabaseStatus.PREPARING]: Status.PREPARING,
  [SupabaseStatus.READY]: Status.READY,
};

const VideoProvider = ({ initialVideos, children }: ProviderProps) => {
  const { setMessage } = useConsoleContext();
  const { setDeleteKey } = useDeleteKeyContext();
  const [openVideo, setOpenVideo] = useState<Video | null>(null);

  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const setVideo = useCallback((newVideo: Omit<Video, "rotation">) => {
    setVideos((videos) => {
      const ids = videos.map((video) => video.id);
      if (ids.includes(newVideo.id)) {
        // UPDATE
        return videos.map((video) =>
          video.id === newVideo.id ? { ...video, ...newVideo } : video
        );
      } else {
        // ADD
        const newVideoWithRotation = {
          ...newVideo,
          rotation: getVideoRotation(),
        };
        return [newVideoWithRotation, ...videos];
      }
    });
  }, []);

  const removeVideo = useCallback(
    (id: number) => {
      const updated = videos.filter((v) => v.id !== id);
      setVideos(updated);
    },
    [videos]
  );

  // And let's listen to updates from the db, too
  useEffect(() => {
    const channel = supabase
      .channel("entries")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "entries",
        },
        ({
          old,
          new: { status, id, playback_id },
          eventType,
        }: {
          old: { id: number };
          new: Database["public"]["Tables"]["entries"]["Row"];
          eventType: string;
        }) => {
          if (eventType === "DELETE") {
            removeVideo(old.id);
            return;
          }

          switch (status) {
            case "preparing": {
              setVideo({
                id: id,
                status: Status.PREPARING,
              });
              break;
            }
            case "ready": {
              const videoData = {
                id: id,
                status: Status.READY,
                playbackId: playback_id,
              };

              setVideo(videoData);

              setOpenVideo((v) => {
                if (!v) return v;
                if (v.id !== id) return v;

                return {
                  id,
                  status: Status.READY,
                  playbackId: playback_id,
                  rotation: v.rotation,
                };
              });
            }
          }
          setMessage({
            content: `(${eventType})`,
            data: { id, status, playback_id },
            type: MessageType.SUPABASE,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setMessage, setVideo, setOpenVideo]);

  const submitUpload = useCallback(
    async (file: File) => {
      try {
        setMessage({
          content:
            "Requesting authenticated url from Mux via serverless function",
          type: MessageType.NEXT,
        });

        const response = await fetch("/api/upload", { method: "POST" });
        const { id, url, delete_key } = await response.json();

        setMessage({
          content: `Received authenticated url from Mux: ${url}.`,
          type: MessageType.NEXT,
        });

        setVideo({
          id,
          status: Status.INITIALIZING,
        });

        setDeleteKey(id, delete_key);

        setMessage({
          content: `Uploading with chunk size ${formatBytes(30720)}.`,
          type: MessageType.NEXT,
        });
        const upload = UpChunk.createUpload({
          endpoint: url, // Authenticated url
          file, // File object with your video file’s properties
          chunkSize: 30720, // Uploads the file in ~30 MB chunks
        });

        upload.on("error", (error) => {
          console.error(error);
          setVideo({
            id,
            status: Status.ERROR,
          });
        });

        upload.on("progress", (progress) => {
          setMessage({
            content: `Progress: ${progress.detail.toFixed()}/100`,
            type: MessageType.UPCHUNK,
          });
          setVideo({
            id,
            status: Status.UPLOADING,
            uploadStatus: progress.detail,
          });
        });

        upload.on("success", () => {
          setMessage({
            content: `Upload success!`,
            type: MessageType.UPCHUNK,
          });
          setVideo({
            id,
            status: Status.UPLOADED,
          });
          setOpenVideo({
            id,
            status: Status.UPLOADED,
            rotation: getVideoRotation(),
          });
        });
      } catch (error) {
        console.error("Failed to get upload URL");
        console.error(error);
        return;
      }
    },
    [setMessage, setVideo, setOpenVideo]
  );

  const value: VideoContextValue = {
    videos,
    setVideo,
    submitUpload,
    openVideo,
    setOpenVideo,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

export default VideoProvider;

// Any consumers of this context can use this handy hook
// to get going in a type-safe manner
export const useVideoContext = () =>
  useContext(VideoContext) as VideoContextValue;

// One last thought:
// this context is initialized by means of getStaticProps.
export const getStaticVideoProps: GetStaticProps<
  ProviderDataProps
> = async () => {
  // On load, let's get the backlog of videos
  let { data: entries, error } = await supabase
    .from("entries")
    .select("*")
    .eq("event_id", 2468)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error?.message);
  }

  if (entries) {
    const entryVideos: Video[] = entries
      .map((entry) => ({
        id: entry.id,
        status: Object.values(SupabaseStatus).includes(
          entry.status as SupabaseStatus
        )
          ? supabaseToVideoStatus[entry.status as SupabaseStatus]
          : Status.UNKNOWN,
        playbackId: entry.playback_id,
        rotation: getVideoRotation(),
      }))
      .filter((video) => video.status !== Status.PENDING);
    return {
      props: {
        initialVideos: entryVideos,
      },
      revalidate: process.env.VERCEL_ENV !== "production" && 30,
    };
  }
  return {
    props: {
      initialVideos: [],
    },
    revalidate: process.env.VERCEL_ENV !== "production" && 30,
  };
};

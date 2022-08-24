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
import useHash from "utils/useHash";
import { MessageType, useConsoleContext } from "./ConsoleContext";
import { Database } from "utils/DatabaseDefinitions";

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
  assetId?: string | null;
  playbackId?: string | null;
}
type VideoContextValue = {
  videos: Video[];
  setVideo: (video: Video) => void;
  submitUpload: (file: File) => void;
};
type DefaultValue = undefined;
type ContextValue = VideoContextValue | DefaultValue;

export const VideoContext = createContext<ContextValue>(undefined);

type ProviderProps = {
  children: React.ReactNode;
};
enum SupabaseStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  READY = "ready",
}
export type SupabaseEntry = {
  id: number;
  event_id: number;
  asset_id: string;
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

const VideoProvider = ({ children }: ProviderProps) => {
  const { setMessage } = useConsoleContext();
  const [, setHash] = useHash();

  const [videos, setVideos] = useState<Video[]>([]);
  const setVideo = useCallback((newVideo: Video) => {
    setVideos((videos) => {
      const ids = videos.map((video) => video.id);
      if (ids.includes(newVideo.id)) {
        // UPDATE
        return videos.map((video) =>
          video.id === newVideo.id ? { ...video, ...newVideo } : video
        );
      } else {
        // ADD
        return [newVideo, ...videos];
      }
    });
  }, []);

  // On load, let's get the backlog of videos
  useEffect(() => {
    const ac = new AbortController();
    const initialize = async () => {
      let { data: entries, error } = await supabase
        .from("entries")
        .select("*")
        .eq("event_id", 2)
        .order("created_at", { ascending: false });
      // .abortSignal(ac.signal);

      if (entries) {
        const entryVideos: Video[] = entries
          .map((entry) => ({
            id: entry.id,
            status: supabaseToVideoStatus[entry.status] || Status.UNKNOWN,
            assetId: entry.asset_id,
            playbackId: entry.playback_id,
          }))
          .filter((video) => video.status !== Status.PENDING);
        setMessage({
          content: `Loaded ${entryVideos.length} videos`,
          type: MessageType.SUPABASE,
        });
        // I want this to be setVideos(videos => [...videos, ...entryVideos]) in case this operation is slow
        // but react strict mode calls this effect twice
        // meaning that we have 2x entryVideos.
        // React is trying to tell me I'm doing something wrong
        // But I don't know what.
        // TODO: figure it out
        setVideos(entryVideos);
      }
    };
    initialize();
    return () => ac.abort();
  }, [setMessage]);

  // And let's listen to updates from the db, too
  useEffect(() => {
    const channel = supabase
      .channel('entries')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'entries',
        },
        ({ new: { status, id, asset_id, playback_id }, eventType }: { new: Database["public"]["Tables"]["entries"]["Row"], eventType: string }) => {
          switch (status) {
            case "preparing": {
              setVideo({
                id: id,
                status: Status.PREPARING,
              });
            }
            case "ready": {
              setVideo({
                id: id,
                status: Status.READY,
                assetId: asset_id,
                playbackId: playback_id,
              });

              setHash(id.toString());
            }
          }
          setMessage({
            content: `(${eventType})`,
            data: { id, status, asset_id, playback_id },
            type: MessageType.SUPABASE,
          });
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [setMessage, setVideo, setHash]);

  const submitUpload = useCallback(
    async (file: File) => {
      try {
        setMessage({
          content:
            "Requesting authenticated url from Mux via serverless function",
          type: MessageType.NEXT,
        });

        const response = await fetch("/api/upload", { method: "POST" });
        const { id, url } = await response.json();

        setMessage({
          content: `Received authenticated url from Mux: ${url}.`,
          type: MessageType.NEXT,
        });

        const video: Video = {
          id,
          status: Status.INITIALIZING,
        };
        setVideo(video);

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
        });
      } catch (error) {
        console.error("Failed to get upload URL");
        console.error(error);
        return;
      }
    },
    [setMessage, setVideo]
  );


  const value: VideoContextValue = {
    videos,
    setVideo,
    submitUpload,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () =>
  useContext(VideoContext) as VideoContextValue;
export default VideoProvider;

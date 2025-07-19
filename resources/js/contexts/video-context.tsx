import {
  useContext,
  createContext,
  useState,
  useCallback,
} from "react";

import * as UpChunk from "@mux/upchunk";
import formatBytes from "@/lib/utils";
import { MessageType, useConsoleContext } from "./console-context";
import { useEventStream } from "@laravel/stream-react";
import { Entry } from "@/types";
import { type SharedData } from '@/types';

export const getVideoRotation = () => -4 + Math.random() * 8;
import { eventId } from "@/constants/event";
import { useDeleteKeyContext } from "./delete-key-context";
import { usePage } from '@inertiajs/react';

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

type VideoContextValue = {
  videos: Entry[];
  setVideo: (video: Entry) => void;
  setOpenVideo: (video: Entry | null) => void;
  submitUpload: (file: File) => void;
  openVideo: Entry | null;
};
type DefaultValue = undefined;
type ContextValue = VideoContextValue | DefaultValue;

export const VideoContext = createContext<ContextValue>(undefined);


interface ProviderProps {
  children: React.ReactNode;
}

const VideoProvider = ({ children }: ProviderProps) => {
  const { setMessage } = useConsoleContext();
  const { setDeleteKey } = useDeleteKeyContext();
  const [openVideo, setOpenVideo] = useState<Entry | null>(null);
  const { entries: initialEntries } = usePage<SharedData>().props;

  const [videos, setVideos] = useState<Entry[]>(initialEntries);
  
  const setVideo = useCallback((newVideo: Entry) => {
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

  const [reconnectKey, setReconnectKey] = useState(0);

  // Listen to SSE updates for video status changes
  const { message } = useEventStream(`/events?v=${reconnectKey}`, {
    eventName: 'update',
    onError: () => {
      // Reconnect after 3 seconds by changing the URL
      setTimeout(() => {
        setReconnectKey(prev => prev + 1);
      }, 3000);
    },
    onMessage: (event) => {
      console.log('SSE video update:', event);
      try {
        const entryData = JSON.parse(event.data);
        console.log('SSE video update:', entryData);
        
        // Update the video in our state
        setVideo(entryData);

        // Update open video if it's the same one
        setOpenVideo((v) => {
          if (!v) return v;
          if (v.id !== entryData.id) return v;

          return {
            ...v,
            ...entryData,
          };
        });

        // Log the status change
        setMessage({
          content: `Video ${entryData.id} status: ${entryData.status}`,
          data: { id: entryData.id, status: entryData.status, playback_id: entryData.playback_id },
          type: MessageType.LARAVEL,
        });
      } catch (error) {
        console.error('Error parsing SSE video data:', error);
      }
    }
  });

  const submitUpload = useCallback(
    async (file: File) => {
      try {
        setMessage({
          content:
            "Requesting authenticated url from Mux via Laravel endpoint",
          type: MessageType.LARAVEL,
        });

        const response = await fetch("/upload", { method: "POST" });
        const { id, url, delete_key } = await response.json();

        setMessage({
          content: `Received authenticated url from Mux: ${url}.`,
          type: MessageType.LARAVEL,
        });

        setVideo({
          id,
          status: Status.INITIALIZING,
          playback_id: '',
          created_at: new Date().toISOString(),
          aspect_ratio: '',
          event_id: parseInt(import.meta.env.VITE_PUBLIC_EVENT_ID || "8"),
        });

        setDeleteKey(id, delete_key);

        setMessage({
          content: `Uploading with chunk size ${formatBytes(30720)}.`,
          type: MessageType.LARAVEL,
        });
        const upload = UpChunk.createUpload({
          endpoint: url, // Authenticated url
          file, // File object with your video file's properties
          chunkSize: 30720, // Uploads the file in ~30 MB chunks
        });

        upload.on("error", (error) => {
          console.error(error);
          setVideo({
            id,
            status: Status.ERROR,
            playback_id: '',
            created_at: new Date().toISOString(),
            aspect_ratio: '',
            event_id: parseInt(import.meta.env.VITE_PUBLIC_EVENT_ID || "8"),
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
            upload_progress: progress.detail,
            playback_id: '',
            created_at: new Date().toISOString(),
            aspect_ratio: '',
            event_id: parseInt(import.meta.env.VITE_PUBLIC_EVENT_ID || "8"),
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
            playback_id: '',
            created_at: new Date().toISOString(),
            aspect_ratio: '',
            event_id: parseInt(import.meta.env.VITE_PUBLIC_EVENT_ID || "8"),
          });
          setOpenVideo({
            id,
            status: Status.UPLOADED,
            rotation: getVideoRotation(),
            playback_id: '',
            created_at: new Date().toISOString(),
            aspect_ratio: '',
            event_id: parseInt(import.meta.env.VITE_PUBLIC_EVENT_ID || "8"),
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
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import * as UpChunk from "@mux/upchunk";
import { supabase } from "../utils/supabaseClient";

import SignupDialog, { Form, SignupDismissFn } from "components/SignupDialog";

export enum Status {
  INITIALIZING = "INITIALIZING",
  UPLOADING = "UPLOADING",
  UPLOADED = "UPLOADED",
  CREATED = "CREATED",
  READY = "READY",
  ERROR = "ERROR",
  UNKNOWN = "UNKNOWN",
}
interface AnyOldVideo {
  id: string;
  status: Omit<Status, Status.READY>;
  statusMessage?: string;
}
interface ReadyVideo extends AnyOldVideo {
  status: Status.READY;
  playbackId: string;
}
type Video = AnyOldVideo | ReadyVideo;
export const isReadyVideo = (video: Video): video is ReadyVideo =>
  video.status === Status.READY;

type VideoContextValue = {
  videos: Video[];
  submitUpload: (file: File) => void;
};
type DefaultValue = undefined;
type ContextValue = VideoContextValue | DefaultValue;

export const VideoContext = createContext<ContextValue>(undefined);

type ProviderProps = {
  children: React.ReactNode;
};
type SupabaseEntry = {
  // TODO: generate types
  id: number;
  event_id: number;
  asset_id: string;
  created_at: string;
  playback_id: string;
  status: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
};

const VideoProvider = ({ children }: ProviderProps) => {
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
        .from<SupabaseEntry>("entries")
        .select("*")
        .order("created_at", { ascending: false });
      // .abortSignal(ac.signal);

      if (entries) {
        const entryVideos: Video[] = entries.map((entry) => ({
          id: entry.asset_id,
          status: entry.status === "ready" ? Status.READY : Status.UNKNOWN,
          playbackId: entry.playback_id,
        }));
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
  }, []);

  // And let's listen to updates from the db, too
  useEffect(() => {
    const subscription = supabase
      .from<SupabaseEntry>("entries")
      .on("*", (payload) => console.log({ payload }))
      .subscribe();
    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  // Here's some state that doesn't get passed down.
  // When a user submits an upload, we pop up the signup dialog
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState<boolean>(false);
  const [onSignupDialogDismiss, setOnSignupDialogDismiss] =
    // This is an initializer function that returns () => {}
    // so the initial state is actually just going to be () => {}. Just to be clear.
    useState<SignupDismissFn>(() => () => {});

  const submitUpload = useCallback(
    async (file: File, form?: Form) => {
      try {
        const body = new URLSearchParams(form);
        const response = await fetch("/api/upload", { method: "POST", body });
        const { id, url } = await response.json();

        const video: Video = {
          id,
          status: Status.INITIALIZING,
        };
        setVideo(video);

        const upload = UpChunk.createUpload({
          endpoint: url, // Authenticated url
          file, // File object with your video file’s properties
          chunkSize: 30720, // Uploads the file in ~30 MB chunks
        });

        upload.on("error", (error) => {
          console.log(error);
          setVideo({
            id,
            status: Status.ERROR,
            statusMessage: error.detail,
          });
        });

        upload.on("progress", (progress) => {
          setVideo({
            id,
            status: Status.UPLOADING,
            statusMessage: progress.detail,
          });
        });

        upload.on("success", () => {
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
    [setVideo]
  );

  const preSubmitUpload = useCallback(
    (file: File) => {
      // Before we submit our upload,
      // let's offer the user a chance to sign up
      const timeout = setTimeout(() => {
        // after a short timeout.
        // feels like better ux
        setIsSignupDialogOpen(true);
      }, 750);
      // We can't just say (form) => { ... }
      // because setState accepts an updater function.
      // So we use that updater function to return (form) => { ... }
      const onDismiss = (form?: Form) => {
        submitUpload(file, form);
        setIsSignupDialogOpen(false);
      };
      setOnSignupDialogDismiss(() => onDismiss);

      return () => clearTimeout(timeout);
    },
    [submitUpload]
  );

  const value: VideoContextValue = {
    videos,
    submitUpload: preSubmitUpload,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
      <SignupDialog
        isDialogOpen={isSignupDialogOpen}
        onDismiss={onSignupDialogDismiss}
      />
    </VideoContext.Provider>
  );
};

export const useVideoContext = () =>
  useContext(VideoContext) as VideoContextValue;
export default VideoProvider;

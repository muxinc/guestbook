export enum SupabaseStatus {
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
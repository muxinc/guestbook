export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: number;
          event_id: number | null;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          event_id?: number | null;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          event_id?: number | null;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          created_at?: string | null;
        };
      };
      activity: {
        Row: {
          id: number;
          created_at: string | null;
          payload: string | null;
          entry_id: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          payload?: string | null;
          entry_id?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          payload?: string | null;
          entry_id?: number | null;
        };
      };
      assets: {
        Row: {
          id: number;
          entry_id: number | null;
          asset_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          entry_id?: number | null;
          asset_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          entry_id?: number | null;
          asset_id?: string | null;
          created_at?: string | null;
        };
      };
      entries: {
        Row: {
          id: number;
          created_at: string | null;
          playback_id: string | null;
          event_id: number | null;
          status: string | null;
          aspect_ratio: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          playback_id?: string | null;
          event_id?: number | null;
          status?: string | null;
          aspect_ratio?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          playback_id?: string | null;
          event_id?: number | null;
          status?: string | null;
          aspect_ratio?: string | null;
        };
      };
      events: {
        Row: {
          id: number;
          created_at: string | null;
          name: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          name?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          name?: string | null;
        };
      };
    };
    Functions: {};
  };
}
import type { NextApiRequest, NextApiResponse } from "next";

import supabaseAdmin from "utils/supabaseAdmin";

type Data = {
  status: string;
};

type Metadata = {
  entry_id: number;
};

type Payload = {
  id: number;
  playback_id: string;
  status: string;
  aspect_ratio?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { type, data } = req.body;

  console.log(data);
  console.log(type);

  switch (type) {
    case "video.upload.asset_created": {
      const { id, asset_id, new_asset_settings: { passthrough } } = data;
      const metadata: Metadata = passthrough ? JSON.parse(passthrough) : {};
      await supabaseAdmin.from("assets").insert([{ entry_id: metadata.entry_id, asset_id, delete_key: id }])
      return res.status(200).json({ status: "ok" });
    }

    case "video.asset.created":
    case "video.asset.ready": {
      const {
        passthrough,
        status,
        playback_ids,
        aspect_ratio,
      } = data;

      const metadata: Metadata = passthrough ? JSON.parse(passthrough) : {};

      let payload: Payload = {
        id: metadata.entry_id,
        playback_id: playback_ids[0].id,
        status,
      };

      if (aspect_ratio) {
        payload.aspect_ratio = aspect_ratio;
      }

      // Check if entry exists
      const { data: entry } = await supabaseAdmin.from("entries").select("*").eq('id', metadata.entry_id);

      if (entry && entry[0].status === "ready") {
        return res.status(200).json({ status: "noop" });
      }

      const { data: result, error } = await supabaseAdmin
        .from("entries")
        .upsert([payload]);

      // Store payload
      await supabaseAdmin
        .from("activity")
        .insert([{ entry_id: metadata.entry_id, payload: JSON.stringify(data) }]);

      return res.status(200).json({ status: "ok" });
    }

    default:
      res.status(200).json({ status: "ignored" });
      return;
  }
}

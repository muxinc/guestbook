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

const EVENTS = ["video.asset.created", "video.asset.ready"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { type, data } = req.body;

  if (!EVENTS.includes(type)) {
    res.status(200).json({ status: "ignored." });
    return;
  }

  const {
    id: asset_id,
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

  const { data: entry } = await supabaseAdmin.from("entries").select("*").eq('id', metadata.entry_id);

  if (entry && entry[0].status === "ready") {
    return;
  }

  const { data: result, error } = await supabaseAdmin
    .from("entries")
    .upsert([payload]);

  // Store asset
  if (type === "video.asset.created") {
    await supabaseAdmin.from("assets").insert([{ entry_id: metadata.entry_id, asset_id }])
  }

  // Store payload
  await supabaseAdmin
    .from("activity")
    .insert([{ entry_id: metadata.entry_id, payload: JSON.stringify(data) }]);

  res.status(200).json({ status: "ok" });
}

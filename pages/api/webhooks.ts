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
  asset_id: string;
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

  console.log(type);
  console.log(data);

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
    asset_id,
    playback_id: playback_ids[0].id,
    status,
  };

  if (aspect_ratio) {
    payload.aspect_ratio = aspect_ratio;
  }

  const { data: result, error } = await supabaseAdmin
    .from("entries")
    .insert([payload], {
      upsert: true,
    });

  // Store payload
  await supabaseAdmin
    .from("activity")
    .insert([{ entry_id: metadata.entry_id, payload: JSON.stringify(data) }]);

  res.status(200).json({ status: "ok" });
}

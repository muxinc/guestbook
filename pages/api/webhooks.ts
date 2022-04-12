import type { NextApiRequest, NextApiResponse } from "next";

import supabaseAdmin from "../../utils/supabaseAdmin";

type Data = {
  status: string;
};

type Metadata = {
  entry_id?: number;
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

  const { id: asset_id, passthrough, status, playback_ids } = data;

  const metadata: Metadata = passthrough ? JSON.parse(passthrough) : {};

  const { data: result, error } = await supabaseAdmin.from("entries").insert(
    [
      {
        id: metadata.entry_id,
        asset_id,
        playback_id: playback_ids[0].id,
        status,
      },
    ],
    {
      upsert: true,
    }
  );

  res.status(200).json({ status: "ok" });
}

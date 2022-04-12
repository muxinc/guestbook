import type { NextApiRequest, NextApiResponse } from "next";
const Mux = require("@mux/mux-node").default;

import supabaseAdmin from "../../utils/supabaseAdmin";

type Data = {
  status: string;
};

type Metadata = {
  entry_id?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { Video } = new Mux(
    process.env.MUX_ACCESS_TOKEN,
    process.env.MUX_SECRET_TOKEN
  );

  const {
    type,
    data: { id: asset_id, playback_ids, passthrough, status },
  } = req.body;

  if (type !== "video.asset.created" || type !== "video.asset.ready") {
    res.status(200).json({ status: "ignored." });
  }

  const metadata: Metadata = passthrough ? JSON.parse(passthrough) : {};
  const { entry_id } = metadata;

  const { data, error } = await supabaseAdmin.from("entries").insert(
    [
      {
        id: entry_id,
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

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

  const { type, data } = req.body;

  console.log(type);
  console.log(data);

  if (type !== "video.upload.created" || type !== "video.asset.ready") {
    res.status(200).json({ status: "ignored." });
  }

  if (type === "video.upload.created") {
    const {
      new_asset_settings: { passthrough },
      status,
    } = data;

    const metadata: Metadata = passthrough ? JSON.parse(passthrough) : {};

    const { data: result, error } = await supabaseAdmin.from("entries").insert(
      [
        {
          id: metadata.entry_id,
          status,
        },
      ],
      {
        upsert: true,
      }
    );
  }

  if (type === "video.asset.ready") {
    const { id: asset_id, passthrough, playback_ids, status } = data;

    const metadata: Metadata = passthrough ? JSON.parse(passthrough) : {};

    const { data: result, error } = await supabaseAdmin.from("entries").insert(
      [
        {
          id: metadata.entry_id,
          status,
          playback_id: playback_ids[0].id,
        },
      ],
      {
        upsert: true,
      }
    );
  }

  res.status(200).json({ status: "ok" });
}

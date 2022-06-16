// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "../../utils/supabaseAdmin";

const Mux = require("@mux/mux-node").default;
import { createClient, PostgrestResponse } from "@supabase/supabase-js";

type Data = {
  id: number | null;
  url: string;
};

type Entry = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  asset_id?: string;
  created_at: string;
  playback_id?: string;
  event_id: number;
  status: "pending";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { firstName, lastName, email } = req.body;

  const { Video } = new Mux(
    process.env.MUX_ACCESS_TOKEN,
    process.env.MUX_SECRET_TOKEN
  );

  const { data, error } = await supabaseAdmin.from<Entry>("entries").insert([
    {
      first_name: firstName || null,
      last_name: lastName || null,
      email: email || null,
      event_id: 2,
    },
  ]);

  if (error) {
    res.status(500).end("could not create record");
  }

  // This ultimately just makes a POST request to https://api.mux.com/video/v1/uploads with the supplied options.
  const upload = await Video.Uploads.create({
    cors_origin: "https://your-app.com",
    new_asset_settings: {
      playback_policy: "public",
      passthrough: data ? JSON.stringify({ entry_id: data[0].id }) : null,
    },
  });

  // Save the Upload ID in your own DB somewhere, then
  // return the upload URL to the end-user.
  res.status(201).json({
    id: data ? data[0].id : null,
    url: upload.url,
  });
}

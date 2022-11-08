// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { eventId } from "constants/event";
import type { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "utils/supabaseAdmin";

const Mux = require("@mux/mux-node").default;

type Data = {
  id: number | null;
  url: string;
  delete_key: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { Video } = new Mux(
    process.env.MUX_ACCESS_TOKEN,
    process.env.MUX_SECRET_TOKEN
  );

  const { data, error } = await supabaseAdmin
    .from("entries")
    .insert([
      {
        event_id: eventId,
      },
    ])
    .select();

  if (error) {
    res.status(500).end("could not create record");
  }

  // This ultimately just makes a POST request to https://api.mux.com/video/v1/uploads with the supplied options.
  const upload = await Video.Uploads.create({
    cors_origin: "https://your-app.com",
    new_asset_settings: {
      playback_policy: "public",
      mp4_support: "standard",
      passthrough: data ? JSON.stringify({ entry_id: data[0].id }) : null,
      inputs: [
        {
          url: "https://guestbook.mux.dev/images/Jamstack_Logo_Original_White.png",
          overlay_settings: {
            vertical_align: "bottom",
            vertical_margin: "5%",
            horizontal_align: "right",
            horizontal_margin: "15%",
            width: "15%",
            opacity: "90%",
          },
        },
      ],
    },
  });

  // Save the Upload ID in your own DB somewhere, then
  // return the upload URL to the end-user.
  res.status(201).json({
    id: data ? data[0].id : null,
    url: upload.url,
    delete_key: upload.id
  });
}

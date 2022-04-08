// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const Mux = require("@mux/mux-node").default;

type Data = string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { Video } = new Mux(
    process.env.MUX_ACCESS_TOKEN,
    process.env.MUX_SECRET_TOKEN
  );

  // This ultimately just makes a POST request to https://api.mux.com/video/v1/uploads with the supplied options.
  const upload = await Video.Uploads.create({
    cors_origin: "https://your-app.com",
    new_asset_settings: {
      playback_policy: "public",
      passthrough: JSON.stringify({ eventId: 1 })
    },
  });

  // Save the Upload ID in your own DB somewhere, then
  // return the upload URL to the end-user.
  res.end(upload.url);
}

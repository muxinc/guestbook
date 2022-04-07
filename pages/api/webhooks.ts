import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
const Mux = require("@mux/mux-node").default;

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE as string
);

type Data = {
  status: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { Video } = new Mux(
    process.env.MUX_ACCESS_TOKEN,
    process.env.MUX_SECRET_TOKEN
  );

  res.status(200).json({ status: "ok" });
}

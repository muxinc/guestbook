// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "utils/supabaseAdmin";

type ResponseData = {
  id: number | null;
};

type Row = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  created_at: string;
  event_id: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { firstName, lastName, email } = req.body;

  const { data, error } = await supabaseAdmin.from<Row>("leads").insert([
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

  res.status(201).json({
    id: data ? data[0].id : null,
  });
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "utils/supabaseAdmin";

type Data = {
  id: number | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { delete_key } = req.body;

  const { data, error } = await supabaseAdmin
    .from('assets')
    .delete()
    .eq('delete_key', delete_key)

  if (error) {
    res.status(500).end("could not delete record");
  }

  res.status(204).end("deleted.");
}

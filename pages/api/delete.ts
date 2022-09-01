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

  const { data: assets, error } = await supabaseAdmin
    .from('assets')
    .select("*")
    .eq('delete_key', delete_key)

  if (error || !assets) {
    res.status(404).end("could not find record");
  }

  if (assets) {
    const asset = assets[0];

    const { data, error } = await supabaseAdmin
      .from('entries')
      .delete()
      .eq('id', asset.entry_id)

    if (error) {
      res.status(500).end("could not delete record");
    }

    res.status(204).end("deleted.");
  }
}

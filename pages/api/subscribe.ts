// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { eventId } from "constants/event";
import type { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "utils/supabaseAdmin";

type ResponseData = {
  id: number | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { firstName, lastName, email, consent } = req.body;

  if (consent !== "on") {
    // front-end validation should prevent this!
    return res.status(400).end("user did not opt-in to emails");
  }
  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert([
      {
        first_name: firstName || null,
        last_name: lastName || null,
        email: email || null,
        event_id: eventId,
      },
    ])
    .select();

  if (error) {
    console.error({ error });
    return res.status(500).end("Could not create record");
  }
  return res.status(201).json({
    id: data ? data[0].id : null,
  });
}

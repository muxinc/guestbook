import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseEntry } from "types";

type InsertPayload = {
  type: "INSERT";
  table: string;
  schema: string;
  record: SupabaseEntry;
  old_record: null;
};
type UpdatePayload = {
  type: "UPDATE";
  table: string;
  schema: string;
  record: SupabaseEntry;
  old_record: SupabaseEntry;
};
type DeletePayload = {
  type: "DELETE";
  table: string;
  schema: string;
  record: null;
  old_record: SupabaseEntry;
};
type Payload = InsertPayload | UpdatePayload | DeletePayload;
const isDeletePayload = (payload: Payload): payload is DeletePayload =>
  payload.type === "DELETE";

const revalidate = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check for secret to confirm this is a valid request
  if (
    req.query.secret !== process.env.REVALIDATE_SECRET &&
    process.env.NODE_ENV !== "development"
  ) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    // no matter what, we revalidate the main page
    // which of course features all the entries
    await res.revalidate("/");

    // we also revalidate the page associated with
    // the entry that triggered this revalidation
    const body = req.body as Payload;
    if (isDeletePayload(body)) {
      const entryId = body.old_record.id;
      await res.revalidate(`/entry/${entryId}`);
    } else {
      const entryId = body.record.id;
      await res.revalidate(`/entry/${entryId}`);
    }
    return res.json({ revalidated: true });
  } catch (error) {
    return res.status(500).send("Error revalidating");
  }
};

export default revalidate;

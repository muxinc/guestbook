import { createClient } from "@supabase/supabase-js";
import { Database } from "./DatabaseDefinitions";

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE as string
);

export default supabaseAdmin;

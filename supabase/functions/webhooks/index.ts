// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts'

type Metadata = {
  first_name?: string;
  last_name?: string;
  email?: string;
  event_id?: number;
}

serve(async (req) => {
  const { type, data: { id: asset_id, playback_ids, passthrough } } = await req.json()

  const metadata: Metadata = passthrough ? JSON.parse(passthrough) : {};
  const { first_name, last_name, email, event_id } = metadata;

  if (type !== 'video.asset.ready') {
    return new Response(
      JSON.stringify({ message: "Ignored." }),
      { headers: { "Content-Type": "application/json" } },
    )
  }

  const { data, error } = await supabaseAdmin
    .from('entries')
    .insert([
      { first_name, last_name, email, asset_id, playback_id: playback_ids[0].id },
    ])

  const resp = {
    message: `Received ${type}!`,
  }

  return new Response(
    JSON.stringify(resp),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/webhooks' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"type":"video.asset.ready","request_id":null,"object":{"type":"asset","id":"apeoo7TFGjL4I3jznrK3fe5o3pgxcemF5YOIqx33p9s"},"id":"0f8a9f25-7c1b-4bf0-bf2c-47d8a2083b17","environment":{"name":"MuxGuestbook","id":"vqhv6d"},"data":{"tracks":[{"type":"video","max_width":1920,"max_height":1080,"max_frame_rate":29.97,"id":"zCSxIsLVdGMTQ6zX3teO1sSilAK01mJrEYr7zLvymsls","duration":23.8238},{"type":"audio","max_channels":2,"max_channel_layout":"stereo","id":"MFCSnGOI9s6j31ErtWGJwYexSonHt02AOSqVwo02nt39o","duration":23.823792}],"status":"ready","playback_ids":[{"policy":"public","id":"BVzgvVreJRpw5WKpy300M01UPkGl01cSAAx1wv897VQtCU"}],"passthrough": "{\"first_name\": \"Dave\",\"last_name\": \"Kiss\",\"email\": \"dave@mux.com\",\"eventId\": 1}","mp4_support":"none","max_stored_resolution":"HD","max_stored_frame_rate":29.97,"master_access":"none","id":"apeoo7TFGjL4I3jznrK3fe5o3pgxcemF5YOIqx33p9s","duration":23.857167,"created_at":1649436438,"aspect_ratio":"16:9"},"created_at":"2022-04-08T16:47:21.000000Z","attempts":[],"accessor_source":null,"accessor":null}'

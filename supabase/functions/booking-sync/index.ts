import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedParties = new Set(['crystal', 'christal', 'vivian', 'mero']);
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type' };
const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder(), a = encoder.encode(left), b = encoder.encode(right);
  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index++) difference |= (a[index % (a.length || 1)] || 0) ^ (b[index % (b.length || 1)] || 0);
  return difference === 0;
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (request.method !== 'POST') return respond({ ok: false, code: 'invalid_payload' }, 405);
  try {
    const body = await request.json();
    const expectedTrip = Deno.env.get('CCMV_VN_TRIP_ID') || 'ccmv-vietnam-2026';
    const expectedToken = Deno.env.get('CCMV_VN_TRIP_ACCESS_TOKEN') || '';
    if (!expectedToken || !constantTimeEqual(String(body.tripAccessToken || ''), expectedToken)) return respond({ ok: false, code: 'invalid_trip_token' }, 403);
    if (body.tripId !== expectedTrip || body.mutation?.tripId !== expectedTrip) return respond({ ok: false, code: 'wrong_trip' }, 400);
    if (!allowedParties.has(String(body.partyId || ''))) return respond({ ok: false, code: 'invalid_party' }, 403);
    if (!body.mutation?.mutationId || body.mutation?.domain !== 'booking') return respond({ ok: false, code: 'invalid_payload' }, 400);
    if (['update', 'delete'].includes(body.mutation.operation) && !Number.isInteger(body.mutation.baseVersion)) return respond({ ok: false, code: 'invalid_payload' }, 400);
    const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
    const { data, error } = await client.rpc('ccmv_booking_sync_mutate', { p_trip_id: body.tripId, p_party_id: body.partyId, p_mutation: body.mutation });
    if (error) return respond({ ok: false, code: 'internal_error' }, 500);
    return respond(data, data?.ok ? 200 : data?.code === 'version_conflict' ? 409 : 400);
  } catch {
    return respond({ ok: false, code: 'invalid_payload' }, 400);
  }
});

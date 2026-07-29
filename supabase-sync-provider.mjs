const clone = value => structuredClone(value);

function mapRow(row) {
  return {
    bookingId: row.booking_id, id: row.booking_id, tripId: row.trip_id,
    eventId: row.event_id, placeId: row.place_id, day: row.day_number,
    status: row.status, date: row.booking_date || '', time: (row.booking_time || '').slice(0, 5),
    bookingName: row.booking_name || '', category: row.category || '', title: row.title || '',
    depositPaid: Boolean(row.deposit_paid), depositAmount: row.deposit_amount || '',
    bookingMethod: row.booking_method || '', bookingContact: row.booking_contact || '',
    secondaryContact: row.secondary_contact || '', bookingUrl: row.booking_url || '', notes: row.notes || '',
    schemaVersion: Number(row.schema_version || 1), tripGeneration: Number(row.trip_generation || 1),
    version: Number(row.version || 1), createdAt: row.created_at, updatedAt: row.updated_at,
    updatedByPartyId: row.updated_by_party_id || '', updatedByUserId: row.updated_by_user_id || '',
    deletedAt: row.deleted_at || '', mutationId: row.mutation_id || ''
  };
}

export class SupabaseSyncProvider {
  constructor({ url, anonKey, tripId, tripAccessToken, getPartyId, fetchImpl = globalThis.fetch, WebSocketImpl = globalThis.WebSocket }) {
    if (!url || !anonKey || !tripId) throw new Error('SUPABASE_SYNC_CONFIG_INCOMPLETE');
    this.url = url.replace(/\/$/, '');
    this.anonKey = anonKey;
    this.tripId = tripId;
    this.tripAccessToken = tripAccessToken;
    this.getPartyId = getPartyId;
    this.fetch = fetchImpl;
    this.WebSocket = WebSocketImpl;
    this.sockets = new Set();
    this.connected = false;
  }
  async connect() { await this.ping(); this.connected = true; }
  async disconnect() { for (const socket of this.sockets) socket.close(); this.sockets.clear(); this.connected = false; }
  headers() { return { apikey: this.anonKey, 'Content-Type': 'application/json' }; }
  async ping() {
    const response = await this.fetch(`${this.url}/rest/v1/trips?trip_id=eq.${encodeURIComponent(this.tripId)}&select=trip_generation&limit=1`, { headers: this.headers() });
    if (!response.ok) throw new Error(`SUPABASE_PING_${response.status}`);
    return true;
  }
  async getTripGeneration(tripId) {
    if (tripId !== this.tripId) throw new Error('WRONG_TRIP');
    const response = await this.fetch(`${this.url}/rest/v1/trips?trip_id=eq.${encodeURIComponent(tripId)}&select=trip_generation&limit=1`, { headers: this.headers() });
    if (!response.ok) throw new Error(`GENERATION_FETCH_${response.status}`);
    const rows = await response.json();
    if (!rows[0]) throw new Error('TRIP_NOT_FOUND');
    return Number(rows[0].trip_generation);
  }
  async fetchChanges({ tripId, domain }) {
    if (tripId !== this.tripId || domain !== 'booking') throw new Error('WRONG_SYNC_SCOPE');
    const response = await this.fetch(`${this.url}/rest/v1/bookings?trip_id=eq.${encodeURIComponent(tripId)}&select=*`, { headers: this.headers() });
    if (!response.ok) throw new Error(`BOOKING_FETCH_${response.status}`);
    return (await response.json()).map(mapRow);
  }
  async pushMutation(mutation) {
    const response = await this.fetch(`${this.url}/functions/v1/booking-sync`, {
      method: 'POST', headers: this.headers(),
      body: JSON.stringify({ tripId: this.tripId, tripAccessToken: this.tripAccessToken, partyId: this.getPartyId(), mutation })
    });
    const body = await response.json().catch(() => ({ ok: false, code: 'internal_error' }));
    if (!response.ok && !body.code) throw new Error(`BOOKING_SYNC_${response.status}`);
    if (body.canonicalRecord && !body.remote) body.remote = mapRow(body.canonicalRecord);
    if (body.record) body.record = mapRow(body.record);
    return body;
  }
  async bumpTripGeneration(tripId, currentGeneration, partyId) {
    const response = await this.pushMutation({
      mutationId: crypto.randomUUID(), tripId, tripGeneration: currentGeneration, domain: 'booking',
      recordId: '__generation__', operation: 'reset', payload: {}, createdAt: new Date().toISOString(),
      createdByPartyId: partyId, retryCount: 0, state: 'queued'
    });
    if (!response.ok) throw new Error(response.code || 'GENERATION_RESET_FAILED');
    return Number(response.tripGeneration);
  }
  async subscribe({ tripId, domain }, listener) {
    if (!this.WebSocket || tripId !== this.tripId || domain !== 'booking') return () => {};
    const wsUrl = this.url.replace(/^http/, 'ws') + `/realtime/v1/websocket?apikey=${encodeURIComponent(this.anonKey)}&vsn=1.0.0`;
    let stopped = false, retry, ref = 1;
    const open = () => {
      if (stopped) return;
      const socket = new this.WebSocket(wsUrl); this.sockets.add(socket);
      socket.onopen = () => socket.send(JSON.stringify({ topic: `realtime:public:bookings:trip_id=eq.${tripId}`, event: 'phx_join', payload: { config: { postgres_changes: [{ event: '*', schema: 'public', table: 'bookings', filter: `trip_id=eq.${tripId}` }] } }, ref: String(ref++) }));
      socket.onmessage = event => {
        const message = JSON.parse(event.data);
        const row = message.payload?.data?.record || message.payload?.record || message.payload?.data?.old_record;
        if (row) listener(mapRow(row));
      };
      socket.onclose = () => { this.sockets.delete(socket); if (!stopped) retry = setTimeout(open, 1500); };
    };
    open();
    const online = async () => { for (const row of await this.fetchChanges({ tripId, domain })) await listener(clone(row)); };
    globalThis.addEventListener?.('online', online);
    return () => { stopped = true; clearTimeout(retry); globalThis.removeEventListener?.('online', online); for (const socket of this.sockets) socket.close(); };
  }
}

# Stage E Edge Function Deployment

1. Review and apply `supabase/migrations/20260729_vn_stage_e_booking_sync.sql`.
2. Confirm `anon` and `authenticated` have no insert/update/delete privilege on `public.bookings`.
3. Set Edge Function secrets:

```text
supabase secrets set CCMV_VN_TRIP_ID=ccmv-vietnam-2026
supabase secrets set CCMV_VN_TRIP_ACCESS_TOKEN=<long-random-private-token>
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are supplied to hosted Edge Functions by Supabase. Never copy the service-role key into the browser.

4. Deploy:

```text
supabase functions deploy booking-sync
```

5. Configure the browser before `supabase-config.js` loads:

```html
<script>
globalThis.CCMV_SUPABASE_CONFIG = {
  enabled: true,
  url: "https://PROJECT.supabase.co",
  anonKey: "PUBLIC_ANON_KEY",
  tripAccessToken: "THE_SCOPED_TRIP_TOKEN"
};
</script>
```

6. Change `bookingSyncRuntime` to `true` and `bookingSyncMode` to `certification` only in the tester deploy.
7. Run the two-device checklist. Do not switch to `production` until it passes.

The migration RPC is revoked from browser roles and executable only by `service_role`. Browser mutations must call `/functions/v1/booking-sync`.

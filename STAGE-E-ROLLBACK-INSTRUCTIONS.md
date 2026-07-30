# Stage E Rollback Instructions

Immediate safe rollback:

1. Set `bookingSyncRuntime: false`.
2. Set `bookingSyncMode: 'off'`.
3. Deploy the verified Stage D/local-only baseline if a full artifact rollback is required.
4. Preserve local Booking data, remote tables, and Supabase data.
5. Do not recreate S1C anonymous write policies.
6. Do not drop tables or clear browser Booking storage.

The Stage E deploy defaults to OFF, so an unconfigured deployment remains local-only.

If certification fails, do not fix-forward in production. Record the failing step and return testers to the Stage D/local-only behavior.

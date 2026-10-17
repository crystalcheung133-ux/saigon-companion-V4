# RC29.129 real-device checklist (run on a phone, after deploying)

Browser gate (needs Playwright + Chromium + WebKit): `sh ci-tests/run-browser.sh` or the GitHub
`browser-release-smoke` workflow. Static CI cannot prove the items below.

1. Online, fresh install (clear site data or private tab): open Home, Trip, Documents. No console errors about `supabase` or `pdfjsLib`.
2. Qspa booking: edit Notes and a planned visit time, Save. Save closes immediately; on a second device the edit appears; no sync error state.
3. Booking with multi-line Notes (new line, trailing space): save, confirm it syncs.
4. Documents: open a PDF online. Then switch to airplane mode, reopen app and open the same PDF (worker must load from cache).
5. After a deploy while online, open the app once, then airplane mode, kill and reopen: Home, Trip, Guide, Shopping render; Documents list opens.
6. Export a PDF online (html2pdf). Offline, repeat after step 6 succeeded once.
7. Expenses and Moments: add one record online, confirm it syncs; add one offline, reconnect, confirm it syncs.

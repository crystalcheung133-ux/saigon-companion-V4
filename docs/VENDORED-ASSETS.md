# Vendored third-party assets (RC29.129)

Files at the repository root named `vendor-*.js` are byte-exact copies of npm package files. They are
covered by `SHA256SUMS.txt`, pinned in `RELEASE.json -> vendored_assets`, and verified by
`ci-tests/test-supabase-sdk-pin.js`.

| File | npm package | Source file |
|---|---|---|
| vendor-supabase-js-2.117.2.umd.js | @supabase/supabase-js@2.117.2 | dist/umd/supabase.js |
| vendor-pdfjs-3.11.174.min.js | pdfjs-dist@3.11.174 | build/pdf.min.js |
| vendor-pdfjs-worker-3.11.174.min.js | pdfjs-dist@3.11.174 | build/pdf.worker.min.js |
| vendor-html2pdf-0.10.1.bundle.min.js | html2pdf.js@0.10.1 | dist/html2pdf.bundle.min.js |

Precached by the service worker: Supabase SDK, PDF.js, PDF.js worker. html2pdf.js is cached on first export.
Licences: @supabase/supabase-js MIT, pdf.js Apache-2.0, html2pdf.js MIT (banners retained in the files).

## Upgrading
1. `npm pack <pkg>@<version>`; confirm the tarball sha512 equals `npm view <pkg>@<version> dist.integrity`.
2. Copy the source file unchanged, rename with the new version, update loaders, SW precache and `RELEASE.json -> vendored_assets`.
3. Run `sh ci-tests/run-all.sh` and the browser gate; re-test sync, Documents PDF and export on a phone, online and offline.

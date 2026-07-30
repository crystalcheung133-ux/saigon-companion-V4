# Stage E Manual Two-Device Certification

Status: NOT RUN

Record browser/device, build label, selected Friend, time, and evidence for every step.

## Device A

- [ ] Confirm `Build: VN Stage E · Booking Sync Certification`.
- [ ] Select Crystal.
- [ ] Open Booking and complete initial upload.
- [ ] Edit Notes and confirm canonical version acknowledgement.

## Device B

- [ ] Confirm the same build.
- [ ] Select Vivian.
- [ ] Complete initial download.
- [ ] Observe Device A's Notes edit.
- [ ] Edit a different Booking and confirm Device A receives it.

## Offline

- [ ] Put Device B offline.
- [ ] Edit a Booking.
- [ ] Refresh/close and reopen.
- [ ] Confirm the pending mutation survives.
- [ ] Reconnect and confirm the edit syncs once.

## Conflict

- [ ] Edit the same field on both devices from the same base version.
- [ ] Confirm first commit becomes canonical.
- [ ] Confirm second commit becomes one persisted conflict.
- [ ] Test Keep Local.
- [ ] Recreate and test Use Remote.
- [ ] Recreate and test Discard.
- [ ] Confirm a later same-record edit is held while conflict remains open.

## Reset

- [ ] In certification mode, prepare and commit a controlled generation reset.
- [ ] Confirm older-generation queue entries cannot resurrect records.
- [ ] Confirm the adapter is notified once.
- [ ] Confirm a new edit enqueues and syncs after reset.

## Final decision

- [ ] PASS
- [ ] FAIL — retain Stage D/local-only rollback

Tester:

Date/time:

Evidence:

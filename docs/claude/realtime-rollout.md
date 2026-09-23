# Realtime v7 activation and recovery

General activation stays on hold until old writers can no longer write the
migrated document. The `p` envelope prevents real v6 socket receivers from
applying v7 diffs; admission controls the realtime worker. Neither mechanism
is a provider write lease. An old tab can reload file data, obtain a current
etag and write directly to Drive with old merge semantics.

## What this change supplies

- Joins advertise `pv=7` and `av=<built app version>`, without document contents
  or encryption keys. A missing protocol is incompatible with an active floor.
- `fast-rt` has an authenticated, per-channel policy: `minProtocol` (required,
  integer 1–9999) and optional `minAppVersion` (one to four numeric components).
  With no policy, legacy joins remain accepted. Versions are self-reported
  compatibility metadata, not authentication or protection from malicious peers.
- Policies live in the owning Document Durable Object's storage. After the
  durable write succeeds, the worker removes incompatible open connections,
  sends `upgradeRequired`, closes with code 4001 and refuses their reconnects,
  relayed messages and WebRTC signaling. Surviving peers receive the updated
  app floor. Policy updates are serialized per shard; changing one channel's
  policy does not change another channel's policy.
- New clients latch an upgrade rejection, destroy their collaboration
  transport, stop autosave/catchup and refuse subsequent base save requests,
  including overwrite. A save still waiting for fonts is also refused. Dirty
  documents keep their model and modified flag; cancel leaves local export
  available. No automatic reload discards pending edits.

The guard cannot retract saves already past the base preparation callback,
provider requests already in flight, old JavaScript lacking the guard, or
legacy peer-to-peer sessions that do not traverse this worker. The default
transport is WebSocket. Do not treat a successful drain response as evidence
that these other writers have retired.

## Preparation and activation (per document)

1. Identify the provider file and its actual realtime channel (`sync.channelId`,
   the existing `id` in the socket join). Do not assume the share URL/file ID
   alone is the channel. Record the candidate client build, worker revision,
   channel, current provider revision and known writers in restricted release
   evidence. Keep keys, tokens, contents and channel IDs out of public logs.
2. Rehearse on synthetic documents. Preprod's checked-in binding points to the
   **production** `p2p-collab-test` Durable Objects. Different browser hosts or
   beta/stable/preprod channels do not isolate the same document. Use separate
   file/channel identities or separately provisioned Durable Objects.
3. Deploy the worker through the existing release workflow and distribute the
   upgrade handling before enabling incompatible shared editing. Admission
   plumbing can be backported into a compatible bridge release; this v7 branch
   is not itself a v6 bridge. A released build must have its numeric app version
   substituted (source-mode placeholders cannot satisfy an app-version floor).
   No floor is activated by deploying this code alone.
4. While writers are still compatible, pause editing and checkpoint all pending
   work. Ask dirty tabs to save successfully or export a local copy; reconcile
   those copies against the checkpoint before resuming. Close/reload all old
   tabs, including background windows, offline devices, embeds and stable-channel
   clients. Waiting one release or one cache TTL is insufficient. Ordinary
   service-worker updates do not replace JavaScript already running in a tab.
5. Establish how returning old writers are excluded at the **storage** boundary.
   A controlled write service should enforce the writer generation. Direct
   provider deployments need a verified migration of all writers and an
   enforceable retirement procedure. If this cannot be established, keep the
   document on the compatible release, or use a new working file identity with
   the old file retained for recovery and no longer authoritative. Rotating only
   a room secret or splitting realtime channels is insufficient.
6. Set the channel's floor with the endpoint below, using `minProtocol: 7` and,
   if needed, the verified minimum **released** app version. Record the response.
   Open compatible clients, confirm acceptance, then exercise an old connection
   opened before the change, a new old join and an offline resume. Check both
   socket exclusion and the provider-write retirement mechanism before allowing
   ordinary shared edits. Checkpoint/read back a save with Unicode, literal `%41`
   and `100%`, expected page membership/order and pending local work intact.

Original v6 clients do not understand the new rejection notice. They may retry
abnormal socket closes and continue file sync. Their cache upgrade dialog is
cancelable and only runs if a notification arrives and decoding succeeds. It
is a prompt, not an activation barrier.

## Policy endpoint

`POST /rt?operation=rollout&id=<URL-encoded-channel>` accepts a small JSON object:

```json
{"minProtocol":7,"minAppVersion":null}
```

The response is `{"policy":{...},"removed":N}`. `removed` counts incompatible
connections removed from this worker's channel at this update, not users, tabs
elsewhere, in-flight writes or verified retirements. A POST body of JSON `null`
clears the floor. Both updates and clearing persist across object restarts.
Repeated updates are safe. An invalid policy does not alter sessions; failure
to persist a policy does not publish it.

All administrative requests require `Authorization: Bearer <RT_ROLLOUT_SECRET>`.
Provision a random secret of at least 32 characters through the normal runtime
secret-management process; the endpoint is disabled when that secret is absent
or shorter. Do not commit it, put it in a URL or expose it to editor clients.
The front worker and owning Durable Object both check it. For preprod forwarding
to production objects, both worker environments must have the same authorized
secret; using the production endpoint avoids that extra forwarding boundary.
Do not change `keep_vars`, public-build exclusions or existing DO bindings.

For example, with `RT_ROLLOUT_URL`, `RT_ROLLOUT_CHANNEL` and
`RT_ROLLOUT_SECRET` provided securely in the operator's environment:

```sh
python3 - <<'PY'
import json, os, urllib.parse, urllib.request
query = urllib.parse.urlencode({
    'operation': 'rollout', 'id': os.environ['RT_ROLLOUT_CHANNEL']})
policy = {'minProtocol': 7, 'minAppVersion': None}
request = urllib.request.Request(
    os.environ['RT_ROLLOUT_URL'] + '?' + query,
    data=json.dumps(policy).encode(), method='POST',
    headers={'Authorization': 'Bearer ' + os.environ['RT_ROLLOUT_SECRET'],
             'Content-Type': 'application/json'})
with urllib.request.urlopen(request, timeout=30) as response:
    print(response.read().decode())
PY
```

Use the canonical HTTPS `/rt` endpoint without redirects or existing query
parameters. Keep HTTP tracing off. Record the policy response with the release
evidence. To clear the floor after the rollback checks below, use the same
request with `policy = None`. This document is a procedure, not a record that
any deployment, secret provisioning or policy change has occurred.

## Rollback

Pause edits first and checkpoint/export all pending v7 work. Retain provider
revision history. Restore a tested compatible checkpoint/client set, reconcile
pending work, and retire v7 writers before reopening the old cohort. Keep the
floor until that transition is verified; lowering a minimum alone would admit
both protocols. If isolation cannot be proved, recover to a separate working
file. After writer retirement, clear or lower the channel policy and verify the
result. Clients already latched as requiring an upgrade need an explicit reload
of the selected compatible build; a policy rollback does not silently re-enable
their pending writes. Rolling back worker code alone does not delete the stored
policy, and code predating admission will not enforce it.

## Automated evidence and remaining acceptance work

[The harness README](../../etc/rt-test/README.md#rollout-compatibility-gate)
lists the commands. `rollout-mixed-source` pins the entire v6 application to
`c6c7ce5b31bb7b1f1377f97a9e25d4b94be0c073`, checks candidate `p` isolation,
Unicode/percent labels in committed candidate bytes and a fresh old parser,
old cache/catchup behavior, and a `d`-envelope corruption control. It verifies
actual upgrade cancellation/export, save-preparation denial, queued-receive
cancellation, advertised versions and reconnect refusal, with AES on/off and
real receive timers. The Node worker tests cover policy authentication and
validation, connection draining, restart persistence, independent channels,
failed storage and concurrent updates/relays.

These use fake sockets/storage/HTTP boundaries. Before activation, run the
cross-host/browser, actual Cloudflare, service-worker reload, real-provider
write-exclusion and offline/returning-tab acceptance checks above, including a
client already open before deployment. Successful local tests do not establish
those production properties.

## Release telemetry (temporary)

Added for the v7 release soak and meant to be removed afterwards: revert
the commits titled "Adds temporary realtime release telemetry" (client)
and "Adds per-protocol socket counts to the fast-rt stats" (worker and
`etc/rt-test/rt-stats-watch.js`). `EditorUi.realtimeTelemetry = false`
switches the client side off without a revert.

`EditorUi.logRealtime(name, fields, file, key, beacon)` (diagramly
`EditorUi.js`) sends `rt7:<name>:f=<hashed file id>,m=<mode>,c=<sync
client id>,<fields>` as a WARNING entry through the normal `/log`
endpoint. The pinned log backend writes App Engine request logs, so the
text sits in `protoPayload.line.logMessage`, never in `textPayload`:
query `protoPayload.line.logMessage:"CLIENT-LOG:rt7:"` (the client
version is in the `VERSION=` line, or `v=` in `protoPayload.resource`).
Log-based metrics `rt7_events` (labels event, version) and
`client_severe_errors` (label version) exist in the drawdotio project
since 19 Sep 2026; delete them with the revert. Fields are reduced to
`[A-Za-z0-9._-]` and 32 characters; no URL, stack, label, content or user
id is ever sent. Keyed events fire once per key and page load, unkeyed
ones at most `EditorUi.realtimeTelemetryMax` (10) times. Under `dev=1`
the helper only prints to the debug console, so the harness never
reports anything. Each event flags its file so the file's `session`
summary is sent on close; 2 % of page loads (`realtimeTelemetrySampled`)
send the summary and run the snapshot-drift check regardless.

| Event | Where | Meaning |
|---|---|---|
| `peer-old` | `handleRemoteMessage` fallback | a message from a v6, payload-less or outdated-app peer degraded to file sync (`pv`, `av`, `why`) |
| `catchup-proto` | `doCatchup` version gate | a cache entry with the wrong protocol forced a file reload |
| `reload` | `DrawioFileSync.reload` with a reason | `r=checksum`, `timeout` or `cachefail` replaced a patch path (cache counters attached); the routine no-patches reload is not reported |
| `conflict-timeout` | `fileConflict` | catch-up retries exhausted, the user sees the timeout error |
| `cleanup-expel` | `cleanup` | the convergence patch removed or rewrote screen state (`u=1` while unconfirmed live content was held). Fires in green harness runs too (merged saves reach the screen through it), so judge the rate, not single events |
| `upgrade-required` | `requireAppUpgrade` | admission rejection latched; must stay zero while no floor is set |
| `rejoin-stopped` | `P2PCollab` | ten consecutive socket join failures (`code` = last close code) |
| `socket-error` | `P2PCollab` | an error frame from the worker (`SESSION_SETUP_FAILED` etc.) |
| `write-revoked` | `handleWriteRevoked` | permanent 403 rollback path entered |
| `snapshot-drift` | `DrawioFile.patch` | the `test=1` snapshot assertion, hit in a sampled session |
| `session` | `DrawioFile.close` | `file.stats` counters, minutes open, `rt` flag; sent with `sendBeacon` on unload |

Server side, `GET /rt?debug=1&id=<shard>` adds `protocols: {"7":n,"none":m}`
and `GET /rt?stats=1` sums it as `Protocols:` across the 64 shards, which
`node etc/rt-test/rt-stats-watch.js` prints every two minutes (total,
delta since start, share per protocol). Existing SEVERE entries stay as
they are: checksum errors, `Error in merge`, `Error in
doReceiveRemoteChanges`, `Error in sendLocalChanges`, `Error in
sendUnconfirmedChanges`, `Error in handleWriteRevoked`, Pusher limit and
uncaught errors remain the Error Reporting view.

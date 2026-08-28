# aes.min.js

Trimmed CryptoJS 4.2.0 rollup: `core + enc-base64 + md5 + evpkdf + cipher-core + aes`.

That module set is not a judgement call — it is upstream's own declared dependency list for
`aes.js`. CryptoJS 4.x dropped the `rollups/` directory that 3.x shipped, so the bundle is
concatenated from the npm package and minified:

```bash
npm pack crypto-js@<version> && tar xzf crypto-js-<version>.tgz
for f in core enc-base64 md5 evpkdf cipher-core aes; do cat package/$f.js; echo; done > rollup.js
java -jar etc/build/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS \
  --language_in ECMASCRIPT5 --language_out ECMASCRIPT5 \
  --js rollup.js --js_output_file rollup.min.js
```

Then prepend the attribution header from the current `aes.min.js`, updating the version. If a
future release changes what `aes.js` depends on, follow the new list rather than this one.

Nothing else from the package is included: no SHA/HMAC/PBKDF2/RC4/Rabbit/DES, no cipher modes
beyond CBC, no paddings beyond Pkcs7.

## What draw.io uses

- `CryptoJS.AES.encrypt` / `decrypt` with a **string** key — `DrawioFileSync.objectToString`
  and `stringToObject`, also reached through `P2PCollab`. A string key makes CryptoJS derive
  key+IV from a passphrase via the OpenSSL KDF (`EvpKDF`), which draws an 8-byte salt from
  `WordArray.random`.
- `CryptoJS.MD5` — `OneDriveFile.getChannelKey`, plus the `monday` and `nextcloud` plugins.
  (`DriveFile.getChannelKey` reads a stored custom property and does not hash.)

## Why 4.2.0

3.1.2 seeded `WordArray.random` from `Math.random()`, which Dependabot flags as
`GHSA-rg76-677x-56q9` / `CVE-2026-71851` (alert #310), with the weak PBKDF2 default in #162.
4.x takes its entropy from `crypto.getRandomValues`; 4.2.0 also clears #162.

Under 3.1.2 the insecure RNG only produced the KDF salt — prepended to the ciphertext in
cleartext in the OpenSSL `Salted__` format, and public by design — so the exposure was salt
collisions causing (key, IV) reuse under a single channel key, not key recovery. The AES key
derives from the channel key, a shared secret.

## Behavioural note

With no native crypto in scope, 3.1.2 silently fell back to `Math.random()`; 4.2.0 throws
`Native crypto module could not be used to get secure random number.` Only encryption is
affected — `AES.decrypt` and `MD5` never touch the RNG.

4.2.0 probes `self.crypto` → `globalThis.crypto` → `window.msCrypto` → `global.crypto` →
`require('crypto')`, and `getRandomValues` works in insecure contexts, so plain-HTTP
deployments are fine. It is still reachable, though: `window.crypto` is a configurable
accessor, so an embedding page or a plugin can replace it with `Object.defineProperty` and
defeat the first two probe steps. `DrawioFileSync.isEncryptionAvailable` handles that by
failing closed — realtime is left off for a keyed channel that cannot be encrypted, rather
than sending a message the peer cannot read and the cache can.

## Build integration

The build `<concat>`-s this file verbatim into `base.min.js` and never re-compiles it, so its
UMD wrappers and the `require('crypto')` reference never pass through Closure. Replacing it is
a straight file swap.

The 4.2.0 rollup is upgrade-compatible on the wire: the EvpKDF/OpenSSL format is unchanged, so
a 3.1.2 client and a 4.2.0 client in the same collab session still read each other's messages.
Every deterministic value the library produces was compared byte-for-byte against 3.1.2 before
the bump — MD5, the Utf8/Latin1/Hex/Base64 encoders, EvpKDF, AES with a pinned salt, and
cross-version decryption in both directions.

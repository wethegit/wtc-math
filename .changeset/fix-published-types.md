---
"wtc-math": patch
---

Ship TypeScript declarations. 1.3.0 published no `.d.ts` files, so imports were untyped. Declarations now sit next to the JS in `dist/`, every `exports` entry resolves its types, and the package works under both `bundler` and `node16` module resolution. The tarball also no longer includes the demos, site build or config files.

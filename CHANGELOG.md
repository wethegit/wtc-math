# wtc-math

## 1.4.0

### Minor Changes

- [#108](https://github.com/wethegit/wtc-math/pull/108) [`d102a39`](https://github.com/wethegit/wtc-math/commit/d102a3930137e15cd2443affa7779438567fbb9a) Thanks [@liamegan](https://github.com/liamegan)! - Add OKLab, OKLCH and HSV support to `Color`: `toOklab`, `toOklch`, `toHSV`, `fromOklab`, `fromOklch`, `fromHSV`, plus perceptual interpolation with `Color.lerpOklab` and `Color.lerpOklch`.

### Patch Changes

- [#108](https://github.com/wethegit/wtc-math/pull/108) [`d102a39`](https://github.com/wethegit/wtc-math/commit/d102a3930137e15cd2443affa7779438567fbb9a) Thanks [@liamegan](https://github.com/liamegan)! - Ship TypeScript declarations. 1.3.0 published no `.d.ts` files, so imports were untyped. Declarations now sit next to the JS in `dist/`, every `exports` entry resolves its types, and the package works under both `bundler` and `node16` module resolution. The tarball also no longer includes the demos, site build or config files.

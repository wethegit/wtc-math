# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets).

When a PR changes `wtc-math` in a way that should ship, run:

```sh
npm run changeset
```

Pick the bump (patch, minor or major) and write a short summary; it becomes the changelog entry. Commit the generated markdown file with the PR.

When changesets land on `master`, the Release workflow opens (or updates) a "chore: release packages" PR that bumps the version and writes `CHANGELOG.md`. Merging that PR publishes to npm.

[![node][node-badge]][node-url]
[![pnpm][pnpm-badge]][pnpm-url]

# web-tools

web-tools is a pnpm workspace monorepo for web tools.

## Packages

This repo publishes several packages that work together or independently. Each
package links to its README for details:

## Scripts

Run these scripts from the repo root with pnpm:

- `pnpm lint`: Run ESLint and Prettier checks in parallel.
- `pnpm test`: Run Jest across all workspace packages.
- `pnpm build`: Build all packages with TypeScript declarations.
- `pnpm pub:changeset`: Create a Changeset for versioning.
- `pnpm pub:release`: Publish versions to the npm registry.

## Release workflow

This repo uses a GitHub Actions workflow to create version bump pull requests
and publish packages after merge. The workflow runs on pushes to `main` and
splits into two paths based on the commit message.

1. Add Changesets in feature branches and merge them into `main`.
2. On `main`, the workflow opens a release pull request that updates package
   versions and changelogs.
3. Merge the release pull request back into `main`.
4. The workflow builds all packages and runs `pnpm pub:release` to publish to
   npm, then pushes Git tags.

## License

[`MIT`](LICENSE)

[node-badge]: https://img.shields.io/badge/Node.js-%3E%3D22-339933?logo=node.js&logoColor=white
[node-url]: https://nodejs.org
[pnpm-badge]: https://img.shields.io/badge/pnpm-%3E%3D10-f69220?logo=pnpm&logoColor=white
[pnpm-url]: https://pnpm.io

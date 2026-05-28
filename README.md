[![node][node-badge]][node-url]
[![pnpm][pnpm-badge]][pnpm-url]

# web-tools

`web-tools` is a pnpm workspace monorepo for small web-focused TypeScript
packages. Each package can be built, tested, released, and documented from the
workspace root.

## Requirements

Use the runtime versions declared in `package.json`:

- Node.js `>=22`
- pnpm `>=10`

Install dependencies from the repo root:

```sh
pnpm install
```

## Packages

This repo publishes several packages that work together or independently. Each
package links to its README for details:

- [`es-stl`](packages/es-stl/README.md): Standard data structures, algorithms,
  and utility functions for TypeScript.
- [`ui-block`](packages/ui-block/README.md): Blocking user interaction
  while async work is running.

## Scripts

Run these scripts from the repo root with pnpm:

- `pnpm install`: Install workspace dependencies.
- `pnpm lint`: Run ESLint and Prettier checks in parallel.
- `pnpm test`: Run Jest across all workspace packages.
- `pnpm build`: Build all packages with TypeScript declarations.
- `pnpm docs`: Build docs for packages that define a `docs` script.
- `pnpm pub:changeset`: Create a Changeset for versioning.
- `pnpm pub:release`: Publish versions to the npm registry.

You can also scope commands to one package:

```sh
pnpm --filter es-stl build
pnpm --filter es-stl test
pnpm --filter es-stl run docs
pnpm --filter ui-block build
pnpm --filter ui-block test
```

## Documentation

Package docs are built from the workspace root with `pnpm docs`. The script
scans `packages/*/package.json` and runs each package that defines
`scripts.docs`.

Each package docs command must write its generated site to:

```txt
docs/<package-name>
```

For example, `es-stl` uses TypeDoc and writes to `docs/es-stl`. GitHub Pages
serves that package at:

```txt
https://porky-prince.github.io/web-tools/es-stl/
```

The root docs script also creates `docs/.nojekyll` so GitHub Pages serves the
static files without Jekyll processing.

## Release workflow

This repo uses a GitHub Actions workflow to create version bump pull requests
and publish packages after merge. The workflow runs on pushes to `main` and
splits into two paths based on the commit message.

1. Add Changesets in feature branches and merge them into `main`.
2. On `main`, the workflow opens a release pull request that updates package
   versions and changelogs.
3. Merge the release pull request back into `main`.
4. The workflow builds all packages and runs `pnpm pub:release` to publish to
   npm.
5. After publishing succeeds, the workflow pushes Git tags, builds package docs,
   uploads the `docs` directory as a GitHub Pages artifact, and deploys it.

Repository settings must use **GitHub Actions** as the GitHub Pages source.

Package changes require a Changeset. Pull requests that modify `packages/`
without a `.changeset` entry fail the changeset check.

## Package conventions

Keep new packages under `packages/<package-name>`. A publishable package must
define its build, test, and package metadata in its own `package.json`.

If a package has generated documentation, add a package-level `docs` script and
configure the generator to write to `../../docs/<package-name>`. The root
`pnpm docs` command picks it up automatically.

## License

[`MIT`](LICENSE)

[node-badge]: https://img.shields.io/badge/Node.js-%3E%3D22-339933?logo=node.js&logoColor=white
[node-url]: https://nodejs.org
[pnpm-badge]: https://img.shields.io/badge/pnpm-%3E%3D10-f69220?logo=pnpm&logoColor=white
[pnpm-url]: https://pnpm.io

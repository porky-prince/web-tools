# AGENTS.md

## Project overview

`web-tools` is a pnpm workspace for small web-focused packages. The repository
currently contains one publishable TypeScript package at
`packages/ui-block`.

The repo is intentionally small, but it already includes workspace-level lint,
test, build, commit, and release automation. Agents should work from the repo
root unless a task is explicitly package-scoped.

## Repository layout

The main areas you will touch are:

- `packages/ui-block/src`: Package source files.
- `packages/ui-block/test`: Jest tests for `ui-block`.
- `.changeset`: Changeset metadata for versioning and release PR generation.
- `.github/workflows`: CI checks for missing changesets and automated publish
  flow.

## Environment and setup

Use the versions declared in the root `package.json`:

- `node >=22`
- `pnpm >=10`

Install dependencies from the repository root:

```sh
pnpm install
```

Local commands may print a warning if `NPM_TOKEN` is unset because `.npmrc`
references `${NPM_TOKEN}` for publishing. The warning does not block linting or
building.

## Development workflow

Run workspace commands from the repository root:

- Install dependencies: `pnpm install`
- Run all lint checks: `pnpm lint`
- Run all tests: `pnpm test`
- Build all packages: `pnpm build`
- Check commit messages against Conventional Commits: `pnpm commitlint`
- Create a changeset: `pnpm pub:changeset`

For package-focused work in `packages/ui-block`, use:

- Watch TypeScript compilation: `pnpm --filter ui-block start`
- Build the package: `pnpm --filter ui-block build`
- Run the package tests: `pnpm --filter ui-block test`

## Testing instructions

The repository uses Jest with `ts-jest`. The root config collects coverage from
`**/src/**/*.{js,ts}` and matches tests in `**/test/**/*.test.{js,ts}`.

Before concluding work, run the checks that match your changes:

1. Run `pnpm lint`.
2. Run `pnpm test` for behavioral changes.
3. Run `pnpm build` if you changed exports, types, or build inputs.

Known issue as of May 7, 2026:

- `pnpm test` currently fails in `packages/ui-block/test/index.test.ts` because
  Jest cannot resolve `../src` during TypeScript compilation
  (`TS2307: Cannot find module '../src'`). Do not assume the test suite is
  green before you address that configuration or test issue.

When you add or modify behavior, update or add tests in
`packages/ui-block/test`.

## Code style and conventions

This repo uses ESLint 9, TypeScript ESLint, and Prettier 3. Formatting and
linting rules are centralized at the root.

Follow these conventions:

- Use TypeScript for package code.
- Keep formatting consistent with Prettier defaults configured in
  `prettier.config.js`: 2 spaces, semicolons, single quotes, trailing commas
  where valid, and 80-character line width.
- Keep imports organized. Prettier runs `prettier-plugin-organize-imports`.
- Preserve strict TypeScript settings in `packages/ui-block/tsconfig.json`.
- Keep package entrypoints exported through `packages/ui-block/src/index.ts`.

The pre-commit flow is managed with Husky and `lint-staged`, which runs:

- `prettier --cache --write` and `eslint --cache --fix` on `*.{js,ts}`
- `prettier --cache --write` on `*.json`

## Changesets and release workflow

Package changes require a changeset. CI checks pull requests for modifications
under `packages/` and fails if no file is added under `.changeset`.

For any user-facing package change:

1. Run `pnpm pub:changeset`.
2. Commit the generated file in `.changeset/`.
3. Merge the feature branch into `main`.

On pushes to `main`, GitHub Actions:

1. Opens a release pull request when the push is not a release commit.
2. Publishes packages after the release pull request is merged.
3. Pushes Git tags after publishing.

`pnpm pub:release` is intended for CI-driven publishing and depends on
`NPM_TOKEN`.

## Pull request guidance

Use clear Conventional Commit messages. The repo uses
`@commitlint/config-conventional`.

Keep pull requests easy to review:

- Include the related issue when one exists.
- Explain the cause or purpose of the change.
- Summarize what changed.
- Describe the test case you ran.

If you edit package code, expect CI to require both a changeset and passing
checks.

## Package notes

`packages/ui-block` is the only workspace package today. Keep package-specific
implementation details in the package README or source comments instead of this
root guide unless they affect repo-wide workflows.

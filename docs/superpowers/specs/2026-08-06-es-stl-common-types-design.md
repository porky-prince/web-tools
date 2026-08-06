# `es-stl` common types design

This change expands the public type utilities in `es-stl` while preserving all
existing exports. The new declarations stay focused on common, shallow type
operations and reusable callback signatures.

## Scope

The implementation adds the following public types to
`packages/es-stl/src/type/index.ts`:

- `Primitive`
- `ElementOf`
- `ValueOf`
- `Awaitable`
- `Constructor`
- `AbstractConstructor`
- `RequiredKeys`
- `OptionalKeys`
- `Brand`
- `Predicate`
- `Mapper`
- `Comparator`
- `AsyncCallback`

The implementation preserves every existing type, including `Thenable`,
`AnyObject`, `Callback`, and `AnyCallback`. It doesn't add JSON-specific or deep
recursive utility types.

## API design

The new generic declarations use descriptive parameter names such as `Args`,
`Result`, `Instance`, and `Key`. Parameter tuples use `unknown[]` when callers
provide an exact callable signature. Existing declarations retain their current
signatures to avoid compatibility changes.

All new public types receive TSDoc summaries, type parameter descriptions, and
usage examples. Existing public declarations without documentation receive the
same treatment.

## Source organization

All declarations remain in `packages/es-stl/src/type/index.ts`. The package is
small enough that splitting these declarations into additional files would add
navigation and export overhead without improving ownership boundaries.

## Verification

Compile-time tests import the public types and exercise representative valid
signatures. They cover tuple callback parameters, synchronous and asynchronous
results, constructor arguments, property modifiers, branded values, array
elements, and object values.

The completed change must pass the package type tests, repository lint, package
tests, and the `es-stl` build. Because the change expands a publishable package's
public API, it also includes a minor changeset.

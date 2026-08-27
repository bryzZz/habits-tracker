# Coding Standards

Conventions for `src/**`, resolved via a grilling session on 2026-08-26.
`src/components/ui/**` (shadcn-generated primitives) is exempt from everything here — it's
vendored code, regenerated from templates we don't control.

## Components

Always a `const` typed with `FC`, never a `function` declaration:

```tsx
import type { FC } from "react";

interface FooProps {
  label: string;
}

const Foo: FC<FooProps> = ({ label }) => {
  return <div>{label}</div>;
};
```

No props → `FC` with no generic. With `memo`, wrap the arrow function itself — the annotation
still applies to the outer `const`:

```tsx
const Foo: FC<FooProps> = memo(({ label }) => {
  return <div>{label}</div>;
});
```

## Hooks

Always `const`:

```ts
const useFoo = (arg: Arg) => {
  /* ... */
};
```

## All functions, everywhere in `src/`

Handlers and helpers inside a component/hook body, and plain module-level functions in
`src/lib/*.ts`, are always `const` arrow functions — never `function` declarations or function
expressions. One shape, no exceptions inside `src/`.

## Exports

No default exports in `src/**`. Named exports only. (Root-level config files —
`vite.config.ts`, `vitest.config.ts` — keep default exports; that's the tooling's contract, not
ours.)

## Function body order

Inside a component or hook body: other hook calls → derived `const`/`useMemo` → handler
`const`s → `useEffect`/`useLayoutEffect` → `return`. Effects always come last, immediately
before the return.

## Early return

Guard clauses over wrapping the happy path in `if`. Reference example: `App.tsx`'s `error`/
`!data` checks at the top, returning early instead of nesting the route tree in an `if`.

## Comments

At most 2 lines. Prefer none — write one only when the _why_ isn't obvious from the code itself
(a non-obvious constraint, a workaround, a subtle invariant). Never restate what the identifiers
already say.

## Unnecessary constants

Don't hoist a value to a module- or component-scope `const` unless it's used more than once, or
exported for another module to use. A value used once, inline it at the call site — even if it's
a long string. If inlining makes the expression hard to read, that's a signal for a `const`
_inside_ the function, not a module-level one.

## JSX

Blank line between every pair of JSX siblings, at every nesting level — including
`{condition && <X />}` and the result of `.map()`. No exceptions for "trivially related" pairs.
Prettier preserves blank lines you write; it won't insert them, so this is a manual habit, not an
autoformat.

## Tailwind classes

- Class order is sorted automatically by `prettier-plugin-tailwindcss` — don't hand-order them.
- Conditional classes always go through `cn()` (`src/lib/utils.ts`) — never a bare `twMerge()`
  call, and never hand-rolled string concatenation or a ternary spliced into a template literal.
  `cn()` already composes `clsx` (conditional syntax) and `twMerge` (conflict resolution).
- Equal width/height → `size-N`, never separate `w-N h-N`.
- Prefer a scale class over an arbitrary px value whenever one lands exactly, including
  Tailwind v4's bare fractional multiples of the spacing unit (`h-9.5` for 38px, not `h-[38px]`)
  for width/height/padding/margin/gap/inset-family utilities.
  Font-size, border-radius, border-width, and ring-width are _not_ spacing-scale utilities in
  Tailwind v4 — they only have a named theme scale, no numeric multiplier. But check the named
  scale itself before assuming an arbitrary value there is unavoidable: our `--radius-*` steps
  (`sm`/`md`/`lg`/`xl`/`2xl`/`3xl`/`4xl`) resolve to fixed px values off `--radius: 0.625rem`
  (6/8/10/14/18/22/26px), and the default `--text-*` scale similarly lands on fixed px values
  (`xs` = 12px, `sm` = 14px, `base` = 16px, ...) — an arbitrary value that happens to match one of
  these exactly (`rounded-[8px]` = `rounded-md`, `text-[12px]` = `text-xs`) must use the named
  class instead. Only stay arbitrary (`rounded-[7px]`, `text-[11px]`) when no step matches;
  eliminating those would mean inventing new theme tokens, which is a separate design-system
  decision, not a code-style one.
- No fractional (`.5`) px in an arbitrary bracket value, in any utility family — round down to
  the nearest whole pixel (`text-[12.5px]` → `text-[12px]`, `border-[1.5px]` → `border-[1px]`).
  This is a deliberate (if small) visual change, not just a style cleanup — sub-pixel values
  render inconsistently across browsers/zoom levels.

## Icons

Try `lucide-react` first. Only build a custom icon component when lucide doesn't have it, under
`src/components/icons/`, mirroring lucide's own prop surface (`className`, `size?`, the rest
spread onto the `<svg>`) so it's a drop-in replacement anywhere a lucide icon would go.

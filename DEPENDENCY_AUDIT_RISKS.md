# Dependency & Audit Risks

Frontend location: `HandloomSarees/Ecommerce`

## Current audit status

The last successful npm audit evidence for this workspace reported:

| Severity | Count |
| --- | ---: |
| Critical | 0 |
| High | 13 |
| Moderate | 2 |
| Low | 3 |

During the continuation pass on September 4, 2026:

- `npm outdated` completed.
- The final `npm audit` completed after `npm ci`.
- No dependency versions were changed because the network install/update approval was rejected.
- `npm audit fix --force` was not run.

## Direct runtime findings requiring remediation

| Package | Current | Wanted | Latest | Classification | Action |
| --- | ---: | ---: | ---: | --- | --- |
| `axios` | 1.14.0 | 1.20.0 | 1.20.0 | Direct runtime | Upgrade within same major before production traffic |
| `react-router-dom` | 7.14.0 | 7.18.3 | 7.18.3 | Direct runtime | Upgrade within same major before production traffic |
| `@supabase/supabase-js` | 2.104.0 | 2.115.0 | 2.115.0 | Direct runtime; pulls websocket client dependencies | Upgrade within same major before production traffic |

## Direct build/dev findings requiring remediation

| Package | Current | Wanted | Latest | Classification | Action |
| --- | ---: | ---: | ---: | --- | --- |
| `vite` | 7.3.1 | 7.3.6 | 8.2.2 | Direct dev/build tooling | Upgrade to 7.3.6 first; avoid Vite 8 until migration-tested |
| `@vitejs/plugin-react` | 5.1.3 | 5.2.0 | 6.1.1 | Direct dev/build tooling | Upgrade to 5.2.0 first; avoid major upgrade until migration-tested |

## Transitive/build-tool findings

Known transitive findings from the prior audit include:

- `@babel/core`
- `@humanfs/node`
- `brace-expansion`
- `browserslist`
- `esbuild`
- `flatted`
- `follow-redirects`
- `form-data`
- `js-yaml`
- `nanoid`
- `picomatch`
- `postcss`
- `postcss-selector-parser`
- `ws`

Most are build/dev-tool exposure in this Vite client app. They still need cleanup before production release because developers run the dev server locally and CI runs the build pipeline.

## Production recommendation

Before production traffic:

1. Apply same-major updates for `axios`, `react-router-dom`, `@supabase/supabase-js`, `vite`, and `@vitejs/plugin-react`.
2. Run `npm ci`.
3. Run `npm run lint`.
4. Run `npm run build`.
5. Re-run `npm audit`.
6. Do not use `npm audit fix --force` unless a separate major-upgrade migration is explicitly approved.

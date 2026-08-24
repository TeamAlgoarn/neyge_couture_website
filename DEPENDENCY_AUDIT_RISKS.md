# Dependency & Audit Risks

This document outlines the dependency vulnerabilities identified during the frontend audit.

## Frontend (`HandloomSarees/Ecommerce`) Audit Results

**Summary**: 15 vulnerabilities (2 low, 1 moderate, 12 high)

### High Severity Risks
1. **Axios (1.0.0 - 1.17.0)**
   - Issues include SSRF bypasses, Prototype Pollution gadgets, CRLF Injection, and ReDoS.
   - *Risk*: High risk if the frontend handles untrusted input that is passed directly to axios config or if running on a server (SSR). Since this is a client-side Vite app, the risk is slightly mitigated but still a significant concern.
2. **Brace-expansion (<=1.1.17 || 3.0.0 - 5.0.8)**
   - Issues: Zero-step sequence process hang, memory exhaustion, DoS via unbounded expansion.
   - *Risk*: Mostly affects build tooling or backend parsing, but should be patched.
3. **Esbuild (0.27.3 - 0.28.0)**
   - Allows arbitrary file read when running the development server on Windows.
   - *Risk*: Impacts local development environments on Windows.
4. **Flatted (<=3.4.1)**
   - Unbounded recursion DoS and Prototype Pollution in `parse()` revive phase.
5. **Form-data (4.0.0 - 4.0.5)**
   - CRLF injection via unescaped multipart field names.
6. **JS-YAML (4.0.0 - 4.3.0)**
   - Quadratic-complexity DoS in merge key handling.
7. **Nanoid (<=3.3.17)**
   - Non-secure/custom generators can loop indefinitely with negative/zero size.
8. **Picomatch (<=2.3.1 || 4.0.0 - 4.0.3)**
   - Method Injection and ReDoS vulnerabilities via glob matching.
9. **PostCSS (<=8.5.22)**
   - XSS via unescaped `</style>` in output and arbitrary file read via source maps.
10. **React Router / React Router DOM (6.0.0 - 7.18.1)**
    - Potential CSRF, Open redirect, DoS via unbounded path expansion, and RCE in vendored turbo-stream.
    - *Risk*: High priority update needed for core routing library.
11. **Vite (7.0.0 - 7.3.3)**
    - Path Traversal, arbitrary file read via WebSocket, `server.fs.deny` bypass.
    - *Risk*: Impacts dev server and build processes.
12. **WS (8.0.0 - 8.20.1)**
    - Uninitialized memory disclosure and Memory exhaustion DoS.

### Moderate / Low Severity Risks
- **Follow-redirects (<=1.15.11)**: Leaks custom authentication headers to cross-domain redirect targets.
- **@babel/core**: Arbitrary File Read via sourceMappingURL Comment.

## Build and Lint Status
- **ESLint**: Passed with no critical errors.
- **Vite Build**: Passed (`built in 36.74s`).
  - *Warning*: PostCSS noted `@import must precede all other statements` in the CSS file.
  - *Warning*: Several chunks are >500kB (consider dynamic `import()` or manual chunking for optimization).

## Recommendation
Run `npm audit fix` in the frontend directory (`HandloomSarees/Ecommerce`) prior to staging deployment, and test thoroughly to ensure no breaking changes were introduced by minor dependency bumps.

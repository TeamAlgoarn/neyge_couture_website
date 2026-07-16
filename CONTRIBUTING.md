# Contributing

## Branch Workflow

```text
integration branch
    -> feature/<issue-number>-short-name
    -> pull request
    -> review
    -> testing
    -> merge
```

## Rules

- Never push directly to integration or production.
- One task per branch.
- Pull before starting.
- Rebase or merge the latest integration branch before PR review.
- Use meaningful commits.
- No credentials in code.
- No undocumented schema changes.
- No production database operations.
- UI PRs require screenshots.
- Backend PRs require API/test evidence.
- Build and tests must pass.

## Local Checks

Frontend:

```bash
cd HandloomSarees/Ecommerce
npm install
npm run build
npm run lint
```

Backend:

```bash
cd HandloomSarees/server
python -m compileall app
python -c "from app.main import app; print(app.title)"
pytest -q
python -m pip check
```

# Intern Onboarding Message

Hi team,

Welcome to the Neyge 15-day completion sprint. We are working from the integration branch below and all work must go through pull requests.

Repository branch:

```text
integration/neyge-15-day-sprint
```

Important rule:

Do not push directly to `integration/neyge-15-day-sprint`. Create your own feature branch, open a PR into `integration/neyge-15-day-sprint`, and wait for review before merge.

## Setup

```bash
git clone <repository-url>
cd neyge_couture_website
git fetch origin
git switch integration/neyge-15-day-sprint
git pull
```

## Frontend Setup

```bash
cd HandloomSarees/Ecommerce
npm install
npm run build
npm run lint
```

Expected frontend baseline:

```text
npm run build -> pass
npm run lint -> known baseline around 84 errors and 1 warning
```

Frontend first task:

```text
[P0] Resolve Frontend Lint Baseline
```

Create your branch:

```bash
git switch integration/neyge-15-day-sprint
git pull
git switch -c feature/frontend-lint-cleanup
```

## Backend Setup

```bash
cd HandloomSarees/server
python -m pip install -r requirements.txt
pytest -q
python -m compileall app
python -c "from app.main import app; print(app.title)"
```

Expected backend baseline:

```text
pytest -q -> 10 passed
backend import -> Neyge Couture Backend
```

Backend first task:

```text
[P0] Expand Admin and Integration Route Security Tests
```

Create your branch:

```bash
git switch integration/neyge-15-day-sprint
git pull
git switch -c feature/admin-route-security-tests
```

## PR Rules

- Open PRs against `integration/neyge-15-day-sprint`.
- Keep each PR focused on one issue.
- Include command output evidence in the PR description.
- Do not commit `.env`, credentials, tokens, screenshots containing secrets, generated dependency folders, or build artifacts.
- Do not call live WhatsApp, Instagram, Razorpay, Supabase production, or deployment services unless the project owner explicitly approves it.
- Do not disable major lint/security rules without review.
- Ask before changing payment, Meta webhook, production deployment, or database migration logic.

## Daily Updates

Send one update each day with:

- What you completed
- What you are working on next
- Any blocker
- PR link, if opened
- Test/build status

## If Your Baseline Differs

Stop before making code changes and send:

- Your OS and Node/Python versions
- The command that failed
- The full error output
- Whether `.env` is present locally, without sharing any secret values

Do not continue by changing configuration until the baseline difference is reviewed.

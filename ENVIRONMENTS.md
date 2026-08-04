# Environments & Deploy Workflow

Two ways to test before touching the live site — use whichever fits the change.

| Environment | URL | Data | Donations | When to use |
|---|---|---|---|---|
| **Production** | birkat-avraham.com | real (`birkat-avraham`) | **live** (real ₪) | the live site |
| **Preview channel** | temporary `…--preview-….web.app` | **real** (prod data) | live | quick review of a build before promoting; UI/layout changes |
| **Staging project** | `birkat-avraham-staging.web.app` | isolated (`birkat-avraham-staging`) | demo (no charge) | risky work / content-edit & donation testing without touching prod |

Config lives in gitignored env files: `.env` = production, `.env.staging` = staging
overrides. Both bake into the build at build time (`vite --mode staging` layers
`.env.staging` on top of `.env`).

---

## One-time

```bash
npm run login     # firebase login (opens browser; the project's Google account)
```

## Everyday: preview → promote (recommended for every change)

Never deploy straight to production. Deploy to a **preview channel**, review the
temporary URL, then promote:

```bash
npm run deploy:preview   # builds (prod config) + publishes a temporary URL (expires in 7 days)
# → open the printed URL, verify the change
npm run deploy           # promote: deploy the same build to production (birkat-avraham.com)
```

Preview channels use the **production database**, so they're perfect for UI,
layout, and copy changes. For anything that writes data (content edits) or
touches donations, use staging instead.

## Staging project (isolated data)

A full second environment with its own Firestore/Auth/Storage and **demo-mode
donations** (no Nedarim token → no real charges). Best for the TypeScript
refactor and for testing admin edits safely.

**First-time staging setup** (in the `birkat-avraham-staging` Firebase console):
1. Enable **Firestore** (location `eur3`), **Storage**, and **Authentication → Email/Password**.
2. Add the editor user (e.g. `kolelbirkatavraham@gmail.com`) under Authentication → Users.
3. Deploy code + rules and seed the content:
   ```bash
   npm run deploy:staging     # builds staging + deploys hosting, Firestore & Storage rules
   ENV_FILE=.env.staging SEED_EMAIL="kolelbirkatavraham@gmail.com" SEED_PASSWORD="…" \
     node scripts/seedFirestore.mjs
   ```
4. Add `birkat-avraham-staging.web.app` to Authentication → Settings → Authorized domains.

**Deploying to staging afterwards:**
```bash
npm run deploy:staging
```

---

## Script reference

| Script | What it does |
|---|---|
| `npm run dev` | local dev server |
| `npm run deploy` | build + deploy hosting to **production** |
| `npm run deploy:all` | build + deploy hosting **and rules** to production |
| `npm run deploy:rules` | deploy only Firestore/Storage rules to production |
| `npm run deploy:preview` | build + publish a temporary **preview** URL (prod data) |
| `npm run deploy:staging` | build (staging config) + deploy everything to the **staging** project |
| `npm run build` / `build:staging` | production / staging build only (no deploy) |

> Tip: after several commits land on `main`, push them through `deploy:preview`
> first — one review, then `deploy` to go live.

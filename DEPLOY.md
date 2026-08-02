# Deploy & Launch — birkat-avraham.com

Hosting: **Firebase Hosting** (free SSL). Domain: **birkat-avraham.com** (Namecheap).
Config already in the repo: `firebase.json`, `.firebaserc` (project `birkat-avraham`),
Vite `base: '/'`.

Steps marked **⚡ you** need your Google account (the Firebase CLI login is interactive,
so they can't be automated from here). Everything else is already done in the code.

---

## 1. One-time CLI setup ⚡ you

```bash
npx firebase-tools login          # opens a browser; sign in with the project's Google account
```

(No global install needed — `npx firebase-tools` runs it on demand.)

## 2. First deploy ⚡ you

From the project folder:

```bash
npm run deploy:all
```

This builds `dist/` and deploys **hosting + Firestore rules + Storage rules**. When it
finishes it prints a **Hosting URL** like `https://birkat-avraham.web.app` — open it and
confirm the live site loads (this is the real site, before the custom domain is attached).

> Later, for content/code updates: `npm run deploy` (hosting only) or `npm run deploy:rules`
> (rules only).

## 3. Connect the custom domain ⚡ you

1. Firebase Console → **Hosting** → **Add custom domain**.
2. Enter `birkat-avraham.com`. When asked, also add the redirect for `www.birkat-avraham.com`.
3. Firebase shows **DNS records** to add — usually:
   - a **TXT** record (domain-ownership verification), and/or
   - two **A** records for the apex domain pointing at Firebase's IPs.
   Keep that page open; you'll paste these into Namecheap in the next step.

## 4. Namecheap DNS ⚡ you

Namecheap Dashboard → **Domain List** → `birkat-avraham.com` → **Manage** → **Advanced DNS**.

1. **Remove** Namecheap's default parking records (the `CNAME www → parkingpage.com` and the
   `URL Redirect @ → http://www...` records) — they conflict with Firebase.
2. **Add** exactly the records Firebase gave you in step 3 (Type / Host / Value):
   - TXT verification record (Host `@`).
   - The two A records for the apex (Host `@`) → Firebase's IPs.
   - For `www`: add whatever Firebase specifies (usually a CNAME or A records).
3. Save. DNS propagation + SSL issuance is usually minutes, up to ~24h. Firebase will show
   "Connected" and provision the certificate automatically (free).

## 5. Authorize the domain for login ⚡ you

So the `/admin` login works on the new domain:

Firebase Console → **Authentication → Settings → Authorized domains → Add domain** →
add `birkat-avraham.com` (and `www.birkat-avraham.com`).

---

## 6. Post-launch checks

- [ ] `https://birkat-avraham.com` loads with a valid padlock (SSL).
- [ ] Content shows (it reads from Firestore).
- [ ] `/admin` login works with the gabbai account.
- [ ] Make an edit in `/admin` and confirm it appears on the site.
- [ ] **Live ₪1 donation test** on the real domain, then void/refund it in the Nedarim panel.
- [ ] Upload a photo in `/admin` (gallery) and confirm it appears.

## Notes

- The old GitHub Pages site (`barakwork95.github.io/birkat-avraham`) is retired — the app is
  now built for the domain root, not the `/birkat-avraham/` subpath.
- The built bundle (served publicly) contains the Firebase web config and the Nedarim
  ApiValid — both are client-side values by design, so this is expected and safe.
- `.env` stays local/gitignored; the values get baked into `dist/` at build time.

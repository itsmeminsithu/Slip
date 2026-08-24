# Slip — Money Manager

A single-file, offline-capable daily **income & expense** manager: accounts with live
balances, transfers, per-business tagging, day/week/month charts, day-by-day split,
search, backup/restore, and **AI slip scanning** (photograph a receipt or bank/PromptPay/
KBZPay slip and it extracts the amount, merchant, date, category, and payment method).

Everything runs in the browser. Your data is stored on your own device
(`localStorage`) — there is no server and no account.

---

## Contents

```
index.html          the whole app
manifest.json       PWA metadata (installable app)
service-worker.js   offline caching of the app shell
icons/              app icons (192, 512)
proxy/worker.js     OPTIONAL server proxy so a public deploy can hide the API key
```

---

## 1. Run it locally

From this folder:

```bash
python3 -m http.server 8080
```

Open **http://localhost:8080/** — done. (Use the local server, not a `file://`
double-click; Safari blocks storage and network on `file://`.)

Node alternative: `npx serve` or `npx http-server -p 8080`.

---

## 2. Put it on GitHub + go live (GitHub Pages)

```bash
git init
git add .
git commit -m "Slip money manager"
git branch -M main
git remote add origin https://github.com/itsmeminsithu/slip.git   # your repo URL
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build from branch → `main` / root → Save.**
Your app goes live at `https://itsmeminsithu.github.io/slip/` over HTTPS
(HTTPS is required for PWA install and for building an APK).

> Note on privacy: the login on the page is a *soft lock* — the password hash is in
> `index.html`, so anyone with the URL and some skill could bypass it. If you want the
> tool private, keep the **repo private** and/or change the hash (see Security below).

---

## 3. Install as an app (no APK needed)

Once it's live over HTTPS:

- **Android (Chrome):** open the URL → menu (⋮) → **Install app** / **Add to Home screen**.
  It launches full-screen like a native app and works offline.
- **iPhone (Safari):** Share → **Add to Home Screen**.

For most people this is all you need — it *is* the app.

---

## 4. Build a real Android APK

You need the app hosted over HTTPS first (step 2). Then pick one:

### Easiest — PWABuilder (no tooling)
1. Go to **https://www.pwabuilder.com**
2. Paste your live URL (e.g. `https://itsmeminsithu.github.io/slip/`).
3. Click **Package for stores → Android → Download**.
4. You get a signed `.apk` (and `.aab` for Play Store). Copy the `.apk` to your phone
   and install it (enable "install unknown apps" for your file manager first).

### Developer route — Bubblewrap (Google's TWA tool)
```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://itsmeminsithu.github.io/slip/manifest.json
bubblewrap build
# -> app-release-signed.apk
```
Bubblewrap will offer to install the JDK + Android SDK if you don't have them.

### Full control — Capacitor (bundles the web app into a native project)
```bash
npm init -y
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init Slip com.minsithu.slip --web-dir=.
npx cap add android
npx cap copy
npx cap open android      # builds the APK in Android Studio
```
Capacitor bundles the files inside the APK, so it doesn't depend on GitHub Pages
staying up.

---

## 5. Turn on AI slip scanning

Scanning uses the Anthropic API. Open **Settings** in the app → paste your key from
**console.anthropic.com** → Save. The key is stored only in your browser, never in the
repo or your backups. Without a key, everything works except auto-reading — it just
opens the manual entry form.

**Publishing publicly?** Don't rely on each visitor pasting a key. Deploy
`proxy/worker.js` as a Cloudflare Worker (instructions inside the file) so your key
stays server-side, then point `askClaude()` in `index.html` at the Worker URL.

---

## Security notes

- **Login is a soft lock**, not encryption. Fine for a personal device; not real access
  control. To change the password: run
  `printf '%s' 'YOUR_NEW_PASSWORD' | shasum -a 256` and paste the hash into the `PWHASH`
  value in `index.html`.
- **Never commit an API key.** `.gitignore` already excludes `.env` and key files. The
  in-app key lives in `localStorage`, not in the code.
- **Back up regularly.** Data lives in one browser. Settings → Backup exports a `.json`
  you can restore anywhere; the app also nudges you.

## License

MIT — see [LICENSE](LICENSE).

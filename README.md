# Slip — Money Manager

Slip tracks daily income and expenses. It is one HTML file, it works offline, and your data stays in your browser (`localStorage`). No server, no account.

What it does: accounts with balances that update as you enter things, transfers, a tag per business, day/week/month charts, a day-by-day split, search, and backup/restore. It can also read a slip for you: photograph a receipt, or a bank/PromptPay/KBZPay slip, and it pulls out the amount, merchant, date, category and payment method. That part needs an API key — see section 5.

## Files

```
index.html          the whole app
manifest.json       PWA metadata (installable app)
service-worker.js   offline caching of the app shell
icon-192.png        app icon (192)
icon-512.png        app icon (512)
worker.js           OPTIONAL server proxy so a public deploy can hide the API key
```

## 1. Run it locally

```bash
python3 -m http.server 8080
```

Open **http://localhost:8080/**. Use the local server rather than double-clicking the file: Safari blocks storage and network on `file://`.

Node works too: `npx serve` or `npx http-server -p 8080`.

## 2. Put it on GitHub Pages

```bash
git init
git add .
git commit -m "Slip money manager"
git branch -M main
git remote add origin https://github.com/itsmeminsithu/slip.git   # your repo URL
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build from branch → `main` / root → Save.** It goes live at `https://itsmeminsithu.github.io/slip/` over HTTPS. HTTPS is required for PWA install and for building an APK.

One privacy note: the login on the page is a *soft lock*. The password hash sits in `index.html`, so someone with the URL and some skill can get past it. If you want this private, keep the **repo private** and/or change the hash (Security, below).

## 3. Install it as an app

Once it is live over HTTPS, no APK is needed:

- **Android (Chrome):** open the URL → menu (⋮) → **Install app** / **Add to Home screen**. It opens full-screen and works offline.
- **iPhone (Safari):** Share → **Add to Home Screen**.

For most people that is the app.

## 4. Build an Android APK

The app has to be hosted over HTTPS first (step 2). Then one of these:

**PWABuilder — no tooling**

1. Go to **https://www.pwabuilder.com**
2. Paste your live URL (e.g. `https://itsmeminsithu.github.io/slip/`).
3. Click **Package for stores → Android → Download**.
4. You get a signed `.apk` (and `.aab` for Play Store). Copy the `.apk` to your phone and install it (turn on "install unknown apps" for your file manager first).

**Bubblewrap — Google's TWA tool**

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://itsmeminsithu.github.io/slip/manifest.json
bubblewrap build
# -> app-release-signed.apk
```

Bubblewrap offers to install the JDK and Android SDK if you do not have them.

**Capacitor — bundles the app into a native project**

```bash
npm init -y
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init Slip com.minsithu.slip --web-dir=.
npx cap add android
npx cap copy
npx cap open android      # builds the APK in Android Studio
```

Capacitor puts the files inside the APK, so it does not depend on GitHub Pages staying up.

## 5. Turn on slip scanning

Scanning uses the Anthropic API. In the app, open **Settings**, paste your key from **console.anthropic.com**, save. The key is kept only in your browser — not in the repo, not in your backups. With no key, everything else still works; scanning just opens the manual entry form instead.

**Publishing publicly?** Do not expect each visitor to paste a key. Deploy `proxy/worker.js` as a Cloudflare Worker (instructions are inside the file) so the key stays server-side, then point `askClaude()` in `index.html` at the Worker URL.

## Security

- **The login is a soft lock**, not encryption. Fine on a personal device, not real access control. To change the password: run `printf '%s' 'YOUR_NEW_PASSWORD' | shasum -a 256` and paste the hash into the `PWHASH` value in `index.html`.
- **Never commit an API key.** `.gitignore` already excludes `.env` and key files. The in-app key lives in `localStorage`, not the code.
- **Back up.** Your data lives in one browser. Settings → Backup exports a `.json` you can restore anywhere. The app nudges you about this too.

## License

MIT — see [LICENSE](LICENSE).

## Live preview (after merge — not live yet)

Slip is a static PWA, so GitHub Pages needs no extra config. Pages settings cannot be set via the GitHub App, so after this PR merges, turn it on in a browser:

1. Repo **Settings → Pages → Build and deployment → Deploy from a branch**.
2. Branch: `main`, folder: `/ (root)`. Save.
3. The site will be at https://itsmeminsithu.github.io/Slip/

No preview URL is live until that step is done. Slip scanning still needs a key pasted in Settings (or the `worker.js` proxy from section 5). Pages hosting on its own does not add it.

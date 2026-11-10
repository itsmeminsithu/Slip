# Slip — Personal Money Manager

An offline-capable personal finance web app.

## Run locally

```bash
cd slip
python3 -m http.server 8080
```

Open http://localhost:8080.

## Pages

- **Overview:** total balance, today's activity, quick entry and recent transactions.
- **Transactions:** search and edit the ledger.
- **Accounts:** bank, cash and wallet balances, plus transfers.
- **Insights:** spending chart, category/account breakdowns and trends.
- **Settings:** currency, budget, account setup, export and restore.

Receipt scanning is optional and requires a valid Anthropic API key and network access.

## Existing data

Version 2 keeps the `slip:ledger:v2` localStorage key. Make a backup from Settings before replacing an installed version. Local storage is specific to each browser and origin. The new layout hides business-scope filters but does not delete existing business tags.

## Security

The page password is a *client-side lock*, not strong authentication or encryption. Anyone with access to the application's JavaScript and browser storage may bypass it. Do not treat this as a secure multi-user finance service.

The optional Anthropic API key is stored in browser localStorage and sent directly from the browser. Do not publish an active key on shared computers, and do not expose the app with a private key to the public. For a public deployment, route API requests through a secured backend with authentication and quotas.

Finance data lives in the browser; create regular JSON backups.

Developed by Min SiThu.


## v2.0.1 Daily analytics

The Overview page now includes a 14-day daily income/expense chart, today-versus-yesterday changes (income, expense, net), and 7-day/30-day summaries. Only entries in the selected base currency are included; no implicit foreign-exchange conversion. Transfers are excluded. All metrics update when transactions are edited or restored.

The HTML now declares UTF-8 before other content to prevent currency and icon mojibake. The service worker cache key was bumped to refresh installed/offline clients.

The built-in lock is a client-side convenience feature, not encryption or multi-user access control. Receipt scanning may send data to an external service; keep API credentials out of publicly hosted builds. Back up personal finance data before replacing the app.

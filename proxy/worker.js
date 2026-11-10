// OPTIONAL — Cloudflare Worker that proxies slip-scanning to Anthropic
// so the API key stays server-side (needed only if you host Slip publicly
// and don't want each user to paste their own key).
//
// Setup:
//   1. Create a Worker at dash.cloudflare.com (Workers & Pages > Create).
//   2. Paste this file as the Worker code.
//   3. Add a secret named ANTHROPIC_KEY with your key (sk-ant-...).
//   4. Deploy, copy the Worker URL.
//   5. In index.html, in askClaude(), change the fetch URL to your Worker URL
//      and delete the "x-api-key" / "anthropic-dangerous-direct-browser-access"
//      headers (the Worker adds the key). Then the app no longer needs a key
//      pasted in Settings.

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));
    if (request.method !== "POST") return cors(new Response("POST only", { status: 405 }));
    const body = await request.text();
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01"
      },
      body
    });
    return cors(new Response(await r.text(), { status: r.status, headers: { "content-type": "application/json" } }));
  }
};

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Headers", "content-type");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  return res;
}

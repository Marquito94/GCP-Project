// js/api.js
// Where your API lives right now (GKE Ingress host):
const BACKEND_BASE_URL = "https://backend.apipueba-web-dev.com"; // change to Apigee later if you want

function joinUrl(base, path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/+$/, "")}${p}`;
}

async function callApi(path, { method = "GET", headers = {}, body, timeoutMs = 10000 } = {}) {
  const url = joinUrl(BACKEND_BASE_URL, path);
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs);

  try {
    const res = await fetch(url, {
      method,
      headers: { "Accept": "application/json", ...headers },
      body,
      signal: ctrl.signal,
      // If you later use cookies and same-origin, uncomment:
      // credentials: "include",
    });

    clearTimeout(to);

    const text = await res.text();
    let json;
    try { json = text ? JSON.parse(text) : null; } catch { /* ignore non-JSON */ }

    if (!res.ok) {
      throw new Error(json?.message || `HTTP ${res.status}: ${text?.slice(0, 200)}`);
    }
    return json ?? {};
  } catch (err) {
    return { error: true, message: err.message || String(err) };
  }
}

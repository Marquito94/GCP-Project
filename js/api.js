// 👉 Set your backend base URL here (we’ll wire the real backend later)
const BACKEND_BASE_URL = "https://api.example.com";

async function callApi(path) {
  const url = `${BACKEND_BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return await res.json();
  } catch (err) {
    return { error: true, message: err.message };
  }
}

// 
// ✅ Environment-safe API base
// - Local dev: uses Vite proxy (/api → backend)
// - VPS / production: uses same-origin backend

const BASE_URL = "/api";

export async function api(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // 🔐 Global unauthorized handling
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // ✅ Works for sub-path deployment (/demopush)
    window.location.href = "/";
    return;
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
}

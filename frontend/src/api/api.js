const BASE_URL = "http://localhost:5000/api";

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
    window.location.href = "/"; // ✅ login page
    return;
  }

  // Some endpoints (like logout) may return empty body
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

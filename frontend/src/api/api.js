/* =====================================================
   🌐 API BASE
   ===================================================== */

// ✅ SAME for local + VPS (proxy handles local)
const BASE_URL = "/api";

/*
🧪 LOCAL DIRECT BACKEND (COMMENTED)
Use only if NOT using Vite proxy.

const BASE_URL = "http://localhost:5000/api";
*/

/* =====================================================
   🔗 API HELPER
   ===================================================== */

export async function api(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
      },
    });

    // 🔐 Unauthorized → force logout
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/"; // sub-path safe
      return;
    }

    let data = {};
    try {
      data = await res.json();
    } catch {
      // Non-JSON response (204 / HTML / empty body)
    }

    if (!res.ok) {
      throw new Error(data.message || `API Error (${res.status})`);
    }

    return data;

  } catch (err) {
    console.error("❌ API REQUEST FAILED:", {
      endpoint,
      message: err.message,
    });

    // Optional: user-friendly message
    throw new Error(
      err.message ||
      "Unable to connect to server. Please try again later."
    );
  }
}
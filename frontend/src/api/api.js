/* =====================================================
   🌐 API BASE
   ===================================================== */

const BASE_URL = "/api";

/* =====================================================
   🔗 API HELPER
   ===================================================== */

export async function api(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      body: isFormData
        ? options.body
        : options.body
        ? JSON.stringify(options.body)
        : undefined,
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      // non-JSON response (allowed)
    }

    /* ================= AUTH FAIL ================= */

    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("scope");

      // ⛔ IMPORTANT: THROW, NOT RETURN
      throw new Error(data.message || "Unauthorized");
    }

    /* ================= OTHER ERRORS ================= */

    if (!res.ok) {
      throw new Error(data.message || `API Error (${res.status})`);
    }

    return data;
  } catch (err) {
    console.error("❌ API REQUEST FAILED:", endpoint, err.message);
    throw err;
  }
}

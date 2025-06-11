// api/api.js - FIXED VERSION
const API_BASE_URL = "http://localhost:5000";

// Fungsi untuk decode dan validasi JWT token
function decodeToken(token) {
  try {
    if (!token || typeof token !== "string") {
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("❌ Token format tidak valid - harus memiliki 3 bagian");
      return null;
    }

    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    console.log("🔍 Decoded token payload:", payload);

    return payload;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
}

// Fungsi bantuan untuk ambil token dari localStorage dengan validasi
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ Token tidak ditemukan di localStorage");
    throw new Error("Token tidak ditemukan. Silakan login kembali.");
  }

  // Validasi format token
  const payload = decodeToken(token);
  if (!payload) {
    console.error("❌ Token tidak valid atau corrupt");
    localStorage.removeItem("token");
    throw new Error("Token tidak valid. Silakan login kembali.");
  }

  // Cek apakah token expired
  const currentTime = Date.now() / 1000;
  if (payload.exp && payload.exp < currentTime) {
    console.error("❌ Token expired");
    localStorage.removeItem("token");
    throw new Error("Token expired. Silakan login kembali.");
  }

  // Cek apakah ada user ID dalam token
  if (!payload.userId && !payload.id && !payload.user_id) {
    console.error("❌ Token tidak mengandung User ID:", payload);
    localStorage.removeItem("token");
    throw new Error(
      "Token tidak valid - User ID tidak ditemukan. Silakan login kembali."
    );
  }

  // Debug: Log token info
  console.log(
    "🔍 Token valid dengan User ID:",
    payload.userId || payload.id || payload.user_id
  );
  console.log("🔍 Token expires at:", new Date(payload.exp * 1000));

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Fungsi untuk handle response error
async function handleResponse(response) {
  let data;

  try {
    data = await response.json();
  } catch (error) {
    console.error("❌ Error parsing JSON:", error);
    throw new Error("Server response tidak valid");
  }

  if (!response.ok) {
    console.error("❌ HTTP Error:", {
      status: response.status,
      statusText: response.statusText,
      data: data,
    });

    // Jika token expired atau invalid, hapus dari localStorage
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      console.error("❌ Token invalid/expired, menghapus dari localStorage");

      // Redirect ke login jika di browser
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    // Jika User ID tidak valid, kemungkinan token corrupt
    if (
      response.status === 400 &&
      data.message &&
      data.message.includes("User ID tidak valid")
    ) {
      console.error("❌ User ID tidak valid - token mungkin corrupt");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");

      if (typeof window !== "undefined") {
        alert("Session tidak valid. Silakan login kembali.");
        window.location.href = "/login";
      }
    }

    throw new Error(data.message || `HTTP Error: ${response.status}`);
  }

  return data;
}

// Login
export async function loginUser(email, password) {
  try {
    console.log("🔍 Attempting login for:", email);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);
    console.log("✅ Login response:", data);

    // Simpan token JWT ke localStorage
    const token = data?.data?.token;

    if (token) {
      // Validasi token sebelum menyimpan
      const payload = decodeToken(token);
      if (!payload) {
        throw new Error("Token yang diterima tidak valid");
      }

      // Simpan semua data yang diperlukan
      localStorage.removeItem("token"); // Clear old token
      localStorage.setItem("token", token);

      // Simpan user info jika ada
      if (data.data.user) {
        localStorage.setItem(
          "userId",
          data.data.user.id || data.data.user.userId
        );
        localStorage.setItem("email", data.data.user.email);
      }

      console.log(
        "✅ Token berhasil disimpan dengan User ID:",
        payload.userId || payload.id
      );
    } else {
      console.warn("⚠️ Login berhasil tapi tidak ada token dalam response");
      throw new Error("Login gagal - token tidak diterima");
    }

    return data;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
}

// Registrasi (tidak perlu token)
export async function registerUser(email, password) {
  try {
    console.log("🔍 Attempting registration for:", email);

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    // Jika registrasi memberikan token, simpan juga
    if (data?.data?.token) {
      const token = data.data.token;
      const payload = decodeToken(token);

      if (payload) {
        localStorage.setItem("token", token);

        if (data.data.user) {
          localStorage.setItem(
            "userId",
            data.data.user.user_id || data.data.user.userId
          );
          localStorage.setItem("email", data.data.user.email);
        }

        console.log("✅ Token dari registrasi disimpan");
      }
    }

    return data;
  } catch (error) {
    console.error("❌ Register error:", error);
    throw error;
  }
}

// Buat profil
export async function createProfile(profileData) {
  try {
    console.log("🔍 Creating profile:", profileData);

    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "POST",
      headers,
      body: JSON.stringify(profileData),
    });

    const result = await handleResponse(response);
    console.log("✅ Profile created:", result);

    return result;
  } catch (error) {
    console.error("❌ Create profile error:", error);
    throw error;
  }
}

// Ambil profil
export async function getProfile() {
  try {
    console.log("🔍 Fetching profile...");

    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers,
    });

    const result = await handleResponse(response);
    console.log("✅ Profile fetched:", result);

    return result;
  } catch (error) {
    console.error("❌ Get profile error:", error);
    throw error;
  }
}

// Update profil
export async function updateProfile(profileData) {
  try {
    console.log("🔍 Updating profile:", profileData);

    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers,
      body: JSON.stringify(profileData),
    });

    const result = await handleResponse(response);
    console.log("✅ Profile updated:", result);

    return result;
  } catch (error) {
    console.error("❌ Update profile error:", error);
    throw error;
  }
}

// Ambil rekomendasi
export async function getRecommendation() {
  try {
    console.log("🔍 Fetching recommendation...");

    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/profile/recommendation`, {
      method: "GET",
      headers,
    });

    const result = await handleResponse(response);
    console.log("✅ Recommendation fetched:", result);

    return result.data;
  } catch (error) {
    console.error("❌ Get recommendation error:", error);
    throw error;
  }
}

// Fungsi untuk cek status token
export function isTokenValid() {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  const payload = decodeToken(token);
  if (!payload) {
    localStorage.removeItem("token");
    return false;
  }

  const currentTime = Date.now() / 1000;

  // Cek apakah token expired
  if (payload.exp && payload.exp < currentTime) {
    console.log("❌ Token expired");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    return false;
  }

  // Cek apakah ada user ID
  if (!payload.userId && !payload.id && !payload.user_id) {
    console.log("❌ Token tidak mengandung User ID");
    localStorage.removeItem("token");
    return false;
  }

  return true;
}

// Fungsi logout
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("userId");
  console.log("✅ User logged out");

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// Fungsi untuk mendapatkan user info dari token
export function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  return {
    userId: payload.userId || payload.id || payload.user_id,
    email: payload.email,
    exp: payload.exp,
  };
}

// Request lupa password (mengirim email atau identifier ke server)
export async function forgotPassword(email) {
  try {
    console.log("🔍 Request forgot password for:", email);

    const response = await fetch(`${API_BASE_URL}/user/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await handleResponse(response);
    console.log("✅ Forgot password response:", data);

    return data;
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    throw error;
  }
}

// Reset password menggunakan token reset dan password baru
export async function resetPassword(token, newPassword) {
  try {
    console.log("🔍 Resetting password with token");

    const response = await fetch(`${API_BASE_URL}/user/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await handleResponse(response);
    console.log("✅ Reset password response:", data);

    return data;
  } catch (error) {
    console.error("❌ Reset password error:", error);
    throw error;
  }
}

// menu kategori
export async function getFoodsByCategory(category) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token tidak ditemukan, silakan login ulang');
  }

  const categoryFormatted = category.charAt(0).toUpperCase() + category.slice(1);

  const response = await fetch(`${API_BASE_URL}/foods/category/${categoryFormatted}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      // 'Content-Type': 'application/json', // opsional, tergantung API
    },
  });

  console.log("📦 Token yang digunakan:", token);
  console.log('🛠️ getFoodsByCategory status:', response.status);
  console.log("📦 Kategori yang dikirim:", categoryFormatted);

  if (!response.ok) throw new Error('Unauthorized or failed to fetch category');
  const data = await response.json();
  console.log("📂 Target kategori:", data.target);
  
  return data.data;
}

export async function searchFoods(query) {
  const response = await fetch(`${API_BASE_URL}/foods/search?q=${encodeURIComponent(query)}`);
  const result = await response.json();
  return Array.isArray(result.data) ? result.data : [];
}

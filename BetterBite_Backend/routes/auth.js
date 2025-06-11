const AuthController = require("../controllers/authController");
const { validateRegistration, validateLogin } = require("../middleware/validation");

module.exports = [
  {
    method: "POST",
    path: "/auth/register",
    handler: AuthController.register,
    options: {
      auth: false, // Tidak memerlukan autentikasi JWT
      pre: [{ method: validateRegistration, assign: "payload" }],
    },
  },
  {
    method: "POST",
    path: "/auth/login",
    handler: AuthController.login,
    options: {
      auth: false, // Tidak memerlukan autentikasi JWT
      pre: [{ method: validateLogin, assign: "payload" }],
    },
  },
  {
    // Rute ini berfungsi untuk memulai proses login Google dan menangani callback dari Google.
    method: "GET",
    path: "/auth/google",
    options: {
      auth: {
        strategy: "google",
        mode: "try", // 'try' memungkinkan handler rute untuk dieksekusi bahkan jika autentikasi gagal pada awalnya
      },
      handler: (request, h) => {
        // Jika isAuthenticated adalah true, itu berarti Google telah berhasil mengautentikasi pengguna
        // dan mengarahkan kembali ke URL callback ini.
        if (request.auth.isAuthenticated) {
          return AuthController.googleAuth(request, h); // Proses kredensial Google
        } else {
          // Jika tidak terautentikasi, ini bisa jadi hit awal ke /auth/google,
          // atau terjadi error selama autentikasi Google.
          // Bell biasanya menangani redirect awal ke Google secara otomatis.
          // Untuk error, Bell akan sering memberikan detail di request.auth.error.
          console.error("Google login failed or not authenticated:", request.auth.error);
          // Redirect ke halaman login frontend dengan pesan error.
          return h.redirect(`http://localhost:3000/login?error=${encodeURIComponent(request.auth.error ? request.auth.error.message : 'Login Google dibatalkan atau gagal')}`);
        }
      },
    },
  },
];
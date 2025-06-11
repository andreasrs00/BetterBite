const User = require("../models/User");
const Profile = require("../models/Profile");
const { hashPassword, comparePassword } = require("../utils/hash");
const { successResponse, errorResponse } = require("../utils/response");
const crypto = require("crypto");
const sendResetEmail = require("../utils/email"); // Gunakan Nodemailer

// Utility untuk generate token
function generateRandomToken() {
  return crypto.randomBytes(32).toString("hex");
}

class UserController {
  static async getCurrentUser(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      console.log("🔍 Getting user with ID:", userId);

      // Cari user dari tabel users
      const user = await User.findById(userId);

      if (!user) {
        console.error("❌ User not found with ID:", userId);
        return h.response(errorResponse("User tidak ditemukan", 404)).code(404);
      }

      // Cari data profil dari tabel profiles
      const profiles = await Profile.findByUserId(userId);

      const userData = {
        id: user.user_id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
        nama: profiles?.nama || null,
        usia: profiles?.usia || null,
        berat: profiles?.berat || null,
        tinggi: profiles?.tinggi || null,
      };

      return h
        .response(successResponse(userData, "Data user berhasil diambil"))
        .code(200);
    } catch (error) {
      console.error("❌ Error in getCurrentUser:", error);
      return h.response(errorResponse("Internal server error")).code(500);
    }
  }

  static async forgotPassword(request, h) {
    try {
      const { email } = request.payload;
      console.log("🔍 Forgot password request for:", email);

      if (!email) {
        return h.response(errorResponse("Email harus diisi", 400)).code(400);
      }

      const user = await User.findByEmail(email);
      if (!user) {
        console.log("❌ Email not found:", email);
        return h
          .response(errorResponse("Email tidak ditemukan", 404))
          .code(404);
      }

      const resetToken = generateRandomToken();
      const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 jam dari sekarang

      // PERBAIKAN DI SINI: Mengubah updateResetToken menjadi storeResetToken
      await User.storeResetToken(user.user_id, resetToken, expiryTime);

      // Pastikan sendResetEmail menerima link lengkap jika Anda ingin di frontend
      // Jika sendResetEmail hanya menerima token, dan link dibuat di util:
      // const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
      // await sendResetEmail(email, resetLink);
      // Tapi jika sendResetEmail Anda hanya butuh token dan membentuk link sendiri, kode Anda sudah benar.
      // Berdasarkan utils/email.js yang Anda berikan, parameter kedua adalah 'token'
      await sendResetEmail(email, resetToken); // Kirim email menggunakan Nodemailer

      return h
        .response(
          successResponse(
            null,
            "Link reset password sudah dikirim ke email Anda"
          )
        )
        .code(200);
    } catch (error) {
      console.error("❌ Error in forgotPassword:", error);
      return h.response(errorResponse("Internal server error")).code(500);
    }
  }

  static async resetPassword(request, h) {
    try {
      const { token, newPassword } = request.payload;

      if (!token || !newPassword) {
        return h
          .response(errorResponse("Token dan password baru harus diisi", 400))
          .code(400);
      }

      if (newPassword.length < 6) {
        return h
          .response(errorResponse("Password minimal 6 karakter", 400))
          .code(400);
      }

      const user = await User.findByResetToken(token);
      if (!user) {
        return h
          .response(errorResponse("Token tidak valid atau sudah expired", 400))
          .code(400);
      }

      const now = new Date();
      if (
        user.reset_token_expires &&
        new Date(user.reset_token_expires) < now
      ) {
        return h
          .response(
            errorResponse(
              "Token sudah expired. Silakan request reset password lagi.",
              400
            )
          )
          .code(400);
      }

      const hashedNewPassword = await hashPassword(newPassword);

      await User.updatePassword(user.user_id, hashedNewPassword);
      await User.clearResetToken(user.user_id);

      return h
        .response(successResponse(null, "Password berhasil direset"))
        .code(200);
    } catch (error) {
      console.error("❌ Error in resetPassword:", error);
      return h.response(errorResponse("Internal server error")).code(500);
    }
  }

  static async deleteAccount(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      console.log("🔍 Deleting account for user:", userId);

      const user = await User.findById(userId);
      if (!user) {
        return h.response(errorResponse("User tidak ditemukan", 404)).code(404);
      }

      await User.deleteById(userId);

      return h
        .response(successResponse(null, "Akun berhasil dihapus"))
        .code(200);
    } catch (error) {
      console.error("❌ Error in deleteAccount:", error);
      return h.response(errorResponse("Internal server error")).code(500);
    }
  }
}

module.exports = UserController;
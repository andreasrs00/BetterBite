// controllers/profileController.js
const Profile = require("../models/Profile");
const { successResponse, errorResponse } = require("../utils/response");

class ProfileController {
  static async createProfile(request, h) {
    try {
      console.log("CREATE PROFILE - Auth:", request.auth);

      // Ambil userId dari token yang sudah di-decode
      const userId = request.auth.credentials.userId;

      if (!userId) {
        console.error("User ID tidak ditemukan dalam token");
        return h.response(errorResponse("User ID tidak valid", 400)).code(400);
      }

      const { nama, tinggi, berat, usia, foto_profil } = request.payload;

      // Cek apakah profil sudah ada
      const existingProfile = await Profile.findByUserId(userId);
      if (existingProfile) {
        return h
          .response(errorResponse("Profil sudah ada, gunakan update", 400))
          .code(400);
      }

      // Hitung BMI dan target
      const tinggiMeter = tinggi / 100;
      const bmi = berat / (tinggiMeter * tinggiMeter);
      const roundedBMI = parseFloat(bmi.toFixed(2));

      let target = "";
      if (bmi < 18.5) {
        target = "bulking";
      } else if (bmi < 25) {
        target = "maintenance";
      } else {
        target = "diet";
      }

      // Buat profil baru
      const profileData = {
        user_id: userId,
        nama,
        tinggi,
        berat,
        usia,
        bmi: roundedBMI,
        target,
        foto_profil: foto_profil || null,
      };

      const profileId = await Profile.create(profileData);
      const createdProfile = await Profile.findById(profileId);

      console.log("Profile created successfully:", createdProfile);

      return h
        .response(successResponse(createdProfile, "Profil berhasil dibuat"))
        .code(201);
    } catch (error) {
      console.error("Create profile error:", error);
      return h.response(errorResponse("Gagal membuat profil")).code(500);
    }
  }

  static async getProfile(request, h) {
    try {
      console.log("GET PROFILE - Auth:", request.auth);

      // Ambil userId dari token yang sudah di-decode
      const userId = request.auth.credentials.userId;

      if (!userId) {
        console.error("User ID tidak ditemukan dalam token");
        return h.response(errorResponse("User ID tidak valid", 400)).code(400);
      }

      console.log("Looking for profile with userId:", userId);

      const profile = await Profile.findByUserId(userId);

      if (!profile) {
        console.log("Profile tidak ditemukan untuk user:", userId);
        return h
          .response(errorResponse("Profil tidak ditemukan", 404))
          .code(404);
      }

      console.log("Profile found:", profile);

      return h
        .response(successResponse(profile, "Profil berhasil diambil"))
        .code(200);
    } catch (error) {
      console.error("Get profile error:", error);
      return h.response(errorResponse("Gagal mengambil profil")).code(500);
    }
  }

  static async updateProfile(request, h) {
    try {
      console.log("UPDATE PROFILE - Auth:", request.auth);

      // Ambil userId dari token yang sudah di-decode
      const userId = request.auth.credentials.userId;

      if (!userId) {
        console.error("User ID tidak ditemukan dalam token");
        return h.response(errorResponse("User ID tidak valid", 400)).code(400);
      }

      const { nama, tinggi, berat, usia, foto_profil } = request.payload;

      // Cek apakah profil ada
      const existingProfile = await Profile.findByUserId(userId);
      if (!existingProfile) {
        return h
          .response(errorResponse("Profil tidak ditemukan", 404))
          .code(404);
      }

      // Hitung BMI dan target
      const tinggiMeter = tinggi / 100;
      const bmi = berat / (tinggiMeter * tinggiMeter);
      const roundedBMI = parseFloat(bmi.toFixed(2));

      let target = "";
      if (bmi < 18.5) {
        target = "bulking";
      } else if (bmi < 25) {
        target = "maintenance";
      } else {
        target = "diet";
      }

      // Update profil
      const updateData = {
        nama,
        tinggi,
        berat,
        usia,
        bmi: roundedBMI,
        target,
        foto_profil: foto_profil || existingProfile.foto_profil,
      };

      await Profile.updateByUserId(userId, updateData);
      const updatedProfile = await Profile.findByUserId(userId);

      console.log("Profile updated successfully:", updatedProfile);

      return h
        .response(successResponse(updatedProfile, "Profil berhasil diperbarui"))
        .code(200);
    } catch (error) {
      console.error("Update profile error:", error);
      return h.response(errorResponse("Gagal memperbarui profil")).code(500);
    }
  }

  static async getRecommendation(request, h) {
    try {
      console.log("GET RECOMMENDATION - Auth:", request.auth);

      // Ambil userId dari token yang sudah di-decode
      const userId = request.auth.credentials.userId;

      if (!userId) {
        console.error("User ID tidak ditemukan dalam token");
        return h.response(errorResponse("User ID tidak valid", 400)).code(400);
      }

      const profile = await Profile.findByUserId(userId);

      if (!profile) {
        return h
          .response(errorResponse("Profil tidak ditemukan", 404))
          .code(404);
      }

      // Hitung BMI dan beri rekomendasi
      const tinggiMeter = profile.tinggi / 100;
      const bmi = profile.berat / (tinggiMeter * tinggiMeter);
      const roundedBMI = parseFloat(bmi.toFixed(2));

      let recommendation = "";
      let target = "";

      if (bmi < 18.5) {
        recommendation = "Underweight - Disarankan untuk menambah berat badan";
        target = "bulking";
      } else if (bmi < 25) {
        recommendation = "Normal - Pertahankan pola hidup sehat";
        target = "maintenance";
      } else if (bmi < 30) {
        recommendation = "Overweight - Disarankan untuk menurunkan berat badan";
        target = "diet";
      } else {
        recommendation =
          "Obese - Konsultasi dengan dokter untuk program penurunan berat badan";
        target = "diet";
      }

      const result = {
        profile,
        bmi: roundedBMI,
        recommendation,
        target,
      };

      return h
        .response(successResponse(result, "Rekomendasi berhasil dibuat"))
        .code(200);
    } catch (error) {
      console.error("Get recommendation error:", error);
      return h.response(errorResponse("Gagal membuat rekomendasi")).code(500);
    }
  }
}

module.exports = ProfileController;

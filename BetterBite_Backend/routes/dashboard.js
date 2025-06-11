const Profile = require("../models/Profile");
const foodService = require("../controllers/foodController");
const { successResponse, errorResponse } = require("../utils/response");
const authMiddleware = require("../middleware/auth");

module.exports = [
  {
    method: "GET",
    path: "/dashboard",
    options: {
      pre: [{ method: authMiddleware }],
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.userId;
        const profile = await Profile.findByUserId(userId);

        if (!profile) {
          return h
            .response({
              status: "fail",
              message: "Profil belum diisi",
            })
            .code(404);
        }

        const target = profile.target.toLowerCase();
        const recommendedFoods = await foodService.getFoodsByCategory(target);

        // console.log("User Profile:", profile);
        // console.log("Target:", profile.target);
        // console.log("Recommended foods:", recommendedFoods);

        return h
          .response({
            status: "success",
            message: "Dashboard berhasil dimuat",
            data: {
              berat: profile.berat,
              tinggi: profile.tinggi,
              bmi: profile.bmi,
              target: profile.target,
              recommendedFoods,
            },
          })
          .code(200);
      } catch (error) {
        console.error("Dashboard error:", error);
        return h
          .response({
            status: "error",
            message: "Gagal memuat dashboard",
          })
          .code(500);
      }
    },
  },
];

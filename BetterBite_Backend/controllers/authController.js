const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/response");

class AuthController {
  static async register(request, h) {
    try {
      console.log("DEBUG: Masuk register");

      const { email, password } = request.payload;

      if (!email || !password) {
        return h
          .response(errorResponse("Email dan password wajib diisi", 400))
          .code(400);
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return h
          .response(errorResponse("Email sudah terdaftar", 400))
          .code(400);
      }

      const hashedPassword = await hashPassword(password);
      const token = generateToken({ email }); 
      const userId = await User.create({
        email,
        password: hashedPassword,
        token,
      });

      const newToken = generateToken({ userId, email });
      await User.updateToken(userId, newToken);


      return h
        .response(
          successResponse({ userId, email, token: newToken }, "Registrasi berhasil")
        )
        .code(201);
    } catch (error) {
      console.error("Register Error:", error); 
      return h.response(errorResponse("Terjadi kesalahan di server")).code(500);
    }
  }

  static async login(request, h) {
    try {
      console.log("DEBUG: Masuk login");

      const { email, password } = request.payload;

      const user = await User.findByEmail(email);
      if (!user) {
        return h
          .response(errorResponse("Email atau password salah", 400))
          .code(400);
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return h
          .response(errorResponse("Email atau password salah", 400))
          .code(400);
      }

      const token = generateToken({ userId: user.user_id, email: user.email });
      await User.updateToken(user.user_id, token);

      await User.updateLastLogin(user.user_id);

      return h
        .response(
          successResponse(
            { token, user: { id: user.user_id, email: user.email } },
            "Login berhasil"
          )
        )
        .code(200);
    } catch (error) {
      console.error("Login Error:", error);
      return h.response(errorResponse("Terjadi kesalahan di server")).code(500);
    }
  }

    static async googleLogin(request, h) {
       if (!request.auth.isAuthenticated) {
      console.error("Google login initiation error:", request.auth.error);
      return h.redirect(`http://localhost:3000/login?error=${encodeURIComponent('Gagal memulai login Google')}`);
    }
        return `Redirecting to Google...`;
  }


    static async googleAuth(request, h) {
    try {
      if (!request.auth.isAuthenticated) {
        console.error("Google Auth: Not authenticated");
        return h.redirect(`http://localhost:3000/login?error=${encodeURIComponent('Autentikasi Google gagal')}`);
      }

      const { profile } = request.auth.credentials;
      const googleId = profile.id;
      const email = profile.email;
      const name = profile.displayName || profile.name.first + " " + profile.name.last;

      if (!googleId || !email) {
        console.error("Google Auth Error: Profil Google tidak lengkap", profile);
        return h.redirect(`http://localhost:3000/login?error=${encodeURIComponent('Profil Google tidak lengkap (ID atau email tidak ditemukan)')}`);
      }

      let user = await User.findByGoogleId(googleId);
      let isNewUser = false;
      let userId;

      if (!user) {
          const existingUser = await User.findByEmail(email);

        if (existingUser) {
          await User.updateGoogleId(existingUser.user_id, googleId);
          user = existingUser;
          userId = existingUser.user_id;
          console.log(`User existing with email ${email} linked to Google ID.`);
        } else {
          userId = await User.createFromGoogle({ googleId, email, name });
          isNewUser = true;
          console.log(`New user created from Google with ID: ${userId}`);
        }
      } else {
        userId = user.user_id;
        console.log(`User found with Google ID: ${googleId}`);
      }

      const token = generateToken({ userId, email });
      await User.updateToken(userId, token); 
      await User.updateLastLogin(userId); 

      console.log(`Redirecting to frontend with token for user ID: ${userId}`);
      return h.redirect(
        `http://localhost:3000/google-success?token=${token}&email=${encodeURIComponent(
          email
        )}&userId=${userId}&isNewUser=${isNewUser}`
      );
    } catch (error) {
      console.error("Google Auth Error:", error);
      return h.redirect(`http://localhost:3000/login?error=${encodeURIComponent('Terjadi kesalahan saat login Google')}`);
    }
  }
}

module.exports = AuthController;
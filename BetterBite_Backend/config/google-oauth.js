require("dotenv").config();

const googleOAuthConfig = {
  provider: "google",
  password:
    process.env.BELL_PASSWORD ||
    "cookie_encryption_password_secure_change_this", 
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  scope: ["profile", "email"],
  providerParams: {
    redirect_uri:
      process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/auth/google", 
  },
};

module.exports = googleOAuthConfig;
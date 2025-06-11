// models/User.js - UPDATED VERSION for Google
const db = require("../config/database");

class User {
  static async create(userData) {
    const { email, password, token } = userData;
    const [result] = await db.execute(
      "INSERT INTO users (email, password, token, created_at) VALUES (?, ?, ?, NOW())",
      [email, password, token]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  static async findById(user_id) {
    const [rows] = await db.execute("SELECT * FROM users WHERE user_id = ?", [
      user_id,
    ]);
    return rows[0];
  }

  static async findByToken(token) {
    const [rows] = await db.execute("SELECT * FROM users WHERE token = ?", [
      token,
    ]);
    return rows[0];
  }

  static async updateToken(user_id, token) {
    await db.execute(
      "UPDATE users SET token = ?, updated_at = NOW() WHERE user_id = ?",
      [token, user_id]
    );
  }

  // NEW: Find user by reset token
  static async findByResetToken(resetToken) {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE reset_token = ?",
      [resetToken]
    );
    return rows[0];
  }

  // NEW: Store reset token
  static async storeResetToken(user_id, resetToken, expiryTime) {
    await db.execute(
      "UPDATE users SET reset_token = ?, reset_token_expires = ?, updated_at = NOW() WHERE user_id = ?",
      [resetToken, expiryTime, user_id]
    );
  }

  // NEW: Clear reset token
  static async clearResetToken(user_id) {
    await db.execute(
      "UPDATE users SET reset_token = NULL, reset_token_expires = NULL, updated_at = NOW() WHERE user_id = ?",
      [user_id]
    );
  }

  static async updatePassword(user_id, hashedPassword) {
    await db.execute(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE user_id = ?",
      [hashedPassword, user_id]
    );
  }

  static async deleteById(user_id) {
    await db.execute("DELETE FROM users WHERE user_id = ?", [user_id]);
  }

  // NEW: Find user by Google ID
  static async findByGoogleId(googleId) {
    const [rows] = await db.execute("SELECT * FROM users WHERE google_id = ?", [
      googleId,
    ]);
    return rows[0];
  }

  // NEW: Create user from Google data
  static async createFromGoogle(googleData) {
    const { googleId, email, name } = googleData;
    const [result] = await db.execute(
      "INSERT INTO users (google_id, email, name, created_at) VALUES (?, ?, ?, NOW())",
      [googleId, email, name]
    );
    return result.insertId;
  }

  // NEW: Update existing user with Google ID
  static async updateGoogleId(user_id, googleId) {
    await db.execute(
      "UPDATE users SET google_id = ?, updated_at = NOW() WHERE user_id = ?",
      [googleId, user_id]
    );
  }

  // NEW: Update last_login
  static async updateLastLogin(user_id) {
    await db.execute(
      "UPDATE users SET last_login = NOW() WHERE user_id = ?",
      [user_id]
    );
  }

  static async getAllUsers() {
    const [rows] = await db.execute("SELECT * FROM users");
    return rows;
  }
}

module.exports = User;
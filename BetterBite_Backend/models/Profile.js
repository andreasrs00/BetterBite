const db = require("../config/database");

const Profile = {
  async findByUserId(userId) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM profiles WHERE user_id = ?",
        [userId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Error finding profile by user ID:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const { user_id, nama, tinggi, berat, usia, bmi, target, foto_profil } =
        data;

      // Validasi data required
      if (!user_id || !nama || !tinggi || !berat || !usia) {
        throw new Error("Data required tidak lengkap");
      }

      const [result] = await db.query(
        `INSERT INTO profiles 
         (user_id, nama, tinggi, berat, usia, bmi, target, foto_profil, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [user_id, nama, tinggi, berat, usia, bmi, target, foto_profil]
      );

      return result.insertId;
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  },

  async updateByUserId(userId, data) {
    try {
      const { nama, tinggi, berat, usia, bmi, target, foto_profil } = data;

      if (!nama || !tinggi || !berat || !usia) {
        throw new Error("Data required tidak lengkap");
      }

      const [result] = await db.query(
        `UPDATE profiles 
        SET nama=?, tinggi=?, berat=?, usia=?, bmi=?, target=?, foto_profil=?, updated_at=NOW() 
        WHERE user_id=?`,
        [nama, tinggi, berat, usia, bmi, target, foto_profil, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating profile by user ID:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const [result] = await db.query("DELETE FROM profiles WHERE id = ?", [
        id,
      ]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw error;
    }
  },

  async findById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM profiles WHERE id = ?", [
        id,
      ]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error finding profile by ID:", error);
      throw error;
    }
  },
};

module.exports = Profile;

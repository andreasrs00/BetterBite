import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { createProfile } from "../api/api";
import "../CSS/FormPersonality.css";

export default function FormPersonality() {
  const { updateUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nama: "",
    tinggi: "",
    berat: "",
    usia: "",
    foto_profil: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, foto_profil: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const { nama, tinggi, berat, usia } = formData;

    if (!nama.trim()) {
      setError("Nama wajib diisi");
      return false;
    }

    if (!tinggi || tinggi <= 0) {
      setError("Tinggi badan harus diisi dengan angka positif");
      return false;
    }

    if (!berat || berat <= 0) {
      setError("Berat badan harus diisi dengan angka positif");
      return false;
    }

    if (!usia || usia <= 0) {
      setError("Usia harus diisi dengan angka positif");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Check token before submitting
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      // Prepare data untuk API
      const dataToSend = {
        nama: formData.nama.trim(),
        tinggi: parseInt(formData.tinggi),
        berat: parseInt(formData.berat),
        usia: parseInt(formData.usia),
        foto_profil: formData.foto_profil,
      };

      console.log("Creating profile with data:", dataToSend);

      const response = await createProfile(dataToSend);
      console.log("Create profile response:", response);

      if (response && response.data) {
        updateUserData(response.data);
        alert("Profil berhasil dibuat! Menuju Dashboard...");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error creating profile:", error);

      // Handle specific errors
      if (error.message.includes("Profil sudah ada")) {
        setError("Profil sudah ada. Silakan perbarui data di menu Data Diri.");
      } else if (
        error.message.includes("Token tidak ditemukan") ||
        error.message.includes("Invalid or expired token")
      ) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(
          "Gagal membuat profil: " + (error.message || "Terjadi kesalahan")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container-flex">
      <div className="image-section">
        <div
          className="photo-box"
          onClick={handleBoxClick}
          style={{ cursor: "pointer" }}
          title="Klik untuk upload foto"
        >
          {formData.foto_profil ? (
            <img
              src={formData.foto_profil}
              alt="Foto Profil"
              className="photo-preview"
            />
          ) : (
            <div className="photo-placeholder">Upload Foto</div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="form-section">
        <h1 className="form-title">Buat Profil Baru</h1>

        {error && (
          <div
            className="alert alert-danger mb-3"
            style={{ color: "red", marginBottom: "10px" }}
          >
            {error}
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label>Nama *</label>
            <input
              name="nama"
              placeholder="Masukkan nama"
              value={formData.nama}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tinggi Badan (cm) *</label>
            <input
              name="tinggi"
              type="number"
              placeholder="Masukkan tinggi badan"
              value={formData.tinggi}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Berat Badan (kg) *</label>
            <input
              name="berat"
              type="number"
              placeholder="Masukkan berat badan"
              value={formData.berat}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Usia (tahun) *</label>
            <input
              name="usia"
              type="number"
              placeholder="Masukkan usia"
              value={formData.usia}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Membuat Profil..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}

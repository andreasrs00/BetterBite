import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../CSS/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCamera } from "react-icons/fa";
import { getProfile, updateProfile } from "../api/api";

export default function DataDiriForm() {
  const { updateUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const hasFetchedProfile = useRef(false);

  const [formData, setFormData] = useState({
    nama: "",
    tinggi: "",
    usia: "",
    berat: "",
    foto_profil: "",
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Prevent double fetch with ref
    if (hasFetchedProfile.current) return;
    hasFetchedProfile.current = true;

    const fetchProfile = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("Fetching profile data for update...");
        const response = await getProfile();
        console.log("Profile response:", response);

        if (response && response.data) {
          const profileData = response.data;
          setFormData({
            nama: profileData.nama || "",
            tinggi: profileData.tinggi || "",
            usia: profileData.usia || "",
            berat: profileData.berat || "",
            foto_profil: profileData.foto_profil || "",
          });

          if (profileData.foto_profil) {
            setProfileImagePreview(profileData.foto_profil);
          }

          // Update user context
          updateUserData(profileData);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error.message);

        // Handle token errors
        if (
          error.message.includes("Token tidak ditemukan") ||
          error.message.includes("Invalid or expired token")
        ) {
          console.log("Token invalid, redirecting to login");
          navigate("/login");
          return;
        }

        // Handle profile not found
        if (error.message.includes("Profil tidak ditemukan")) {
          setError("Profil belum dibuat. Silakan buat profil terlebih dahulu.");
          setTimeout(() => {
            navigate("/form-personality");
          }, 3000);
          return;
        }

        setError("Gagal memuat data profil: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, updateUserData]); // Empty dependency array, controlled by ref

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear messages when user starts typing
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setProfileImagePreview(base64Image);
      setFormData((prev) => ({ ...prev, foto_profil: base64Image }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      // Check token before submitting
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      // Prepare data for API
      const dataToSend = {
        nama: formData.nama.trim(),
        tinggi: parseInt(formData.tinggi),
        berat: parseInt(formData.berat),
        usia: parseInt(formData.usia),
        foto_profil: formData.foto_profil,
      };

      console.log("Updating profile with data:", dataToSend);

      const response = await updateProfile(dataToSend);
      console.log("Update response:", response);

      if (response && response.data) {
        updateUserData(response.data);
        setSuccessMessage("Data berhasil diperbarui!");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      // Handle specific token errors
      if (
        error.message.includes("Token tidak ditemukan") ||
        error.message.includes("Invalid or expired token")
      ) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.message.includes("Profil tidak ditemukan")) {
        setError(
          "Profil tidak ditemukan. Silakan buat profil terlebih dahulu."
        );
        setTimeout(() => navigate("/form-personality"), 3000);
      } else {
        setError(
          "Gagal memperbarui data: " + (error.message || "Terjadi kesalahan")
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="main-container">
        <p className="text-center mt-5">Memuat data profil...</p>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div
        className={`chef-img-container ${
          profileImagePreview ? "has-photo" : "no-photo"
        }`}
        onClick={() => document.getElementById("profilePhotoInput").click()}
        role="button"
        tabIndex={0}
        aria-label="Pilih foto profil"
      >
        {profileImagePreview ? (
          <img src={profileImagePreview} alt="Preview Foto Profil" />
        ) : (
          <div className="placeholder">
            <FaCamera style={{ fontSize: "4rem", marginBottom: "10px" }} />
            <p>Upload Foto Profil</p>
          </div>
        )}
        <input
          type="file"
          id="profilePhotoInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleProfileImageChange}
        />
      </div>

      <div className="form-container">
        <h2 className="form-title">Data Diri</h2>

        {/* Error Message */}
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success mb-3">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nama">NAMA *</label>
              <input
                type="text"
                className="form-control custom-input"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="tinggi">TINGGI BADAN (cm) *</label>
              <input
                type="number"
                className="form-control custom-input"
                id="tinggi"
                name="tinggi"
                value={formData.tinggi}
                onChange={handleChange}
                placeholder="Masukkan tinggi badan"
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="usia">USIA (tahun) *</label>
              <input
                type="number"
                className="form-control custom-input"
                id="usia"
                name="usia"
                value={formData.usia}
                onChange={handleChange}
                placeholder="Masukkan usia"
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="berat">BERAT BADAN (kg) *</label>
              <input
                type="number"
                className="form-control custom-input"
                id="berat"
                name="berat"
                value={formData.berat}
                onChange={handleChange}
                placeholder="Masukkan berat badan"
                min="1"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}

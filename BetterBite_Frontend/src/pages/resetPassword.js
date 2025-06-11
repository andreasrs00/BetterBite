// src/ResetPassword.js - UPDATED VERSION
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/api"; // Import dari api.js
import "bootstrap/dist/css/bootstrap.min.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // ambil token dari query param

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cek apakah ada token saat component mount
  useEffect(() => {
    if (!token) {
      setError("Token reset password tidak ditemukan dalam URL");
    } else {
      console.log("🔍 Reset token found:", token.substring(0, 10) + "...");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validasi input
    if (password.length < 6) {
      setError("Password harus minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (!token) {
      setError("Token reset password tidak valid");
      return;
    }

    setLoading(true);

    try {
      console.log("🔄 Attempting password reset...");
      const response = await resetPassword(token, password);

      console.log("✅ Password reset successful:", response);
      setMessage(
        "Password berhasil direset! Anda akan diarahkan ke halaman login dalam 3 detik..."
      );

      // Redirect ke login setelah 3 detik
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("❌ Password reset failed:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat mereset password. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Jika tidak ada token, tampilkan error
  if (!token) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Reset Password</h2>
                <div className="alert alert-danger">
                  Token reset password tidak ditemukan. Silakan gunakan link
                  yang dikirim melalui email.
                </div>
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Kembali ke Forgot Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Reset Password</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password baru"
                    required
                    disabled={loading}
                  />
                  <small className="form-text text-muted">
                    Password harus minimal 6 karakter
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Mereset Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <button
                  className="btn btn-link"
                  onClick={() => navigate("/login")}
                  disabled={loading}
                >
                  Kembali ke Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

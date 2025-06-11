// src/ForgotPassword.js - UPDATED VERSION
import React, { useState } from "react";
import { forgotPassword } from "../api/api"; // Import dari api.js
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    // Validasi email
    if (!email || !email.includes("@")) {
      setError("Mohon masukkan email yang valid");
      setLoading(false);
      return;
    }

    try {
      console.log("🔍 Submitting forgot password for:", email);

      const response = await forgotPassword(email);

      console.log("✅ Forgot password response:", response);

      setMessage(
        response.message || "Link reset password telah dikirim ke email Anda."
      );
      setError(null);

      // Clear form
      setEmail("");
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h4 className="text-center mb-4">Lupa Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Alamat Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              required
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {message && (
            <div className="alert alert-success">
              <strong>✅ Berhasil!</strong>
              <br />
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <strong>❌ Error!</strong>
              <br />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Mengirim...
              </>
            ) : (
              "Kirim Link Reset"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none">
            ← Kembali ke Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

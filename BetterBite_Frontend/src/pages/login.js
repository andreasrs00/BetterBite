import { useState } from "react";
import {
  Col,
  Container,
  Row,
  Button,
  Form,
  Card,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api"; // Import fungsi login dari api.js
import "../CSS/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Untuk redirect

  const fetchUserProfile = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return null;

      const result = await res.json();
      return result.data;
    } catch (err) {
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return setErrorMessage("Format email tidak valid.");
    }

    if (password.length < 6) {
      return setErrorMessage("Password minimal 6 karakter.");
    }

    try {
      const response = await loginUser(email, password);
      setErrorMessage("");

      // Response biasanya ada di response.data (sesuai backend)
      // Simpan token ke localStorage (pastikan nama property-nya sesuai dengan API kamu)
      localStorage.setItem("token", response.token || response.data.token);

      // Setelah token disimpan, fetch profil untuk mengecek kelengkapannya
      const token = response.token || response.data.token;
      const profiles = await fetchUserProfile(token);

      const isProfileComplete =
        profiles.nama && profiles.usia && profiles.berat && profiles.tinggi;

      if (isProfileComplete) {
        navigate("/dashboard");
      } else {
        navigate("/form-personality");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google"; // Ganti dengan URL login Google backend kamu
  };

  return (
    <div className="auth-container">
      <Container className="py-5">
        <Row className="justify-content-center py-lg-5">
          <Col md={6} lg={4}>
            <Card className="auth-card">
              <div className="text-center">
                <h2 className="auth-title">Login</h2>
              </div>

              {errorMessage && (
                <Alert variant="danger" className="text-center">
                  {errorMessage}
                </Alert>
              )}

              <Form className="text-start mb-3" onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label className="auth-form-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="username@gmail.com"
                    className="auth-form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2" controlId="loginPassword">
                  <Form.Label className="auth-form-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    className="auth-form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-end mb-3">
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 auth-btn"
                >
                  Sign In
                </Button>
              </Form>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <div className="google-logo-wrapper">
                <img
                  src="/icon/google.png"
                  alt="Google"
                  className="google-logo"
                  onClick={handleGoogleLogin}
                />
              </div>

              <div className="text-center">
                <p className="auth-text">
                  Belum punya akun?{" "}
                  <Link to="/register" className="auth-link">
                    Daftar disini
                  </Link>
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;

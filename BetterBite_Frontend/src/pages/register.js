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
import { registerUser } from "../api/api"; // pastikan path-nya sesuai
import "../CSS/Auth.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return setErrorMessage("Format email tidak valid.");
    }

    if (password.length < 6) {
      return setErrorMessage("Password minimal 6 karakter.");
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await registerUser(email, password);

      setSuccessMessage("Registrasi berhasil. Silakan login.");
      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || "Terjadi kesalahan saat registrasi.");
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:5000/auth/google"; // URL ke backend
  };

  return (
    <div className="auth-container">
      <Container className="py-5">
        <Row className="justify-content-center py-lg-5">
          <Col md={6} lg={4}>
            <Card className="auth-card">
              <div className="text-center">
                <h2 className="auth-title">Register</h2>
              </div>

              {errorMessage && (
                <Alert variant="danger" className="text-center">
                  {errorMessage}
                </Alert>
              )}

              {successMessage && (
                <Alert variant="success" className="text-center">
                  {successMessage}
                </Alert>
              )}

              <Form className="text-start mb-3" onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="registerEmail">
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

                <Form.Group className="mb-3" controlId="registerPassword">
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

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 auth-btn"
                >
                  Sign Up
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
                  onClick={handleGoogleRegister}
                />
              </div>

              <div className="text-center">
                <p className="auth-text">
                  Sudah punya akun?{" "}
                  <Link to="/login" className="auth-link">
                    Login disini
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

export default Register;

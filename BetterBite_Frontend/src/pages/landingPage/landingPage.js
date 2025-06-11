import React from "react";
import {
  Container,
  Navbar,
  Nav,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import "../../CSS/main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faUtensils,
  faWeight,
  faBalanceScale,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Testimonial from "../landingPage/testimoni";
import Footer from "../../components/footer";

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar expand="lg" className="bg-transparent py-3">
        <Container>
          <Navbar.Brand className="text-brand">
            <img
              src="/img/BetterBite.png"
              alt="BetterBite"
              className="navbar-brand-image"
            />
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button className="login-btn px-4" as={Link} to="/login">
              Login
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <section className="hero-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="hero-title">
                Yuk, Kenali Nutrisi <br /> Makananmu dengan <br /> Mudah Bersama{" "}
                <br /> <span>Better Bite!</span>
              </h1>
              <p className="hero-subtitle">
                BetterBite membantu kamu membuat keputusan <br /> sehat setiap
                hari. Deteksi makanan dengan foto, dapatkan informasi gizi
                secara instan.
              </p>
              <Button
                variant="dark"
                className="rounded-pill px-4 py-2 mt-2"
                as={Link}
                to="/login"
              >
                Coba Sekarang <span className="ms-2">➔</span>
              </Button>
            </Col>

            <Col
              md={6}
              className="mt-4 mt-md-0 d-flex justify-content-center align-items-center"
            >
              <div className="hero-image-wrapper">
                <img
                  src="/img/image-27.png"
                  alt="Dada Ayam"
                  className="hero-image"
                />
                <Card className="info-card">
                  <Card.Body className="p-2">
                    <Card.Title className="info-title">Dada Ayam</Card.Title>
                    <Card.Text className="info-text">
                      23 gram protein, 2 gram lemak, Kalium 330 mg, Fosfor 215
                      mg
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="features-section py-5">
        <Container>
          <Row className="d-flex flex-column align-items-center">
            <Col md={10} className="mt-5 mb-4">
              <Card className="shadow-sm rounded-3 features-card d-flex flex-row">
                <Card.Body className="p-4">
                  <h5 className="fw-bold">
                    Butuh saran makanan karena <br />{" "}
                    <span style={{ color: "#4CA1AF" }}>Keliatan Gendut?</span>
                  </h5>
                  <p className="mt-2 mb-0">
                    BetterBite siap bantu kamu memilih makanan yang sehat,
                    sesuai kebutuhan tubuhmu.
                  </p>
                </Card.Body>
                <div className="features-image-wrapper">
                  <img
                    src="/img/image-2.png"
                    className="img-fluid"
                    alt="Saran Makanan"
                  />
                </div>
              </Card>
            </Col>
            <Col md={10} className="mt-5">
              <Card className="shadow-sm rounded-3 features-card">
                <div className="d-flex align-items-center">
                  <div className="features-image-wrapper me-3">
                    <img
                      src="/img/image.png"
                      className="img-fluid"
                      alt="Pola Seimbang"
                    />
                  </div>
                  <Card.Body>
                    <h5 className="fw-bold">
                      Bingung mengatur pola makan <br />{" "}
                      <span style={{ color: "#4CA1AF" }}>Yang Seimbang?</span>
                    </h5>
                    <p className="mt-2 mb-0">
                      BetterBite membantu merancang pola makan bermutrisi dengan
                      porsi tepat sesuai profil kesehatan pribadi Anda.
                    </p>
                  </Card.Body>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Fitur */}
      <section className="fitur-section py-5">
        <Container>
          <h2 className="fitur-title text-center fw-bold">Fitur</h2>
          <Row className="text-center fw-bold">
            <Col md={3}>
              <div className="icon-card mx-auto mb-3">
                <FontAwesomeIcon icon={faCamera} size="2x" />
              </div>
              <p>Upload Foto Makanan Anda Untuk Melihat Kandungan Nutrisinya</p>
            </Col>
            <Col md={3}>
              <div className="icon-card mx-auto mb-3">
                <FontAwesomeIcon icon={faUtensils} size="2x" />
              </div>
              <p>Rekomendasi Diet Menu Untuk Menurunkan Berat Badan</p>
            </Col>
            <Col md={3}>
              <div className="icon-card mx-auto mb-3">
                <FontAwesomeIcon icon={faWeight} size="2x" />
              </div>
              <p>Rekomendasi Bulking Menu Untuk Menaikkan Berat Badan</p>
            </Col>
            <Col md={3}>
              <div className="icon-card mx-auto mb-3">
                <FontAwesomeIcon icon={faBalanceScale} size="2x" />
              </div>
              <p>Rekomendasi Maintenance Menu Untuk berat badan ideal</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <Testimonial />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const testimonials = [
  {
    name: "Robert Fox",
    role: "Customer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Dengan Better Bite, saya jadi lebih sadar kalori dan nutrisi. Berat badan jadi lebih terkontrol!",
    rating: 5,
  },
  {
    name: "Dianne Russell",
    role: "Customer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Menu sehat tidak lagi ribet sejak pakai aplikasi ini. Keren banget!",
    rating: 5,
  },
  {
    name: "Eleanor Pena",
    role: "Customer",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "Aku jadi nggak susah ngatur makan, tinggal upload aja foto makanannya. Simple dan berguna banget.",
    rating: 5,
  },
];

export default function Testimonial() {
  return (
    <section className="py-5" style={{
        background: 'linear-gradient(white, #53C4C0)'
      }}>
      <Container>
        <div className="text-center mb-5">
          <p className="text-primary fw-semibold text-uppercase">Testimoni Klien</p>
          <h2 className="fw-bold">Apa Kata Klien Kami</h2>
        </div>

        <Row>
          {testimonials.map((t, idx) => (
            <Col md={4} key={idx} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="px-4 d-flex flex-column justify-content-between">
                  <div>
                    <FontAwesomeIcon
                      icon={faQuoteLeft}
                      className="text-info mb-3"
                      size="2x"
                    />
                    <Card.Text className="text-muted fst-italic mb-4">
                      "{t.text}"
                    </Card.Text>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex align-items-center">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="rounded-circle"
                        style={{ width: "56px", height: "56px", objectFit: "cover" }}
                      />
                      <div className="text-start ms-3">
                        <div className="fw-semibold">{t.name}</div>
                        <small className="text-muted">{t.role}</small>
                      </div>
                    </div>
                    <div>
                      {[...Array(t.rating)].map((_, i) => (
                        <FontAwesomeIcon
                          icon={faStar}
                          key={i}
                          className="text-warning me-1"
                        />
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
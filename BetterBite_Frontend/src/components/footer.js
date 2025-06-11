import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import '../CSS/main.css';

export default function footer() {
  return (
    <footer className="footer-section py-5">
        <Container>
          <Row>
            <Col md={8} className="mb-4 mb-md-0">
              <h2 className="footer-brand">BetterBite</h2>
              <p className="footer-description">
                Better bite adalah aplikasi yang memudahkan user untuk <br />
                mendapatkan informasi terkait nutrisi makanan yang <br />
                dikonsumsi dengan menampilkan nilai gizi yang terkandung <br />
                dan memberikan informasi rekomendasi makanan yang <br /> cocok sesuai dengan hasil pengukuran BMI.
              </p>
            </Col>
            <Col md={4}>
              <h5 className="mt-5 mb-4">Kontak</h5>
              <ul className="list-unstyled">
                <li><p className="mb-2">Email: betterbite@gmail.com</p></li>
                <li><p className="mb-2">Telp: +62 838 292 676 56</p></li>
                <li><p className="mb-2">Alamat: bandung jl. sudirman</p></li>
              </ul>
            </Col>
          </Row>
        </Container>
      </footer>
  )
}

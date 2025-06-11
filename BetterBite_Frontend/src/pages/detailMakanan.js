import { Col, Container, Row, Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../CSS/DetailMakanan.css";

const DetailMakanan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [foodDetails, setFoodDetails] = useState(null);

  useEffect(() => {
    if (location.state && location.state.foodData) {
      setFoodDetails(location.state.foodData);
      console.log("Data makanan diterima di DetailMakanan:", location.state.foodData);
    } else {
      console.warn("Tidak ada data makanan yang diterima. Mengarahkan kembali ke halaman upload.");
      navigate("/foto-makanan");
    }
  }, [location.state, navigate]);

  const handleKembali = () => {
    navigate(-1);
  };

  if (!foodDetails) {
    return (
      <div className="loading-container">
        <p>Memuat detail makanan...</p>
      </div>
    );
  }

  const nutritionData = foodDetails.nutrition_info;
  const nutritionItems = nutritionData && nutritionData !== 'Not found' ? [
    ["Calories", `${nutritionData.calories || 'N/A'} kcal`],
    ["Total Fat", `${nutritionData.total_fat || 'N/A'}g`],
    ["Protein", `${nutritionData.protein || 'N/A'}g`],
    ["Carbohydrate", `${nutritionData.carbohydrate || 'N/A'}g`],
    ["Cholesterol", `${nutritionData.cholesterol || 'N/A'}g`],
    ["Calcium", `${nutritionData.calcium || 'N/A'}mg`],
    ["Fiber", `${nutritionData.fiber || 'N/A'}g`],
    ["Iron", `${nutritionData.iron || 'N/A'}mg`],
    ["Sugar", `${nutritionData.sugar || 'N/A'}g`],
  ] : [];

  return (
    <div className="detail-makanan-wrapper">
      <div className="">
        <Container>
          <Row className="mb-4">
            <Col className="d-flex justify-content-between align-items-center">
              <h2 className="title">Detail Makanan: {foodDetails.food_name}</h2>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="food-image-card">
                <Card.Img
                  variant="top"
                  src={`http://localhost:8000${foodDetails.image_url}`}
                  alt={foodDetails.food_name}
                  className="food-detail-image"
                />
                <Card.Body>
                  <Card.Title className="text-center">
                    {foodDetails.food_name}
                  </Card.Title>
                  <Card.Text className="text-center text-muted">
                    Confidence: {(foodDetails.confidence * 100).toFixed(2)}%
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="nutrition-card">
                <Card.Body>
                  <Card.Title className="card-title">
                    Informasi Nutrisi
                  </Card.Title>
                  <div className="mt-3">
                    {nutritionItems.length > 0 ? (
                      nutritionItems.map(([label, value], i) => (
                        <div key={i} className="nutrition-row">
                          <span>{label}</span>
                          <span className="fw-bold">{value}</span>
                        </div>
                      ))
                    ) : (
                      <p>Informasi nutrisi tidak ditemukan untuk makanan ini.</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="dark"
                      onClick={handleKembali}
                      className="btn-kembali"
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Kembali
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DetailMakanan;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../CSS/foodlist.css';
import { getFoodsByCategory, searchFoods } from '../../api/api';

const Bulking = () => {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPage = 8;

  useEffect(() => {
    fetchBulkingFoods();
  }, []);
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFoods(foods);
      setCurrentPage(1);
    }
  }, [searchTerm, foods]);

  const fetchBulkingFoods = async () => {
    const results = await getFoodsByCategory('Bulking');
    setFoods(results);
    setFilteredFoods(results);
    setCurrentPage(1);
  };

  const handleSearch = async () => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      fetchBulkingFoods();
      return;
    }

    const bulkingFoods = await getFoodsByCategory('Bulking');
    const filtered = bulkingFoods.filter(item =>
      item.food.toLowerCase().includes(query)
    );

    setFilteredFoods(filtered);
    setCurrentPage(1);
  };

   const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const totalPages = Math.ceil(filteredFoods.length / itemsPage);
  const indexOfLastItem = currentPage * itemsPage;
  const indexOfFirstItem = indexOfLastItem - itemsPage;
  const currentItems = filteredFoods.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="foodlist-pagination">
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <div className="foodlist-container">
      <Container fluid className="p-0">
        <Row className="text-center mb-4 mt-3">
          <Col>
            <h1 className="foodlist-title">Bulking Menu</h1>
          </Col>
        </Row>

        {/* Search Bar */}
        <Row className="justify-content-center mb-5">
          <Col xs={12} md={6} lg={4}>
            <InputGroup className="search-bar-input-group">
              <Form.Control
                placeholder="Cari..."
                aria-label="Cari..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button variant="dark" className="search-button" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} /> Cari
              </Button>
            </InputGroup>
          </Col>
        </Row>

        {/* Food Item Cards */}
        <Row className="g-4 food-cards-grid">
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3}>
                <Card className="h-100 shadow-sm food-list-card">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000${item.image}`}
                    alt={item.food}
                    className="food-list-card-img"
                  />
                  <Card.Body className="d-flex align-items-start">
                    <Card.Text className="food-list-card-text">{item.food}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">Tidak ada makanan ditemukan.</p>
          )}
        </Row>

        {/* Pagination */}
        {filteredFoods.length > itemsPage && (
          <Row className="justify-content-center mt-5 mb-4">
            <Col xs="auto">{renderPagination()}</Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Bulking;
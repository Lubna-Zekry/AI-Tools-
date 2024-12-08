import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import "./style.css";
import { useSpring, animated } from "@react-spring/web";

function App() {
  const [articles, setArticles] = useState([""]);
  const [predictedCategories, setPredictedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const titleSpring = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 600 },
  });

  const categoriesSpring = useSpring({
    opacity: predictedCategories.length > 0 ? 1 : 0,
    transform: predictedCategories.length > 0 ? "translateY(0)" : "translateY(20px)",
    from: { opacity: 0, transform: "translateY(20px)" },
    config: { duration: 600 },
  });

  const addArticleField = () => {
    setArticles([...articles, ""]);
  };

  const removeArticleField = (index) => {
    const newArticles = articles.filter((_, i) => i !== index);
    setArticles(newArticles);
  };

  const isValidArticle = (article) => {
    const validTextRegex = /[a-zA-Z0-9]/;
    return validTextRegex.test(article.trim());
  };

  const validateArticles = () => {
    return articles.every((article) => isValidArticle(article));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateArticles()) {
      setError("Please enter valid text for all articles. Some articles are invalid.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        texts: articles,
      });

      setPredictedCategories(response.data.predicted_categories);
    } catch (error) {
      if (error.response) {
        setError("Failed to fetch data from server. Please try again.");
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An error occurred: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setArticles([""]);
    setPredictedCategories([]);
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <Container className="my-5 app-container">
      {/* Animated Title */}
      <animated.h1 style={titleSpring} className="text-center top-text">
        Classification of Articles
      </animated.h1>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          {articles.map((article, index) => (
            <Col key={index} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{`Article ${index + 1}`}</Form.Label>
                <Form.Control
                  as="textarea"
                  value={article}
                  onChange={(e) => {
                    const newArticles = [...articles];
                    newArticles[index] = e.target.value;
                    setArticles(newArticles);
                  }}
                  rows="4"
                  placeholder={`Enter article ${index + 1}`}
                  onKeyDown={handleKeyPress}
                  className="custom-textarea"
                />
                <Button
                  variant="danger"
                  className="mt-2 remove-btn"
                  onClick={() => removeArticleField(index)}
                >
                  Remove
                </Button>
              </Form.Group>
            </Col>
          ))}
        </Row>

        <Button
          variant="primary"
          type="button"
          onClick={addArticleField}
          className="custom-btn"
        >
          Add Article Field
        </Button>

        <Button
          variant="success"
          type="submit"
          className="ms-2 custom-btn"
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
        </Button>

        <Button
          variant="secondary"
          type="button"
          className="ms-2 custom-btn"
          onClick={handleReset}
        >
          Reset
        </Button>
      </Form>

      <animated.div style={categoriesSpring}>
        <h2 className="mt-5 predicted-category-title">Predicted Categories</h2>
        {predictedCategories.length > 0 ? (
          <div className="predicted-category-list">
            {predictedCategories.map((category, index) => (
              <div key={index} className="predicted-category-item">
                <strong>Article {index + 1}: </strong>
                <p>{category}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No results yet</p>
        )}
      </animated.div>
    </Container>
  );
}

export default App;

import React, { useState } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Image,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import "./style.css";
import { useSpring, animated } from "@react-spring/web";

function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const webcamRef = React.useRef(null);

  const titleSpring = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 600 },
  });

  const imageSpring = useSpring({
    opacity: image ? 1 : 0,
    transform: image ? "scale(1)" : "scale(0.9)",
    from: { opacity: 0, transform: "scale(0.9)" },
    config: { duration: 500 },
  });

  const predictionsSpring = useSpring({
    opacity: prediction.length > 0 ? 1 : 0,
    transform: prediction.length > 0 ? "translateY(0)" : "translateY(20px)",
    from: { opacity: 0, transform: "translateY(20px)" },
    config: { duration: 600 },
  });

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => setImage(blob));
  };

  const handleImageSubmit = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:5000/classify_image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPrediction(response.data);
    } catch (err) {
      setError("Error uploading image.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPrediction([]);
    setError(null);
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col md={6} className="mx-auto">
          {/* Animated title */}
          <animated.h1 style={titleSpring} className="text-center mb-5">
            Image Classification
          </animated.h1>

          <div className="toggle-button-group-container">
            <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
              <ToggleButton
                variant="outline-primary"
                value={1}
                onClick={() => setUseCamera(false)}
                className="toggle-btn"
              >
                Upload Image
              </ToggleButton>
              <ToggleButton
                variant="outline-primary"
                value={2}
                onClick={() => setUseCamera(true)}
                className="toggle-btn"
              >
                Use Camera
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          {useCamera ? (
            <div className="text-center">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
              />
              <Button variant="primary" onClick={captureImage} className="mt-3">
                Capture
              </Button>
            </div>
          ) : (
            <input
              type="file"
              className="form-control custom-input mb-4"
              onChange={handleImageChange}
            />
          )}

          {image && (
            <animated.div style={imageSpring} className="mt-3 text-center mb-3">
              <Image
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt="Uploaded"
                className="uploaded-image"
              />
            </animated.div>
          )}

          <div className="d-flex justify-content-between mt-3">
            <Button
              variant="primary"
              onClick={handleImageSubmit}
              disabled={loading}
              className="w-48"
            >
              {loading ? "Classifying..." : "Classify Image"}
            </Button>
            <Button variant="secondary" onClick={handleReset} className="w-48">
              Reset
            </Button>
          </div>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          <animated.div style={predictionsSpring}>
            {prediction.length > 0 && (
              <div className="mt-4">
                <h3>Predictions:</h3>
                <ul className="predictions-list">
                  {prediction.map((item, index) => (
                    <li key={index} className="prediction-item">
                      <strong>{item.label}:</strong> {item.description} -{" "}
                      {item.probability.toFixed(4) * 100}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </animated.div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;

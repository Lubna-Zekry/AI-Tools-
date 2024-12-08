import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Spinner, Alert } from "react-bootstrap";
import { useSpring, animated } from "@react-spring/web";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [polarity, setPolarity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSentiment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setSentiment(data.sentiment);
      setPolarity(data.polarity);
    } catch (err) {
      setError("No response from server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      analyzeSentiment();
    }
  };

  const reset = () => {
    setText("");
    setSentiment("");
    setPolarity(null);
    setError("");
  };

  // Animation for title
  const titleSpring = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 600 },
  });

  // Animation for chart
  const chartSpring = useSpring({
    opacity: polarity !== null ? 1 : 0,
    transform: polarity !== null ? "scale(1)" : "scale(0.9)",
    from: { opacity: 0, transform: "scale(0.9)" },
    config: { duration: 500 },
  });

  const chartData = {
    labels: ["Polarity"],
    datasets: [
      {
        label: "Sentiment Polarity",
        data: [polarity],
        backgroundColor: ["rgba(75, 192, 192, 0.6)"],
      },
    ],
  };

  return (
    <div className="container mt-5 app-container">
      {/* Animated title */}
      <animated.h1 style={titleSpring} className="text-center top-text">
        Sentiment Analysis
      </animated.h1>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      <div className="form-group">
        <textarea
          className="form-control custom-textarea"
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your text here..."
        />
      </div>
      <div className="text-center">
        <button
          className="btn custom-btn"
          onClick={analyzeSentiment}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#69B190" : "",
          }}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Analyze"}{" "}
        </button>

        <button className="btn custom-btn ms-2" onClick={reset}>
          Reset
        </button>
      </div>

      {sentiment && !loading && (
        <h2 className="text-center mt-3">Sentiment: {sentiment}</h2>
      )}

      {/* Animated chart */}
      {polarity !== null && !loading && (
        <div className="mt-4">
          <h3 className="text-center">Polarity: {polarity.toFixed(2)}</h3>
          <animated.div style={chartSpring} className="d-flex justify-content-center align-items-center mt-4 centered-chart">
            <div className="chart-container">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Sentiment Polarity Chart" },
                  },
                }}
              />
            </div>
          </animated.div>
        </div>
      )}
    </div>
  );
}

export default App;

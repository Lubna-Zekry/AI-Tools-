import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/HomePage/Home";
import TextClassifyTool from "./pages/ArticleClassification/ArticleClassification";
import SentimentAnalysis from "./pages/SentimentAnalysis/SentimentAnalysis";
import ImageClassification from "./pages/ImageClassification/ImageClassification";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
        <Route path="/text-classify" element={<TextClassifyTool />} />
        <Route path="/image-classify" element={<ImageClassification />} />
      </Routes>
    </Router>
  );
}

export default App;

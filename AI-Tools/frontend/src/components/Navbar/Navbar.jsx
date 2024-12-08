import React from "react";
import { Link } from "react-router-dom";
import { FaChartLine, FaRobot, FaRegNewspaper, FaImage } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <FaRobot className="me-2 mb-2" /> AI Tools
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/sentiment-analysis">
                <FaChartLine className="me-3 mb-1" /> Sentiment Analysis{" "}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/text-classify">
                <FaRegNewspaper className="me-3 mb-1" />
                Article Classification
              </Link>
            </li>
            <li>
              <Link className="nav-link" to="/image-classify">
                <FaImage className="me-3 mb-1" /> Image Classification{" "}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

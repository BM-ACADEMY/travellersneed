import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faCommentDots } from "@fortawesome/free-solid-svg-icons"; // Solid icons
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons"; // Brand icons
import "../components/Footer.css";
import TravelChatbot from "../modules/admin/chatbot/TravelChartbot";

const Footer = ({ themes, topPackages, internationalDestinations, pages }) => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically
  const result = pages.map((page) => page.title).join(" | ");
  const handleCall = () => {
    window.location.href = "tel:+919944940051"; // Initiates a call
  };
  const navigate = useNavigate();

  const handleNavigation = (cityName) => {
    navigate(`/tour-packages/${encodeURIComponent(cityName)}`);
  };

  const handleWhatsApp = () => {
    const phoneNumber = "+919944940051";
    window.open(`https://wa.me/${phoneNumber.replace("+", "")}`, "_blank"); // Redirects to WhatsApp chat
  };

  const [isChatOpen, setIsChatOpen] = useState(false);

  // Handle the opening and closing of the chatbot
  const handleChatBot = () => {
    setIsChatOpen((prev) => !prev); // Toggle the state
  };
  const handleCloseChatBot = () => {
    setIsChatOpen(false); // Close the chatbot
  };

  return (
    <footer className="footer mt-5">
      <div className="container-fluid py-5">
        <div className="row">
          {/* Explore Section */}
          <div className="col-6 col-lg-3 d-flex justify-content-between mb-3 mb-lg-0">
            <div>
              <h5 className="fw-bold">Explore</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/" className="footer-link">
                    Tour Packages
                  </Link>
                </li>
                <li>
                  <Link to="/destinations" className="footer-link">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link to="/getaways" className="footer-link">
                    Getaways
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="footer-link">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Themes Section */}
          <div className="col-6 col-lg-3 d-flex justify-content-between mb-3 mb-lg-0">
            <div>
              <h5 className="fw-bold">Themes</h5>
              <ul className="list-unstyled">
                {themes?.map((theme, index) => (
                  <li key={index}>
                    <Link
                      to={`/themes/${theme.toLowerCase()}`}
                      className="footer-link"
                    >
                      {theme}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top Packages Section */}
          <div className="col-6 col-lg-3 d-flex justify-content-between mb-3 mb-lg-0">
            <div>
              <h5 className="fw-bold">Top Packages</h5>
              <ul className="list-unstyled">
                {topPackages?.slice(0, 10).map((pkg, index) => (
                  <li key={index}>
                    <span
                      onClick={() => handleNavigation(pkg.cityName)}
                      className="footer-link"
                    >
                      {pkg.cityName}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* International Section */}
          <div className="col-6 col-lg-3 d-flex justify-content-between">
            <div>
              <h5 className="fw-bold">International</h5>
              <ul className="list-unstyled">
                {internationalDestinations
                  ?.slice(0, 10)
                  .map((destination, index) => (
                    <li key={index}>
                      <span
                        onClick={() => handleNavigation(destination.cityName)}
                        className="footer-link"
                      >
                        {destination.cityName}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <hr />
        <div className="text-center">
          {pages.map((page, index) => (
            <React.Fragment key={index}>
              <Link to={page.link} className="footer-link">
                {page.title}
              </Link>
              {/* Add vertical line except after the last title */}
              {index < pages.length - 1 && (
                <span style={{ color: "gray", margin: "0 8px" }}>|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <hr />

        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">
            &copy; 2013 - {currentYear} Travelers Need Pvt Ltd.
          </p>

          {/* Social Media Icons */}
          <div className="social-icons d-flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="footer-icon"
            >
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="footer-icon"
            >
              <FontAwesomeIcon icon={faYoutube} size="lg" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="footer-icon"
            >
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="footer-icon"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
          </div>
        </div>
      </div>

      <div className="floating-icons">
        {/* Right Side Corner Floating Icons */}
        {!isChatOpen && (
          <>
            <div className="icon" onClick={handleChatBot} title="Chatbot">
              <FontAwesomeIcon icon={faCommentDots} size="lg" />
            </div>
            <div
              className="icon"
              onClick={() => (window.location.href = "tel:+919944940051")}
              title="Call"
            >
              <FontAwesomeIcon icon={faPhone} size="lg" />
            </div>
            <div
              className="icon"
              onClick={() =>
                window.open(`https://wa.me/+919944940051`, "_blank")
              }
              title="WhatsApp"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                size="lg"
                style={{ color: "#25D366" }}
              />
            </div>
          </>
        )}

        {/* Conditionally render TravelChatbot and close it */}
        {isChatOpen && (
          <div>
            <TravelChatbot onClose={handleCloseChatBot} />
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;

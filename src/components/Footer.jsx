import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-top">
          <p className="footer-eyebrow">Available for opportunities</p>
          <h2 className="footer-title">Let's build something great.</h2>
          <a href="#contact" className="footer-cta">Get in Touch</a>
        </div>

        <div className="h-line footer-divider" />

        <div className="footer-bottom">
          <div className="footer-brand">
            <span className="footer-logo">Monish</span>
            <p className="footer-tagline">
              Full Stack · Backend Developer
            </p>
            <p className="footer-bio text-secondary">
              Building scalable applications, real-time systems, and AI-powered solutions.
            </p>
          </div>

          <div className="footer-links">
            <a href="https://github.com/Monish14-tech" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="mailto:monishmani979@gmail.com">Email</a>
            <a href="#home">Back to top</a>
          </div>
        </div>

        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Monish. All rights reserved.</p>
          <p>Engineered with passion.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

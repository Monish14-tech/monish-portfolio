import React from 'react';
import './Footer.css';

const scrollTo = (id) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-top">
          <p className="footer-eyebrow">Available for opportunities</p>
          <h2 className="footer-title">Let's build something great.</h2>
          <button
            className="footer-cta"
            onClick={() => scrollTo('#contact')}
            aria-label="Go to contact section"
          >
            Get in Touch
          </button>
        </div>

        <div className="h-line footer-divider" />

        <div className="footer-bottom">
          <div className="footer-brand">
            <button
              className="footer-logo"
              onClick={() => scrollTo('#home')}
              aria-label="Back to top"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Monish
            </button>
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
            <button
              className="footer-back-top"
              onClick={() => scrollTo('#home')}
              aria-label="Back to top"
            >
              Back to top ↑
            </button>
          </div>
        </div>

        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Monish. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper container">
      <div className="footer-top">
        <h2 className="footer-title">Let's build something great.</h2>
        <a href="#contact" className="footer-cta">Get in Touch</a>
      </div>
      
      <div className="h-line" style={{ margin: '4rem 0' }} />
      
      <div className="footer-bottom">
        <div className="footer-brand">
          <span className="logo-mark" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Monish</span>
          <p className="text-secondary" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Full Stack Developer | Backend Developer<br/>
            <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>Building scalable applications, real-time systems, and AI-powered solutions. 🚀</span>
          </p>
        </div>
        
        <div className="footer-links">
          <a href="https://github.com/Monish14-tech" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="mailto:monishmani979@gmail.com">Email</a>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} Monish. All Rights Reserved.</p>
        <p>Engineered with Passion.</p>
      </div>
    </footer>
  );
};

export default Footer;

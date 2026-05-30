import React from 'react';
import { motion } from 'framer-motion';
import Model3D from '../components/Model3D';
import SlideIn from '../components/SlideIn';
import '../sections/Hero.css';

const Home = () => {
  return (
    <section id="home" className="hero-section">
      {/* Full-screen 3D Model as background */}
      <Model3D />

      {/* Hero text floats above the 3D scene */}
      <div className="container hero-content">
        <div className="hero-text-centered">
          <SlideIn direction="up" delay={0.2} duration={1}>
            <div className="section-eyebrow">
              <div className="scroll-hint-line" style={{ width: '40px', height: '1px' }}></div>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Full Stack | Backend Developer</span>
              <div className="scroll-hint-line" style={{ width: '40px', height: '1px' }}></div>
            </div>
          </SlideIn>

          <SlideIn direction="up" delay={0.4} duration={1.2}>
            <h1 className="hero-title">
              Architecting <br />
              <span style={{ fontStyle: 'italic' }}>Intelligent Systems.</span>
            </h1>
          </SlideIn>

          <SlideIn direction="up" delay={0.6} duration={1.2}>
            <p className="hero-description text-secondary">
              Problem Solver passionate about building scalable web applications, backend systems, and AI-powered solutions.
            </p>
          </SlideIn>
        </div>
      </div>

      <motion.div
        className="scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
      >
        <a href="#about" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
          <span>Discover</span>
          <div className="scroll-hint-line"></div>
        </a>
      </motion.div>
    </section>
  );
};

export default Home;

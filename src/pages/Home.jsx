import React from 'react';
import { motion } from 'framer-motion';
import SectionDecoration from '../components/SectionDecoration';
import SlideIn from '../components/SlideIn';
import '../components/Scene3D.css';
import '../sections/Hero.css';

const Home = () => {
  return (
    <section id="home" className="hero-section section-scrim">
      <SectionDecoration variant="hero" />

      <div className="container hero-content">
        <div className="hero-text-centered">
          <SlideIn direction="up" delay={0.2} duration={1}>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-line" />
              <span className="hero-eyebrow-text">Full Stack · Backend Developer</span>
              <span className="hero-eyebrow-line" />
            </div>
          </SlideIn>

          <SlideIn direction="up" delay={0.4} duration={1.2}>
            <h1 className="hero-title">
              Architecting <br />
              <em>Intelligent Systems.</em>
            </h1>
          </SlideIn>

          <SlideIn direction="up" delay={0.6} duration={1.2}>
            <p className="hero-description text-secondary">
              Problem solver passionate about building scalable web applications, backend systems, and AI-powered solutions.
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
        <a href="#about" className="scroll-hint-link">
          <span>Discover</span>
          <div className="scroll-hint-line" />
        </a>
      </motion.div>
    </section>
  );
};

export default Home;

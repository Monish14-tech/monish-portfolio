import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Model3D from '../components/Model3D';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="blob-glow" style={{ top: '20%', left: '10%' }}></div>
      <div className="blob-glow" style={{ bottom: '10%', right: '10%', animationDelay: '-5s' }}></div>
      
      <div className="container hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text"
        >
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hero-greeting"
          >
            Hello, I am
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hero-title"
          >
            A Creative <br /> <span className="text-gradient">Developer</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="hero-description"
          >
            I build interactive, accessible, and high-performance web applications with a focus on premium aesthetics and dynamic animations.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="hero-cta"
          >
            <Button icon={<ArrowRight size={18} />}>View My Work</Button>
            <Button variant="secondary">Contact Me</Button>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="hero-visual"
        >
          <Model3D />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  const skills = ['React', 'JavaScript', 'CSS/SCSS', 'Next.js', 'Node.js', 'Framer Motion', 'Three.js', 'Figma'];

  return (
    <section id="about" className="about-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            About <span className="text-gradient">Me</span>
          </h2>
          
          <div className="about-content">
            <div className="about-text glass-panel">
              <p>
                Hello! I am a passionate developer with a strong focus on creating immersive digital experiences. I specialize in building responsive, accessible, and highly animated web applications.
              </p>
              <p>
                My journey in web development started with a curiosity for how things work on the internet, and it has evolved into a career where I constantly explore new technologies and design trends like glassmorphism and complex micro-animations.
              </p>
              <p>
                When I'm not coding, you can find me exploring 3D modeling, reading up on the latest design trends, or experimenting with new frameworks.
              </p>
            </div>

            <div className="skills-container">
              <h3>My Skills</h3>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="skill-badge glass-panel"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

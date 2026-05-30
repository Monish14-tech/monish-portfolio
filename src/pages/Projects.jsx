import React from 'react';
import { motion } from 'framer-motion';
import SlideIn from '../components/SlideIn';
import '../sections/Projects.css';

const projects = [
  {
    id: 1,
    title: 'CricMatcher',
    category: 'Next.js / Supabase',
    description: 'A cricket-focused web application built to manage and display dynamic match-related information. Emphasizes efficient database interactions and optimized query handling.',
    highlights: ['Responsive UI', 'Database integration', 'Optimized data retrieval'],
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'MUNEZ.AI',
    category: 'Python / FastAPI',
    description: 'An AI-powered assistant platform designed to provide reliable responses through multiple AI providers. Incorporates backend API management and intelligent routing.',
    highlights: ['Multi-provider AI integration', 'API orchestration', 'Error handling & failover'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Cosmic Strike',
    category: 'Socket.IO / MongoDB',
    description: 'A real-time multiplayer application featuring live communication, player interactions, and leaderboard management.',
    highlights: ['Real-time communication', 'Multiplayer architecture', 'Leaderboard system'],
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1200&auto=format&fit=crop',
  },
];

const Projects = () => {
  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <SlideIn direction="up">
          <h2 className="section-title">
            Featured <span style={{ fontStyle: 'italic' }}>Projects</span>
          </h2>
        </SlideIn>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <SlideIn key={project.id} direction="up" delay={index * 0.2}>
              <div className="project-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="project-image-container">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <motion.div 
                    className="project-overlay"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="view-project-btn">View Details</span>
                  </motion.div>
                </div>
                <div className="project-info" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
                  <div>
                    <span className="project-category">{project.category}</span>
                    <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{project.title}</h3>
                    <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{project.description}</p>
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {project.highlights.map((hl, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem' }}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

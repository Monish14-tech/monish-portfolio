import React from 'react';
import { motion } from 'framer-motion';
import SlideIn from '../components/SlideIn';
import SectionHeader from '../components/SectionHeader';
import ProjectMini3D from '../components/ProjectMini3D';
import '../components/Scene3D.css';
import '../sections/Projects.css';

const projects = [
  {
    id: 1,
    title: 'Crick Matcher',
    category: 'Next.js / Supabase',
    model: 'globe',
    url: 'https://crick-matcher-8ue4.vercel.app/',
    description: 'A cricket-focused web application built to manage and display dynamic match-related information. Emphasizes efficient database interactions and optimized query handling.',
    highlights: ['Responsive UI', 'Database integration', 'Optimized data retrieval'],
    image: '/projects/crick-matcher.png',
  },
  {
    id: 2,
    title: 'MUNEZ.AI',
    category: 'Python / FastAPI',
    model: 'robot',
    url: 'https://munez-ai.onrender.com/',
    description: 'An AI-powered assistant platform designed to provide reliable responses through multiple AI providers. Incorporates backend API management and intelligent routing.',
    highlights: ['Multi-provider AI integration', 'API orchestration', 'Error handling & failover'],
    image: '/projects/munez-ai.png',
  },
  {
    id: 3,
    title: 'Cosmic Strike',
    category: 'Socket.IO / MongoDB',
    model: 'core',
    url: 'https://midnight-fighter-3.onrender.com/',
    description: 'A real-time multiplayer application featuring live communication, player interactions, and leaderboard management.',
    highlights: ['Real-time communication', 'Multiplayer architecture', 'Leaderboard system'],
    image: '/projects/cosmic-strike.png',
  },
];

const Projects = () => {
  return (
    <section id="projects" className="projects-section">
      <div className="container section-block">
        <SlideIn direction="up">
          <SectionHeader
            eyebrow="02 — Work"
            title="Featured "
            titleAccent="Projects"
            description="Selected builds spanning full-stack apps, AI platforms, and real-time systems."
            align="center"
          />
        </SlideIn>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <SlideIn key={project.id} direction="up" delay={index * 0.15} clip={false}>
              <article className="project-card">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-image-link"
                  aria-label={`Open ${project.title} live site`}
                >
                  <div className="project-image-container">
                    <img
                      src={project.image}
                      alt={`${project.title} preview`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      decoding="async"
                      className="project-screenshot"
                    />
                    <motion.div
                      className="project-overlay"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <span className="view-project-btn">Visit Live Site</span>
                    </motion.div>
                  </div>
                </a>

                <div className="project-body">
                  <div className="project-info">
                    <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="project-category">{project.category}</span>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <ul className="project-highlights">
                      {project.highlights.map((hl, i) => (
                        <li key={i}>{hl}</li>
                      ))}
                    </ul>
                  </div>

                  <ProjectMini3D variant={project.model} />
                </div>
              </article>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

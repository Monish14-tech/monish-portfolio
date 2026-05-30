import React from 'react';
import SlideIn from '../components/SlideIn';
import '../sections/About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        
        <SlideIn direction="up">
          <h2 className="section-title">
            About <span style={{ fontStyle: 'italic' }}>Me</span>
          </h2>
        </SlideIn>

        <div className="about-content">
          <SlideIn direction="up" delay={0.2}>
            <div className="about-text">
              <p>
                I am a technology enthusiast who enjoys designing and developing software solutions that solve real-world problems. Over time, I have gained experience working with modern web technologies, backend frameworks, databases, and API integrations.
              </p>
              <p>
                My development journey has involved building web applications, AI-powered platforms, and real-time systems that emphasize performance, scalability, and user experience. I continuously explore new technologies, improve my problem-solving abilities, and work on projects that challenge my technical skills.
              </p>
              <p>
                I believe that great software is created through a combination of strong engineering principles, continuous learning, and attention to user needs. My goal is to contribute to innovative products while growing as a software engineer.
              </p>
              
              <div className="about-stats" style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                <div className="stat-item" style={{ flex: '1 1 auto' }}>
                  <span className="stat-label" style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'block' }}>Experience</span>
                  <span className="stat-label text-secondary">Technical Training in web development and software design.</span>
                </div>
                <div className="stat-item" style={{ flex: '1 1 auto' }}>
                  <span className="stat-label" style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'block' }}>Achievements</span>
                  <span className="stat-label text-secondary">IoT Certification, Hackathon Participant, Tech Paper Presentation.</span>
                </div>
              </div>
            </div>
          </SlideIn>

          <SlideIn direction="up" delay={0.4}>
            <div className="skills-container">
              <p className="skills-label">Core Competencies</p>
              <ul className="skills-list" style={{ marginBottom: '2rem' }}>
                <li>Java, Python, C, JavaScript</li>
                <li>HTML5, CSS3, React.js, Next.js</li>
                <li>FastAPI, REST APIs, Auth</li>
                <li>MongoDB, Supabase, DB Design</li>
                <li>Data Structures & Algorithms</li>
                <li>Git, GitHub, VS Code, Postman</li>
              </ul>
              
              <p className="skills-label">Career Objective</p>
              <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                I aim to build a career in software development by creating efficient, scalable, and impactful technology solutions. I am particularly interested in full-stack development, backend engineering, cloud technologies, artificial intelligence, and modern software architecture.
              </p>
            </div>
          </SlideIn>
        </div>

      </div>
    </section>
  );
};

export default About;

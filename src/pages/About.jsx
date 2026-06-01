import React from 'react';
import SlideIn from '../components/SlideIn';
import SectionHeader from '../components/SectionHeader';
import SectionDecoration from '../components/SectionDecoration';
import '../components/Scene3D.css';
import '../sections/About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <SectionDecoration variant="about" />

      <div className="container section-block">
        <SlideIn direction="up">
          <SectionHeader
            eyebrow="01 — About"
            title="About "
            titleAccent="Me"
            description="Technology enthusiast focused on scalable software, backend systems, and thoughtful engineering."
            align="center"
          />
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

              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-title">Experience</span>
                  <span className="stat-desc">Technical training in web development and software design.</span>
                </div>
                <div className="stat-item">
                  <span className="stat-title">Achievements</span>
                  <span className="stat-desc">IoT certification, hackathon participant, tech paper presentation.</span>
                </div>
              </div>
            </div>
          </SlideIn>

          <SlideIn direction="up" delay={0.4}>
            <aside className="skills-container panel">
              <p className="skills-label">Core Competencies</p>
              <ul className="skills-list">
                <li>Java, Python, C, JavaScript</li>
                <li>HTML5, CSS3, React.js, Next.js</li>
                <li>FastAPI, REST APIs, Auth</li>
                <li>MongoDB, Supabase, DB Design</li>
                <li>Data Structures & Algorithms</li>
                <li>Git, GitHub, VS Code, Postman</li>
              </ul>

              <p className="skills-label">Career Objective</p>
              <p className="skills-objective">
                I aim to build a career in software development by creating efficient, scalable, and impactful technology solutions — with a focus on full-stack development, backend engineering, cloud, AI, and modern architecture.
              </p>
            </aside>
          </SlideIn>
        </div>
      </div>
    </section>
  );
};

export default About;

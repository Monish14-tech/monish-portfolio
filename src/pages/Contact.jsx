import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SlideIn from '../components/SlideIn';
import SectionHeader from '../components/SectionHeader';
import SectionDecoration from '../components/SectionDecoration';
import '../components/Scene3D.css';
import '../sections/Contact.css';

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: 'f4af747d-8983-4c40-9a44-16d1a87a8a0b',
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting form', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section section-scrim">
      <SectionDecoration variant="contact" />

      <div className="container section-block">
        <SlideIn direction="up">
          <SectionHeader
            eyebrow="03 — Contact"
            title="Let's "
            titleAccent="Connect"
            description="Open to software development opportunities, technical collaborations, internships, and innovative project discussions."
            align="center"
          />
        </SlideIn>

        <div className="contact-content">
          <SlideIn direction="up" delay={0.2}>
            <aside className="contact-info panel">
              <div className="info-block">
                <span className="info-label">Email</span>
                <a href="mailto:monishmani979@gmail.com" className="info-value info-value--link">
                  monishmani979@gmail.com
                </a>
              </div>
              <div className="info-block">
                <span className="info-label">GitHub</span>
                <a
                  href="https://github.com/Monish14-tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-value info-value--link"
                >
                  Monish14-tech
                </a>
              </div>
              <div className="info-block">
                <span className="info-label">Location</span>
                <span className="info-value">Open to Remote & Relocation</span>
              </div>
            </aside>
          </SlideIn>

          <SlideIn direction="up" delay={0.4}>
            <form className="contact-form panel" onSubmit={handleSubmit}>
              {submitted ? (
                <div className="success-message">
                  <h3>Message Received.</h3>
                  <p className="text-secondary">Thank you for reaching out. I will get back to you shortly.</p>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@email.com"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      rows="5"
                      placeholder="Tell me about your project or opportunity..."
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : (
                      <>
                        Send Message <ArrowRight size={18} strokeWidth={1.5} />
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </SlideIn>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import Button from '../components/Button';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          
          <div className="contact-content">
            <div className="contact-info">
              <h3>Let's talk about your next project</h3>
              <p>
                I'm currently available for freelance work and full-time opportunities. If you have a project that needs some creative magic, I'd love to hear about it!
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon"><Mail /></div>
                  <div>
                    <h4>Email</h4>
                    <p>hello@yourdomain.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon"><Phone /></div>
                  <div>
                    <h4>Phone</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon"><MapPin /></div>
                  <div>
                    <h4>Location</h4>
                    <p>San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="contact-form glass-panel" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="john@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" placeholder="Tell me about your project..." required></textarea>
              </div>
              <Button type="submit" variant="primary">Send Message</Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

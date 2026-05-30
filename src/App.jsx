import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Background from './components/Background';

// We import the pages which now act as sections
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <CustomCursor />
      <Background />
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />
      <Navbar />
      
      {/* Continuous scrolling container */}
      <main>
        <Home />
        <About />
        <Projects />
        <Contact />
      </main>
      
      <Footer />
    </>
  );
}

export default App;

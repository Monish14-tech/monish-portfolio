import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { PerformanceProvider, usePerformance } from './context/PerformanceContext';
import { DeferMount } from './utils/DeferMount';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Background from './components/Background';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

function useFinePointer() {
  const [finePointer, setFinePointer] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return finePointer;
}

function AppContent() {
  const { enableCustomCursor } = usePerformance();
  const finePointer = useFinePointer();
  const showCustomCursor = enableCustomCursor && finePointer;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {showCustomCursor ? <CustomCursor /> : null}
      <Background />
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />
      <Navbar />

      <main>
        <Home />
        <DeferMount minHeight="100vh">
          <Suspense fallback={null}>
            <About />
          </Suspense>
        </DeferMount>
        <DeferMount minHeight="100vh">
          <Suspense fallback={null}>
            <Projects />
          </Suspense>
        </DeferMount>
        <DeferMount minHeight="80vh">
          <Suspense fallback={null}>
            <Contact />
          </Suspense>
        </DeferMount>
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <PerformanceProvider>
      <AppContent />
    </PerformanceProvider>
  );
}

export default App;

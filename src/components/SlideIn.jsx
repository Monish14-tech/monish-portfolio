import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SlideIn = ({ children, direction = 'up', delay = 0, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -60, opacity: 0 };
      case 'right': return { x: 60, opacity: 0 };
      case 'up': return { y: 60, opacity: 0 };
      case 'down': return { y: -60, opacity: 0 };
      default: return { y: 60, opacity: 0 };
    }
  };

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={getInitialPosition()}
        animate={isInView ? { x: 0, y: 0, opacity: 1 } : getInitialPosition()}
        transition={{ 
          type: "spring",
          stiffness: 40,
          damping: 20,
          mass: 1,
          delay: delay 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SlideIn;

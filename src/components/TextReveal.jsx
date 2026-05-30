import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TextReveal = ({ text, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  // Split text into words, keeping HTML tags intact if possible, or just split by space
  // For simplicity and safety with React nodes (if passed as children), we assume `text` is a string.
  // If it's a string, we split it.
  
  if (typeof text !== 'string') {
    // Fallback if children are passed instead of raw string
    return (
      <div ref={ref} className={className} style={{ overflow: 'hidden' }}>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 40, damping: 20, delay }}
        >
          {text}
        </motion.div>
      </div>
    );
  }

  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 80,
      rotate: 5,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 60,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={1}
    >
      {words.map((word, index) => (
        <motion.span
          variants={childVariants}
          style={{ marginRight: "0.25em", display: "inline-block" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextReveal;

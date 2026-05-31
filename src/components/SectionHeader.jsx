import React from 'react';

const SectionHeader = ({ eyebrow, title, titleAccent, description, align = 'center' }) => {
  return (
    <header className={`section-header section-header--${align}`}>
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2 className="section-title">
        {title}
        {titleAccent && <em>{titleAccent}</em>}
      </h2>
      {description && <p className="section-description">{description}</p>}
    </header>
  );
};

export default SectionHeader;

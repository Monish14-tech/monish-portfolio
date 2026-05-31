import React from 'react';
import './Scene3D.css';
import Model3D from './Model3D';
import Crystal3D from './Crystal3D';
import Globe3D from './Globe3D';

const SCENES = {
  hero: Model3D,
  about: Crystal3D,
  contact: Globe3D,
};

const SectionDecoration = ({ variant }) => {
  const Scene = SCENES[variant];
  if (!Scene) return null;

  return (
    <div className={`section-deco section-deco--${variant}`} aria-hidden="true">
      <Scene />
    </div>
  );
};

export default SectionDecoration;

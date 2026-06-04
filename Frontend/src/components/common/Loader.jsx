import React from 'react';
import '../../styles/common.css';

function Loader({ text, variant = 'fullpage' }) {
  const isInline = variant === 'inline';

  return (
    <div className={`loader ${isInline ? 'loader--inline' : 'loader--fullpage'}`}>
      <div className="loader__spinner" />
      {text && <span className="loader__text">{text}</span>}
    </div>
  );
}

export default Loader;

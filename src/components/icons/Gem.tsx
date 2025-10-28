import React from 'react';

export const Gem: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L3 7l9 13 9-13-9-5z" fill="currentColor" />
    <path d="M3 7h18l-9 13L3 7z" stroke="currentColor" strokeWidth={0.5} />
  </svg>
);

export default Gem;

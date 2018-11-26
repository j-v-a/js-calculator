import React from 'react';

const Display = ({ result, calculation }) => (
  <section id="calc-display">
    <div id="display">{result}</div>
    <div id="secondary-display">{calculation}</div>
  </section>
);

export default Display;

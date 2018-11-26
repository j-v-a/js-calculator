import React from 'react';

import Button from './Button';

const Input = ({ buttons, onClick }) => {
  const inputButtons = buttons.map(button => (
    <Button
      type={button.type}
      id={button.id}
      btnKey={button.key}
      key={button.id}
      onClick={onClick}
    />
  ));

  return <section id="calc-input">{inputButtons}</section>;
};

export default Input;

import React from 'react';

const Button = ({ type, id, onClick, btnKey }) => (
  <div className={'btn btn-' + type} id={id} onClick={onClick}>
    {btnKey}
  </div>
);

export default Button;

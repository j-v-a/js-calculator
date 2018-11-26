const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

// Evaluate an array, used as a naive calculator implementation
const calculateResult = calculation => {
  try {
    return precisionRound(eval(calculation.join('')), 5);
  } catch (error) {
    console.error(error);
  }
};

const isOperator = val => {
  return ['+', '-', '*', '/'].indexOf(val) === -1 ? false : true;
};

export { precisionRound, calculateResult, isOperator };

import React from 'react';

/* Data */
const buttons = [
  {
    key: 'C',
    type: 'operator',
    id: 'clear'
  },
  {
    key: 'CE',
    type: 'operator',
    id: 'clear-last'
  },
  {
    key: '/',
    type: 'operator',
    id: 'divide'
  },
  {
    key: '*',
    type: 'operator',
    id: 'multiply'
  },
  {
    key: '7',
    type: 'number',
    id: 'seven'
  },
  {
    key: '8',
    type: 'number',
    id: 'eight'
  },
  {
    key: '9',
    type: 'number',
    id: 'nine'
  },
  {
    key: '-',
    type: 'operator',
    id: 'subtract'
  },
  {
    key: '4',
    type: 'number',
    id: 'four'
  },
  {
    key: '5',
    type: 'number',
    id: 'five'
  },
  {
    key: '6',
    type: 'number',
    id: 'six'
  },
  {
    key: '+',
    type: 'operator',
    id: 'add'
  },
  {
    key: '1',
    type: 'number',
    id: 'one'
  },
  {
    key: '2',
    type: 'number',
    id: 'two'
  },
  {
    key: '3',
    type: 'number',
    id: 'three'
  },
  {
    key: '=',
    type: 'operator',
    id: 'equals'
  },
  {
    key: '0',
    type: 'number',
    id: 'zero'
  },
  {
    key: '.',
    type: 'number',
    id: 'decimal'
  }
];

/* Helper functions */

function precisionRound(number, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

// Evaluate an array
function calculateResult(calculation) {
  try {
    return precisionRound(eval(calculation.join('')), 5);
  } catch (error) {
    console.error(error);
  }
}

function isOperator(val) {
  return ['+', '-', '*', '/'].indexOf(val) === -1 ? false : true;
}

/* Calculator */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calculation: ['0'],
      reset: false,
      result: '0',
      buttons
    };
    this.handleClick = this.handleClick.bind(this);
    this.clear = this.clear.bind(this);
  }
  handleClick(event) {
    const val = event.target.innerHTML;
    const calculation = this.state.calculation;
    if (this.state.reset && isOperator(val) != true) {
      this.clear();
      this.setState(() => {
        return {
          reset: false
        };
      });
    }
    switch (val) {
      case '=':
        this.setState(() => {
          return {
            result: calculateResult(calculation),
            reset: true
          };
        });
        break;
      case 'C':
        this.clear();
        break;
      case 'CE':
        if (calculation.length === 1) {
          this.clear();
          break;
        } else {
          this.setState(prevState => {
            return {
              calculation: [...prevState.calculation].slice(
                0,
                prevState.calculation.length - 1
              ),
              result: prevState.result.slice(0, prevState.result.length - 1)
            };
          });
          break;
        }
      case '+':
      case '-':
      case '*':
      case '/':
        // Pressing an operator immediately following = should start a new calculation that operates on the result of the previous evaluation.
        if (this.state.reset === true) {
          this.setState(prevState => {
            return {
              calculation: [prevState.result, val],
              result: val,
              reset: false
            };
          });
          break;
          // If 2 or more operators are entered consecutively, the operation performed should be the last operator entered.
        } else if (isOperator(calculation[calculation.length - 1])) {
          this.setState(prevState => {
            return {
              calculation: [
                ...prevState.calculation.slice(
                  0,
                  prevState.calculation.length - 1
                ),
                val
              ],
              result:
                prevState.result.slice(0, prevState.result.length - 1) +
                '' +
                val
            };
          });
          break;
        } else {
          this.setState(prevState => {
            return {
              calculation: [...prevState.calculation, val],
              result: val
            };
          });
          break;
        }
      case '.':
        // only accept one
        // get the part of the calculation after the last operator
        const lastOperatorIndex = calculation
          .map(val => isOperator(val))
          .lastIndexOf(true);
        const lastNumber = calculation.slice(lastOperatorIndex + 1);
        // This may not allready be a decimal number
        const prevDotIndex = lastNumber.indexOf('.');
        if (prevDotIndex != -1) {
          break;

          // insert zero when previous val is an operator
        } else if (isOperator(calculation[calculation.length - 1])) {
          this.setState(prevState => {
            return {
              calculation: [...prevState.calculation, '0', val],
              result: '0' + val
            };
          });
          break;
        } // otherwise handle as a number
      default:
        // remove leading zero's
        if (calculation.length === 1 && calculation[0] === '0' && val != '.') {
          this.setState(prevState => {
            return {
              calculation: [val],
              result: val
            };
          });
          break;
          // don't show previous operators in result
        } else if (isOperator(calculation[calculation.length - 1])) {
          this.setState(prevState => {
            return {
              calculation: [...prevState.calculation, val],
              result: val
            };
          });
          break;
        } else {
          this.setState(prevState => {
            return {
              calculation: [...prevState.calculation, val],
              result: prevState.result + '' + val
            };
          });
          break;
        }
    }
  }
  clear() {
    this.setState(() => {
      return {
        calculation: ['0'],
        result: '0'
      };
    });
  }
  render() {
    const calculation =
      this.state.calculation.length != 0
        ? this.state.calculation.join('')
        : '0';
    return (
      <section id="calc-main">
        <Display result={this.state.result} calculation={calculation} />
        <InputPad buttons={this.state.buttons} onClick={this.handleClick} />
      </section>
    );
  }
}

const Display = ({ result, calculation }) => (
  <section id="calc-display">
    <div id="display">{result}</div>
    <div id="secondary-display">{calculation}</div>
  </section>
);

class InputPad extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const buttons = this.props.buttons.map(button => (
      <Button
        type={button.type}
        id={button.id}
        btnKey={button.key}
        key={button.id}
        onClick={this.props.onClick}
      />
    ));

    return <section id="calc-input">{buttons}</section>;
  }
}

const Button = ({ type, id, onClick, btnKey }) => (
  <div className={'btn btn-' + type} id={id} onClick={onClick}>
    {btnKey}
  </div>
);

export default App;

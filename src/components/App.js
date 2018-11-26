import React from 'react';

import Display from './Display';
import Input from './Input';

import buttons from '../data/buttons';
import {
  precisionRound,
  calculateResult,
  isOperator
} from '../helpers/calculationHelpers';

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
        // Pressing an operator immediately following = should start a new calculation that operates
        // on the result of the previous evaluation.
        if (this.state.reset === true) {
          this.setState(prevState => {
            return {
              calculation: [prevState.result, val],
              result: val,
              reset: false
            };
          });
          break;
          // If 2 or more operators are entered consecutively, the operation performed should be the
          // last operator entered.
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
        <Input buttons={this.state.buttons} onClick={this.handleClick} />
      </section>
    );
  }
}

export default App;

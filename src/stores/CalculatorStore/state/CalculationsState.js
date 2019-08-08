import State from './State';
import {
  zeroFunc
} from './../../../lib/util';

class CalculationsState extends State {
  changeInputString(text = '') {
    this.calculator.changeInputString(text);
  };

  typeZeroSymbol() {
    this.calculator.typeZeroSymbol();
  }

  makeRational() {
    this.calculator.makeRational();
  }

  toggleSign() {
    this.calculator.toggleSign();
  }

  changeCurrentNumber(func = zeroFunc) {
    this.calculator.changeCurrentNumber(func);
  }

  changeCommonResult(symbol = '', func = zeroFunc) {
    this.calculator.changeCommonResult(symbol, func);
  }

  getCalculationsResult() {
    this.calculator.getCalculationsResult();
  }
}

export default new CalculationsState();
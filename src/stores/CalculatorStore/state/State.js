import {
  zeroFunc
} from './../../../lib/util';

export default class State {
  calculator = null;

  setCalculator(calculator = null) {
    this.calculator = calculator;
  }

  changeInputString(text = '') {}

  typeZeroSymbol() {}

  makeRational() {}

  toggleSign() {}

  changeCurrentNumber(func = zeroFunc) {}

  changeCommonResult(value = '', func = zeroFunc) {}

  getCalculationsResult() {}
}
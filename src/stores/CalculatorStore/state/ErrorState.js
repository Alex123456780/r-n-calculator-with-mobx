import State from './State';

class ErrorState extends State {
  changeInputString(text = '') {
    this.calculator.resetAllCalculations(text);
  }

  typeZeroSymbol() {
    this.changeInputString();
  }

  makeRational() {
    this.changeInputString('0,');
  }
}

export default new ErrorState();
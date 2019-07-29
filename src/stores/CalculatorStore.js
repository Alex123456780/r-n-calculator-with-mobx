import {
  observable,
  computed,
  action,
  reaction
} from 'mobx';

import { COMMAND } from './../lib/constants';

import {
   divide,
   sum,
   multiply,
   sub,
   getPercent
} from './../lib//util';

class CalculatorStore {
  @observable number_value = '';

  @observable sign_value = '';

  @observable canPressRational = true;

  @observable current_result = 0;

  @observable temp_value = '';

  @observable info_message = '';

  @computed get hasInputNumber() {
    return this.number_value !== '';
  }

  @computed get needInfoMessage() {
    switch (this.number_value === 'Infinity' || this.number_value === 'NaN') {
      case true:
        return true;
      case true:
        return false;
    }
  }

  @computed get canRational() {
    return this.number_value.length < 16 && this.canPressRational;
  }

  @computed get calc_value() {
    return this.sign_value + this.number_value;
  }

  max_number_value = 16;

  last_command = sum;

  isCommandPress = false;

  setToggleSign = reaction(
    () => this.number_value === '',
    (isValueEmpty) => {
      if (isValueEmpty) {
        this.sign_value = '';
        this.canPressRational = true;
        this.max_number_value = 16;
      }
      else {
        this.info_message = '';
      }
    }
  );

  setInfoMessage = reaction(
    () => this.needInfoMessage,
    (needInfoMessage) => {
      if (needInfoMessage) {
        this.info_message = 'На ноль делить нельзя';
        this.number_value = '';
        this.sign_value = '';
        this.canPressRational = true;
        this.current_result = 0;
        this.temp_value = '';
        this.max_number_value = 16;
        this.last_command = sum;
        this.isCommandPress = true;
      }
    }
  )

  getResultFromString() {
    const currentResult = parseFloat(this.calc_value.replace(',', '.'));
    return isNaN(currentResult) ? 0 : currentResult;
  }

  getResultFromNumber() {
    return ('' + Math.abs(this.current_result)).replace(/^0$/, '').replace('.', ',');
  }

  setResult() {
      return this.last_command(this.current_result, this.getResultFromString());
  }

  setCommand(command) {
    return this.hasInputNumber ? this.calc_value
    // .replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1')
    .replace(/(\,[1-9]*)0+$/, '$1')
    .replace(/^(.+),$/, '$1') + ` ${command} ` : '';
  }

  // TODO: не успел доработать, в логике имеются косяки
  // prev_string = '';
  // prev_result = 0;
  // percent() {
  //   const prev_command = this.last_command;
  //   this.prev_string = this.prev_string ? this.prev_string : this.temp_value;
  //   this.prev_result = this.prev_result ? this.prev_result : this.current_result;
  //   this.current_result = this.prev_result;
  //   this.last_command = getPercent;
  //   this.current_result = this.setResult();
  //   this.temp_value = this.prev_string + `${this.getResultFromNumber()}`;
  //   this.number_value = this.getResultFromNumber();
  //   this.last_command = prev_command;
  //   this.isCommandPress = true;
  // }

  executeCommand(symbol = '', func = sum) {
    if (!this.isCommandPress) {
      this.isCommandPress = true;
      this.current_result = this.setResult();
      this.last_command = func;
      if (this.hasInputNumber && this.number_value !== '0') {
        this.temp_value += this.setCommand(symbol);
      }
      else {
        this.temp_value += `0 ${symbol} `;
      }
      this.sign_value = this.current_result >= 0 ? '' : '-';
      this.number_value = this.getResultFromNumber();
      this.canPressRational = true;
    }
    else {
      if (!this.info_message) {
        this.last_command = func;
        this.temp_value = this.temp_value.replace(/ . $/, '') + ` ${symbol} `;
      }
    }
    // this.prev_string = '';
    // this.prev_result = 0;
  }

  @action
  handlePress(command, text = '0') {
    switch (command) {
      case COMMAND.DIGIT:
        const newValue = this.isCommandPress ? text : this.number_value + text;
        this.sign_value = this.isCommandPress ? '' : this.sign_value;
        this.number_value = newValue.replace(/^0(?!,)/, '').substring(0, this.max_number_value);
        this.isCommandPress = false;
        break;
      case COMMAND.RESET:
        this.info_message = '';
        this.number_value = '';
        this.sign_value = '';
        this.canPressRational = true;
        this.current_result = 0;
        this.temp_value = '';
        this.max_number_value = 16;
        this.last_command = sum;
        this.isCommandPress = false;
        break;
      case COMMAND.TOGGLE_SIGN:
        if (!this.info_message) {
          // TODO: более детально протестировать и доработать логику смены знака для чисел,
          // котрые пытаемся сложить, вычесть и т.д. с предыдущим результатом
          this.isCommandPress = false;
          this.sign_value = this.sign_value ? '' : '-';
          this.number_value = this.number_value ? this.number_value : '0';
        }
        break;
      case COMMAND.PERCENTAGE:
        // TODO: не успел доработать, в логике имеются косяки
        // this.percent();
        break;
      case COMMAND.DIVISION:
        this.executeCommand('÷', divide);
        break;
      case COMMAND.MULTIPLICATION:
        this.executeCommand('x', multiply);
        break;
      case COMMAND.SUBTRACTION:
        this.executeCommand('-', sub);
        break;
      case COMMAND.ADDITION:
        this.executeCommand('+', sum);
        break;
      case COMMAND.EQUAL:
        if (this.number_value !== '') {
          this.current_result = this.last_command(this.current_result, this.getResultFromString());
          this.sign_value = this.current_result >= 0 ? '' : '-';
          this.number_value = this.getResultFromNumber();
          this.current_result = 0;
          this.temp_value = '';
          this.last_command = sum;
        }
        break;
      case COMMAND.RATIONAL:
        if (this.canRational && !this.info_message) {
          this.isCommandPress = false;
          this.canPressRational = false;
          this.max_number_value = 17;
          this.number_value = this.number_value ? this.number_value + ',' : '0,';
        }
      default:
        break;
    }
  }
}

export default new CalculatorStore();
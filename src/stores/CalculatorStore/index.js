import {
  observable,
  computed,
  action,
  reaction
} from 'mobx';

import { COMMAND } from './../../lib/constants';
import {
  zeroFunc
} from './../../lib/util';

import {
  isBadNumber,
  optimizeString,
  getNumberFromString,
  getStringFromNumber,
  divide,
  sum,
  multiply,
  sub,
  getPercent
} from './util';

import STATE, {
  CalculationsState,
  ErrorState
} from './state';

// TODO: Добавить РИДМИ.
// Для РИДМИ - логика работы калькулятора писалась на основе калькулятора в Windows 10 с некоторфми отличиями:
// - при повторном нажатии на "=" результат не изменится.
// - нажатие на цифру уберет сообщение об ошибке, обнулитт все расчеты и выведет на экран данную цифру.
// п.с. мб есть еще отличия, которые я не учел

// TODO: добавить второй калькулятор, который считает результат после ввода всех операций и чисел,
// а не после каждого ввода числа или нажатия кнопки той или иной операци (так считает калькулятор в Windows 10).
// После этого добавить навигацию - главный скрин с переходами на каждый из калькуляторов (либо таббар с двумя табами)
// и два роута под каждый из калькуляторов. Будут нужны дополнительные компоненты, каждый их которых будет
// "подписан" на соответствующий стор (калькулятор). Разница будет только в отслеживаемом сторе и больше ни в чем,
// ни на верстку ни на изменение логики работы в уже написанных компонентах внедрение второго калькулятора не повлияет.
// Код второго калькулятора будет идентичен коду первого в плане архитектуры, изменится только логика работы методов.
// Реализация нескольких калькуляторов - обычное наследование, паттерны не нужны?

// TODO:
// private variables, encapsulation:
// https://babeljs.io/docs/en/babel-plugin-proposal-private-methods
// https://github.com/tc39/proposal-class-fields
// https://github.com/tc39/proposal-private-methods
// ???? - что там насчет наследования (есть private, но нет protected) - только TypeScript поможет?
class CalculatorStore {

  @observable current_state_status = STATE.CALCULATIONS;

  state = CalculationsState;

  changeState = reaction(
    () => this.current_state_status,
    (current_state_status) => {
      switch (current_state_status) {
        case STATE.CALCULATIONS:
          this.state = CalculationsState;
          break;
        case STATE.ERROR:
          this.state = ErrorState;
          break;
        default:
          break;
      }
    }
  );

  @observable input_string = '';

  @computed get canTypeDigit() {
    return this.input_string.replace(/\D/g,'').replace(/^0/,'').length < 16;
  }

  @computed get current_number() {
    return getNumberFromString(this.input_string);
  }

  isCommandPress = false;

  @observable operation_string = '';

  @computed get isCommandLast() {
    return / . $/.test(this.operation_string);
  }

  @computed get isStringEmpty() {
    return /^\s*$/.test(this.operation_string);
  }

  @computed get isDigitLast() {
    return /[0-9,-]+$/.test(this.operation_string);
  }

  @computed get temp_operation_string() {
    return this.operation_string.replace(/[0-9,-]+$/, '');
  }

  current_command = sum;

  @observable common_result = 0;

  @observable error_message = '';

  getError = reaction(
    () => isBadNumber(this.common_result),
    (isBadNumber) => {
      if (isBadNumber) {
        // TODO:
        // switch (this.common_result.toString) {all cases also toString, String(value)}
        // в этом случае можно обработать NaN отдельным кейсом.
        switch (this.common_result) {
          case Number.NEGATIVE_INFINITY:
            if (this.current_number === -0) {
              this.error_message = 'Деление на 0 невозможно';
            }
            else {
              this.error_message = 'Число слишком маленькое';
            }
            break;
          case Number.POSITIVE_INFINITY:
            if (this.current_number === 0) {
              this.error_message = 'Деление на 0 невозможно';
            }
            else {
              this.error_message = 'Число слишком большое';
            }
            break;
          default:
            this.error_message = 'Деление 0 на 0 невозможно';
            break;
        }
      }
      else {
        this.error_message = '';
      }
    }
  )
  
  constructor() {
    ErrorState.setCalculator(this);
    CalculationsState.setCalculator(this);
  }

  @action
  handlePress(command, text) {
    switch (command) {
      case COMMAND.DIGIT:
        this.state.changeInputString(text);
        break;
      case COMMAND.ZERO:
        this.state.typeZeroSymbol();
        break;
      case COMMAND.RATIONAL:
        this.state.makeRational();
        break;
      case COMMAND.TOGGLE_SIGN:
        this.state.toggleSign();
        break;
      case COMMAND.PERCENTAGE:
        this.state.changeCurrentNumber(getPercent);
        break;
      case COMMAND.DIVISION:
        this.state.changeCommonResult('÷', divide);
        break;
      case COMMAND.MULTIPLICATION:
        this.state.changeCommonResult('x', multiply);
        break;
      case COMMAND.SUBTRACTION:
        this.state.changeCommonResult('-', sub);
        break;
      case COMMAND.ADDITION:
        this.state.changeCommonResult('+', sum);
        break;
      case COMMAND.RESET:
        this.resetAllCalculations();
        break;
      case COMMAND.EQUAL:
        this.state.getCalculationsResult();
        break;
      default:
        break;
    }
  }

  setStatus(status = STATE.CALCULATIONS) {
    this.current_state_status = status;
  }

  setErrorState(result) {
    this.common_result = result;
    this.setStatus(STATE.ERROR);
  }

  setCurrentCommand(func = zeroFunc) {
    this.current_command = func;
  }

  setInputString(text = '') {
    this.input_string = text;
  }

  changeInputString(text = '') {
    if (this.isCommandPress || this.isDigitLast) {
      this.setInputString(text);
      this.operation_string = this.temp_operation_string;
      this.isCommandPress = false;
    }
    else {
      if (this.canTypeDigit) {
        this.input_string += text;
      }
    }
  }

  typeZeroSymbol() {
    if (!/^\s*$|^(-?)0$/.test(this.input_string)) {
      this.changeInputString('0');
    }
  }

  makeRational() {
    if (this.isCommandPress || this.isDigitLast) {
      this.changeInputString('0,');
    }
    else {
      if (!/,/.test(this.input_string)) {
        this.setInputString((this.input_string + ',').replace(/^,/, '0,'));
      }
    }
  }

  toggleSign() {
    this.setInputString(('-' + this.input_string).replace(/^--/, '').replace(/^-$/, '-0'));
    if (this.isCommandPress || this.isDigitLast || this.isStringEmpty) {
      this.operation_string = this.temp_operation_string + this.input_string;
    }
  }

  changeCurrentNumber(func = zeroFunc) {
    const result = func(this.current_number, this.common_result);
    if (!isBadNumber(result)) {
        const string_result = getStringFromNumber(result);
        this.operation_string = this.temp_operation_string + string_result;
        this.setInputString(string_result);
    }
    else {
      this.setErrorState(result);
    }
  }

  changeCommonResult(symbol = '', func = sum) {
    if (this.isStringEmpty) {
      this.common_result = this.current_number;
      this.operation_string += `${optimizeString(this.input_string)} ${symbol} `;
      this.setCurrentCommand(func);
      this.isCommandPress = true;
    }
    else {
      const result = this.current_command(this.common_result, this.current_number);
      if (!isBadNumber(result)) {
        if (this.isCommandLast) {
          if (this.isCommandPress) {
            this.operation_string = this.operation_string.replace(/ . $/, '') + ` ${symbol} `;
          }
          else {
            this.operation_string += `${optimizeString(this.input_string)} ${symbol} `;
            this.common_result = result;
            this.setInputString(getStringFromNumber(result));
          }
        }
        else {
          this.operation_string += ` ${symbol} `;
          this.common_result = result;
          this.setInputString(getStringFromNumber(result));
        }
        this.setCurrentCommand(func);
        this.isCommandPress = true;
      }
      else {
        this.setErrorState(result);
      }
    }
  }

  setDefaultSettings() {
    this.operation_string = '';
    this.common_result = 0;
    this.setCurrentCommand(sum);
    this.setStatus(STATE.CALCULATIONS);
  }

  resetAllCalculations(text = '') {
    this.setDefaultSettings();
    this.setInputString(text);
    this.isCommandPress = false;
  }

  getCalculationsResult() {
    const result = this.current_command(this.common_result, this.current_number);
    if (!isBadNumber(result)) {
      this.setDefaultSettings();
      this.setInputString(getStringFromNumber(result));
      this.isCommandPress = true;
    }
    else {
      this.setErrorState(result);
    }
  }
}

export default new CalculatorStore();
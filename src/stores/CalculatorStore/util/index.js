import Decimal from './decimal';

const numberResult = new Decimal(0);

export function isBadNumber(value) {
  return isNaN(value) || !isFinite(value);
}

export function optimizeString(value = '') {
  return value.replace(/[,\.]0*$/, '').replace(/(^-?\d+[,\.].+[1-9])0+$/, '$1').replace(/^\s*$/,'0');
}

// TODO: Избавиться от parseFloat,
// все подсчеты (в том числе current_number и current_result в файле CalculatorStore) перевести на Decimal.js,
// все будет в стрингах, при необходимости допишу логику обработки стрингов в метод setValue.
export function getNumberFromString(value = '') {
  return value !== '' ? parseFloat(value.replace(',', '.')) : 0;
}

// TODO: изучить более детально возможности данной библиотеки, чтобы скруглять слишком большие/маленькие
// числа к виду NUMBERe+31 / NUMBERe-31
// Пример для теста больших чисел:
// const stringFromNumberResult = new Decimal(88888888888888888888888888888888888.888888888888888888888888);
// console.log(stringFromNumberResult.mul(888888888888888888888.888888888888888888).toFixed());
// Настройки:
// x = new Decimal(255.5)
// x.toExponential(5)              // '2.55500e+2'
// x.toFixed(5)                    // '255.50000'
// x.toPrecision(5)                // '255.50'
// пример для мелких чисел - подобрать
// Настройки:
// precision отвечает за число, до которого скругляем, ближе к делу посмотреть больше настроек
// ВАЖНО!!!! Если придется менять конфиг объекта, то для каждой ф-ей, меняющей конфиг, лучше использовать свой
// объект, а не работать в одном, как я это делаю сейчас, во избежание проблем с некорректным отображением чисел
// пользователю (например, лишние нули).
export function getStringFromNumber(value = 0) {
  const truncPart = (('' + Math.abs(Math.trunc(value))).replace(/^0+$/,'')).length;
  const fracPart = numberResult.setValue(value).modulo(1).toFixed().replace(/^0\.?/,'').length;//.toString();
  return optimizeString(
    numberResult
    .setValue(value)
    .toFixed(Math.min(16 - truncPart < 0 ? 0 : 16 - truncPart, fracPart))
  )
  .replace('.', ',');
}

export function divide(value1, value2) {
  return getNumberFromString(numberResult.setValue(value1).div(value2).toFixed());//.toString()
}

export function sum(value1, value2) {
  return getNumberFromString(numberResult.setValue(value1).plus(value2).toFixed());//.toString()
}

export function multiply(value1, value2) {
  return getNumberFromString(numberResult.setValue(value1).mul(value2).toFixed());//.toString()
}

export function sub(value1, value2) {
  return getNumberFromString(numberResult.setValue(value1).sub(value2).toFixed());//.toString()
}

export function getPercent(value1 , value2) {
  return getNumberFromString(numberResult.setValue(value1).mul(value2).div(100).toFixed());//.toString()
}

export function toggleSign(value) {
  return getNumberFromString(numberResult.setValue(value).neg().toFixed());//.toString()
}
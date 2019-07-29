export function emptyFunc() {}

function getCorrectValue(value) {
  return Math.round( value * Number.MAX_SAFE_INTEGER ) / Number.MAX_SAFE_INTEGER;
}

export function divide(value1, value2) {
  return getCorrectValue(value1 / value2);
}

// 576.3 + 0.443 - даже хак не спасает
export function sum(value1, value2) {
  return getCorrectValue(value1 + value2);
}

export function multiply(value1, value2) {
  return getCorrectValue(value1 * value2);
}

export function sub(value1, value2) {
  return getCorrectValue(value1 - value2);
}

export function getPercent(value1 , value2) {
  return (value1 * value2) / 100;
}
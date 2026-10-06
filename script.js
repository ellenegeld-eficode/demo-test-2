const display = typeof document !== 'undefined' ? document.getElementById('display') : null;

let currentValue = '0';
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

function updateDisplay() {
  if (display) {
    display.textContent = currentValue;
  }
}

function resetCalculator() {
  currentValue = '0';
  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
  updateDisplay();
}

function handleError() {
  currentValue = 'Error';
  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
  updateDisplay();
}

function formatResult(value) {
  if (!Number.isFinite(value)) {
    return value;
  }

  return Number.parseFloat(value.toFixed(10));
}

function performCalculation(a, b, op) {
  const first = Number(a);
  const second = Number(b);

  let result;

  switch (op) {
    case '+':
      result = first + second;
      break;
    case '-':
      result = first - second;
      break;
    case '*':
      result = first * second;
      break;
    case '/':
      if (second === 0) {
        throw new Error('Division by zero');
      }
      result = first / second;
      break;
    case '%':
      if (second === 0) {
        throw new Error('Mod by zero');
      }
      result = first % second;
      break;
    default:
      result = second;
      break;
  }

  return formatResult(result);
}

function inputDigit(digit) {
  if (currentValue === 'Error') {
    currentValue = '0';
  }

  if (waitingForSecondValue) {
    currentValue = digit;
    waitingForSecondValue = false;
  } else if (currentValue === '0' && digit !== '0') {
    currentValue = digit;
  } else {
    currentValue += digit;
  }

  updateDisplay();
}

function inputDecimal() {
  if (currentValue === 'Error') {
    currentValue = '0';
  }

  if (waitingForSecondValue) {
    currentValue = '0.';
    waitingForSecondValue = false;
    updateDisplay();
    return;
  }

  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function handleOperator(nextOperator) {
  if (currentValue === 'Error') {
    return;
  }

  const inputValue = Number(currentValue);

  if (firstValue === null) {
    firstValue = inputValue;
  } else if (operator) {
    try {
      const result = performCalculation(firstValue, inputValue, operator);
      currentValue = String(result);
      firstValue = result;
    } catch (error) {
      handleError();
      return;
    }
  }

  operator = nextOperator;
  waitingForSecondValue = true;
  updateDisplay();
}

function handleEquals() {
  if (currentValue === 'Error' || firstValue === null || !operator) {
    return;
  }

  try {
    const result = performCalculation(firstValue, currentValue, operator);
    currentValue = String(result);
  } catch (error) {
    handleError();
    return;
  }

  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
  updateDisplay();
}

function handlePi() {
  if (currentValue === 'Error') {
    currentValue = '0';
  }

  if (waitingForSecondValue) {
    currentValue = String(Math.PI);
    waitingForSecondValue = false;
    updateDisplay();
    return;
  }

  currentValue = String(Math.PI);
  updateDisplay();
}

function handleDelete() {
  if (currentValue === 'Error') {
    resetCalculator();
    return;
  }

  if (waitingForSecondValue) {
    return;
  }

  currentValue = currentValue.length <= 1 ? '0' : currentValue.slice(0, -1);
  updateDisplay();
}

function handleButtonClick(event) {
  const button = event.target.closest('button');
  if (!button) {
    return;
  }

  const { action, value } = button.dataset;

  if (action === 'number') {
    inputDigit(value);
    return;
  }

  if (action === 'decimal') {
    inputDecimal();
    return;
  }

  if (action === 'pi') {
    handlePi();
    return;
  }

  if (action === 'operator') {
    handleOperator(value);
    return;
  }

  if (action === 'equals') {
    handleEquals();
    return;
  }

  if (action === 'clear') {
    resetCalculator();
    return;
  }

  if (action === 'delete') {
    handleDelete();
  }
}

function handleKeyboardInput(event) {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
    return;
  }

  if (key === '.') {
    inputDecimal();
    return;
  }

  if (['+', '-', '*', '/', '%'].includes(key)) {
    handleOperator(key);
    return;
  }

  if (key.toLowerCase() === 'p') {
    handlePi();
    return;
  }

  if (key === 'Enter' || key === '=') {
    handleEquals();
    return;
  }

  if (key === 'Backspace') {
    handleDelete();
    return;
  }

  if (key.toLowerCase() === 'c') {
    resetCalculator();
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', handleButtonClick);
  document.addEventListener('keydown', handleKeyboardInput);
}

updateDisplay();

if (typeof module !== 'undefined') {
  module.exports = {
    performCalculation,
    handleOperator,
    handlePi,
    resetCalculator,
  };
}

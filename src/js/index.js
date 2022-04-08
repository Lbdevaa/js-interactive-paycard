import "./import/modules"
import "./import/components"

document.addEventListener("DOMContentLoaded", init);

function init() {
  makeCode();
}

function makeCode() {
  const cardNum = document.querySelector('#cardnum')
  const cardNumMaxLength = cardNum.maxLength

  for (let i = 0; i < 4; i++) {
    let codeBlock = document.createElement('div');
    codeBlock.classList.add('code-block');

    for (let j = 0; j < 4; j++) {
      let hash = document.createElement('div');
      hash.classList.add('hash');
      hash.innerHTML = '#';
      codeBlock.appendChild(hash);
    }

    document.querySelector('#code').appendChild(codeBlock);
  }

  // cardNum.addEventListener('keyup', changeCode);
  // cardNum.addEventListener('input', changeCode);
}

const regex = /\D/g;

// TODO: сделать на любой изменение содержимого cardNum

function changeCode(event) {
  // let input = event.target
  let inputValue = event.target.value
  let hashes = document.querySelectorAll('.hash');
}

function changeCode1() {

  document.querySelector('#cardnum').addEventListener('keydown', (e) => {
    setTimeout(() => {
      document.querySelector('#cardnum').value = document.querySelector('#cardnum').value.replaceAll(regex, '');
      if (document.querySelector('#cardnum').value.length > 16) {
        let num = e.target.selectionStart;
        document.querySelector('#cardnum').value = document.querySelector('#cardnum').value.substring(0, 16);
        e.target.selectionStart = num;
        e.target.selectionEnd = num;
      }
      if (document.querySelector('#cardnum').value.length === 0) {
        document.querySelector('#code').innerHTML = '';
        is_new = true;
        makeCode();
        // 8 - каретка удаления
      } else if (e.keyCode == 8 && e.target.selectionStart != 0) {
        let hashes = document.querySelectorAll('.hash');

        for (let i = e.target.selectionStart; i < document.querySelector('#cardnum').value.length; i++) {
          hashes[i].innerHTML = hashes[i + 1].innerHTML;
        }

        hashes[document.querySelector('#cardnum').value.length].preventDefault;
        hashes[document.querySelector('#cardnum').value.length].classList.remove('run-animation');
        void hashes[document.querySelector('#cardnum').value.length].offsetWidth;
        hashes[document.querySelector('#cardnum').value.length].classList.add('run-animation');
        hashes[document.querySelector('#cardnum').value.length].innerHTML = '#';
      } else if (e.keyCode >= 48 && e.keyCode <= 57) {
        let hashes = document.querySelectorAll('.hash');

        for (let i = Math.min(document.querySelector('#cardnum').value.length, 15); i > e.target.selectionStart - 1 && i < 16; i--) {
          hashes[i].innerHTML = hashes[i - 1].innerHTML;
          // console.log(hashes[i]);
          // console.log('3', hashes[i] - 1);
        }

        hashes[e.target.selectionStart - 1].preventDefault;
        hashes[e.target.selectionStart - 1].classList.remove('run-animation');
        void hashes[e.target.selectionStart - 1].offsetWidth;
        if (e.target.selectionStart - 1 < 15 || hashes[e.target.selectionStart - 1].innerHTML == '#') {
          hashes[e.target.selectionStart - 1].classList.add('run-animation');
        }
        hashes[e.target.selectionStart - 1].innerHTML = document.querySelector('#cardnum').value[e.target.selectionStart - 1];
      }

    }, 10)
  })
}

let numberInput = document.querySelector('#cardnum'),
  numberPattern = /^\d{0,16}$/g,
  numberSeparator = " ",
  numberInputOldValue,
  numberInputOldCursor,

  mask = (value, limit, separator) => {
    var output = [];
    for (let i = 0; i < value.length; i++) {
      if (i !== 0 && i % limit === 0) {
        output.push(separator);
      }

      output.push(value[i]);
    }

    return output.join("");
  },
  unmask = (value) => value.replace(/[^\d]/g, ''),
  checkSeparator = (position, interval) => Math.floor(position / (interval + 1)),
  numberInputKeyDownHandler = (e) => {
    let el = e.target;
    numberInputOldValue = el.value;
    numberInputOldCursor = el.selectionEnd;
  },
  numberInputInputHandler = (e) => {
    let el = e.target,
      newValue = unmask(el.value),
      newCursorPosition;

    if (newValue.match(numberPattern)) {
      newValue = mask(newValue, 4, numberSeparator);

      newCursorPosition =
        numberInputOldCursor - checkSeparator(numberInputOldCursor, 4) +
        checkSeparator(numberInputOldCursor + (newValue.length - numberInputOldValue.length), 4) +
        (unmask(newValue).length - unmask(numberInputOldValue).length);

      el.value = (newValue !== "") ? newValue : "";
    } else {
      el.value = numberInputOldValue;
      newCursorPosition = numberInputOldCursor;
    }

    el.setSelectionRange(newCursorPosition, newCursorPosition);

  };

numberInput.addEventListener('keydown', numberInputKeyDownHandler);
numberInput.addEventListener('input', numberInputInputHandler);

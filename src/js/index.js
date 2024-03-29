import "./import/modules"
import "./import/components"

document.addEventListener("DOMContentLoaded", () => {
  makeCode();

  function makeCode() {
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
  }

  let numberInput = document.querySelector('#cardnum'),
    numberPattern = /^\d{0,16}$/g,
    numberSeparator = " ",
    numberInputOldValue,
    numberInputOldCursor,

    highlightType = (value) => {
      let innerCardType = '',
        CardTypePatterns = {
          amex: /^3/,
          visa: /^4/,
          mastercard: /^5/,
          unionpay: /^62/,
          genric: /(^1|^2|^7|^8|^9|^0)/,
        };

      for (const cardType in CardTypePatterns) {
        if (CardTypePatterns[cardType].test(value)) {
          innerCardType = cardType;
          break;
        }
      }
      let activeCC = document.querySelector('.card-item__type-img.active'),
        newActiveCC = document.querySelector(`.card-item__type-img--${innerCardType}`);

      if (activeCC) activeCC.classList.remove('active');
      if (newActiveCC) newActiveCC.classList.add('active');
    },

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
      // e.target -> input
      numberInputOldValue = el.value;
      setTimeout(() => {
        let stepCodeBlock;

        switch (true) {
          case (el.selectionStart <= 4):
            stepCodeBlock = 1
            break;
          case (el.selectionStart > 4 && el.selectionStart <= 9):
            stepCodeBlock = 2
            break;
          case (el.selectionStart > 9 && el.selectionStart <= 14):
            stepCodeBlock = 3
            break;
          case (el.selectionStart > 14 && el.selectionStart <= 19):
            stepCodeBlock = 4
            break;
          default:
            stepCodeBlock = 1
        }

        if (numberInput.value.length === 0) {
          document.querySelector('#code').innerHTML = '';
          makeCode();
        }
        // 8 - каретка удаления
        else if (e.keyCode == 8 && el.selectionStart != 0) {
          let hashes = document.querySelectorAll('.hash');

          for (let i = el.selectionStart; i < numberInput.value.length; i++) {
            hashes[i].innerHTML = hashes[i + 1].innerHTML;
          }

          hashes[numberInput.value.length - stepCodeBlock + 1].preventDefault;
          hashes[numberInput.value.length - stepCodeBlock + 1].classList.remove('run-animation');
          void hashes[numberInput.value.length - stepCodeBlock + 1].offsetWidth;
          hashes[numberInput.value.length - stepCodeBlock + 1].classList.add('run-animation');
          hashes[numberInput.value.length - stepCodeBlock + 1].innerHTML = '#';

        } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
          let hashes = document.querySelectorAll('.hash');
          hashes[el.selectionStart - stepCodeBlock].innerHTML = unmask(el.value)[el.selectionStart - stepCodeBlock];
          hashes[el.selectionStart - stepCodeBlock].classList.add('run-animation');
        }
      }, 5)
      numberInputOldCursor = el.selectionEnd;
      highlightType(el.value);
    },
    numberInputPastHandler = (e) => {
      let el = e.target,
        newValue = unmask(el.value),
        newCursorPosition,
        hashes = document.querySelectorAll('.hash');

      for (let i = 0; i < newValue.split('').length; i++) {
        hashes[i].classList.remove('run-animation');
        hashes[i].classList.add('run-animation');
        hashes[i].innerHTML = newValue[i]
      }

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
      highlightType(el.value);

    };

  numberInput.addEventListener('keydown', numberInputKeyDownHandler);
  numberInput.addEventListener('input', numberInputPastHandler);


});

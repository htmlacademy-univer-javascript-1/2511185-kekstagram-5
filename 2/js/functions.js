// Cheking the length of the string #1
function checkingStrLen(string, strLength) {
  if (string.length <= strLength) {
    return true;
  } else {
    return false;
  }
}

// Tests #1
console.log(checkingStrLen('проверяемая строка', 20));
console.log(checkingStrLen('проверяемая строка', 18));
console.log(checkingStrLen('проверяемая строка', 10));
console.log('_____');

// Searching for palindromes #2
function palindromeSearcher(text) {
  const clearText = text.toLowerCase().replaceAll(' ', '');
  const reverseText = clearText.split('').reverse().join('');

  if (clearText === reverseText) {
    return true;
  } else {
    return false;
  }
}

// Tests #2
console.log(palindromeSearcher('топот'));
console.log(palindromeSearcher('ДовОд'));
console.log(palindromeSearcher('Кекс'));
console.log(palindromeSearcher('Лёша на полке клопа нашёл'));
console.log('_____');

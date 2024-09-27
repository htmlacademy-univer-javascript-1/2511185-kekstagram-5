// Cheking the length of the string #1
function checkingStrLen(string, strLength) {
  if (string.length <= strLength) {
    return true;
  } else {
    return false;
  }
}

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

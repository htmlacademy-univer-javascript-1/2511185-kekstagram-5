const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const getRandomMessages = (messages) => {
  const count = getRandomInteger(1, 2);
  const selectedMessages = new Set();

  while (selectedMessages.size < count) {
    selectedMessages.add(getRandomArrayElement(messages));
  }

  return Array.from(selectedMessages).join(' ');
};

export {getRandomInteger};
export {getRandomArrayElement};
export {getRandomMessages};

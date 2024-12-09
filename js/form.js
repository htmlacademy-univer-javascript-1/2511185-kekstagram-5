const uploadInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const form = document.querySelector('.img-upload__form');
const closeButton = uploadOverlay.querySelector('.img-upload__cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

var pristine = new Pristine(form);
const HASHTAG_PATTERN = /^#[A-Za-zА-Яа-я0-9]{1,20}$/;
let scaleValue = 100;

const isEscapeKey = (evt) => evt.key === 'Escape';

function handleEscapeKey(event) {
  if (isEscapeKey(event) && ![commentInput, hashtagInput].some((el) => el === document.activeElement)) {
    closeForm();
  }
}

function closeForm() {
  document.querySelector('body').classList.remove('modal-open');
  document.removeEventListener('keydown', handleEscapeKey);
  closeButton.removeEventListener('click', closeForm);
  uploadOverlay.classList.add('hidden');
  form.reset();
  scaleValue = 100;
}

function openForm() {
  document.querySelector('body').classList.add('modal-open');
  document.addEventListener('keydown', handleEscapeKey);
  closeButton.addEventListener('click', closeForm);
  uploadOverlay.classList.remove('hidden');
  updateScale();
}

function validateHashtags(value) {
  if (!value) {
    return {valid: true, message: ''};
  }

  const hashtags = value.trim().split(/\s+/);

  if (hashtags.length > 5) {
    return {valid: false, message: 'Превышено количество хэш-тегов'};
  }

  for (const hashtag of hashtags) {
    if (!HASHTAG_PATTERN.test(hashtag)) {
      return {valid: false, message: 'Введён невалидный хэш-тег'};
    }
  }

  const uniqueHashtags = new Set(hashtags.map((hashtag) => hashtag.toLowerCase()));
  if (uniqueHashtags.size !== hashtags.length) {
    return {valid: false, message: 'Хэш-теги повторяются'};
  }

  return {valid: true, message: ''};
}

pristine.addValidator(hashtagInput, (value) => validateHashtags(value).valid, (value) => validateHashtags(value).message);
pristine.addValidator(commentInput, (value) => value.length < 140, 'Длина комментария не может составлять больше 140 символов');

uploadInput.addEventListener('change', openForm);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    form.submit();
  }
});

const scaleControlSmallerButton = form.querySelector('.scale__control--smaller');
const scaleControlBiggerButton = form.querySelector('.scale__control--bigger');
const valueInput = form.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview img');

function updateScale() {
  valueInput.value = `${scaleValue}%`;
  imagePreview.style.transform = `scale(${scaleValue / 100})`;
}

scaleControlSmallerButton.addEventListener('click', () => {
  if (scaleValue > 25) {
    scaleValue -= 25;
    updateScale();
  }
});

scaleControlBiggerButton.addEventListener('click', () => {
  if (scaleValue < 100) {
    scaleValue += 25;
    updateScale();
  }
});




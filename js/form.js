const uploadInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const form = document.querySelector('.img-upload__form');
const closeButton = uploadOverlay.querySelector('.img-upload__cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

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
  updateScale();
}

function openForm() {
  document.querySelector('body').classList.add('modal-open');
  document.addEventListener('keydown', handleEscapeKey);
  closeButton.addEventListener('click', closeForm);
  uploadOverlay.classList.remove('hidden');
  updateScale();
}

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'has-danger',
  successClass: 'has-success',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'form-error'
});

function validateHashtags(value) {
  if (!value) {
    return {valid: true, message: ''};
  }

  const hashtags = value.trim().split(/\s+/);

  if (hashtags.length > 5) {
    return {valid: false, message: 'превышено количество хэш-тегов'};
  }

  for (const hashtag of hashtags) {
    if (!HASHTAG_PATTERN.test(hashtag)) {
      return {valid: false, message: 'введён невалидный хэш-тег'};
    }
  }

  const uniqueHashtags = new Set(hashtags.map((hashtag) => hashtag.toLowerCase()));
  if (uniqueHashtags.size !== hashtags.length) {
    return {valid: false, message: 'хэш-теги повторяются'};
  }

  return {valid: true, message: ''};
}

pristine.addValidator(hashtagInput, (value) => validateHashtags(value).valid, (value) => validateHashtags(value).message);
pristine.addValidator(commentInput, (value) => value.length < 140, 'Длина комментария не может составлять больше 140 символов');

uploadInput.addEventListener('change', () => {
  if (uploadInput.files.length > 0) {
    openForm();
  }
});

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

const sliderElement = document.querySelector('.effect-level__slider');
const effectLevel = document.querySelector('.effect-level__value');
const effectInputs = document.querySelectorAll('input[name="effect"]');
const sliderContainer = document.querySelector('.img-upload__effect-level');
let isUpdatingSlider = false;
let newFilter = false;
sliderContainer.style.display = 'none';

const effectSettings = {
  none: { min: 0, max: 100, step: 1, filter: 'none', unit: '' },
  chrome: { min: 0, max: 1, step: 0.1, filter: 'grayscale', unit: '' },
  sepia: { min: 0, max: 1, step: 0.1, filter: 'sepia', unit: '' },
  marvin: { min: 0, max: 100, step: 1, filter: 'invert', unit: '%' },
  phobos: { min: 0, max: 3, step: 0.1, filter: 'blur', unit: 'px' },
  heat: { min: 1, max: 3, step: 0.1, filter: 'brightness', unit: '' },
};

noUiSlider.create(sliderElement, {
  range: { min: 0, max: 100 },
  start: 100,
  step: 1,
  connect: 'lower',
});

const applyFilter = (filter, value, unit) => {
  if (filter === 'none') {
    imagePreview.style.filter = 'none';
    sliderContainer.style.display = 'none';
  } else {
    imagePreview.style.filter = `${filter}(${value}${unit})`;
    sliderContainer.style.display = 'block';
  }
};

const updateOptions = (min, max, step) => {
  isUpdatingSlider = true;

  sliderElement.noUiSlider.updateOptions({
    range: { min: min, max: max },
    step: step,
  });

  if (effectLevel.value >= max) {
    effectLevel.value = max;
    sliderElement.noUiSlider.set(effectLevel.value);
  }

  isUpdatingSlider = false;
};

const updateImage = () => {
  if (isUpdatingSlider) {
    return;
  }
  const selectedEffect = document.querySelector('input[name="effect"]:checked').value;
  const { min, max, step, filter, unit } = effectSettings[selectedEffect];
  effectLevel.value = newFilter ? 100 : sliderElement.noUiSlider.get();
  newFilter = false;
  updateOptions(min, max, step);
  applyFilter(filter, effectLevel.value, unit);
};

sliderElement.noUiSlider.on('update', () => {
  updateImage();
});

effectInputs.forEach((input) => {
  input.addEventListener('change', () => {
    newFilter = true;
    effectLevel.value = 100;
    sliderElement.noUiSlider.set(100);
    updateImage();
  });
});

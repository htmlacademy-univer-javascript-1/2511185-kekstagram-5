const form = document.querySelector('.img-upload__form');
const scaleControlSmallerButton = form.querySelector('.scale__control--smaller');
const scaleControlBiggerButton = form.querySelector('.scale__control--bigger');
const valueInput = form.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview img');

let scaleValue = 100;

export function updateScale() {
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

export const applyFilter = (filter, value, unit) => {
  if (filter === 'none') {
    imagePreview.style.filter = 'none';
    sliderContainer.style.display = 'none';
  } else {
    imagePreview.style.filter = `${filter}(${value}${unit})`;
    sliderContainer.style.display = 'block';
  }
};

export const updateOptions = (min, max, step) => {
  isUpdatingSlider = true;
  sliderElement.noUiSlider.updateOptions({
    range: { min, max },
    step,
  });
  if (effectLevel.value >= max) {
    effectLevel.value = max;
    sliderElement.noUiSlider.set(max);
  }
  isUpdatingSlider = false;
};

export const updateImage = () => {
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

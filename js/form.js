import { sendPhotoData, fetchPhotos } from './api.js';
import { renderThumbnails } from './rendering-thumbnails.js';
import { pristine } from './formValidator.js';
import { updateScale } from './imageEffects.js';


const uploadInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const form = document.querySelector('.img-upload__form');
const closeButton = uploadOverlay.querySelector('.img-upload__cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const imagePreview = document.querySelector('.img-upload__preview img');
const imgFilters = document.querySelector('.img-filters');
const picturesContainer = document.querySelector('.pictures');

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
  imagePreview.src = 'img/upload-default-image.jpg';
  updateScale();
  pristine.reset();
}

function openForm() {
  document.querySelector('body').classList.add('modal-open');
  document.addEventListener('keydown', handleEscapeKey);
  closeButton.addEventListener('click', closeForm);
  uploadOverlay.classList.remove('hidden');
  updateScale();
}

uploadInput.addEventListener('change', () => {
  if (uploadInput.files.length > 0) {
    const file = uploadInput.files[0];
    const fileReader = new FileReader();

    fileReader.onload = () => {
      imagePreview.src = fileReader.result;
      openForm();
    };

    fileReader.readAsDataURL(file);
  }
});

const showMessage = (type) => {
  const template = document.querySelector(`#${type}`).content.querySelector('section');
  const messageElement = template.cloneNode(true);
  const button = messageElement.querySelector('button');

  const closeMessage = () => messageElement.remove();

  button.addEventListener('click', closeMessage);
  document.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      closeMessage();
    }
  });
  document.addEventListener('click', (evt) => {
    if (evt.target === messageElement) {
      closeMessage();
    }
  });

  document.body.appendChild(messageElement);
};

let allPhotos = [];

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(null, args);
    }, wait);
  };
};

const clearThumbnails = () => {
  const pictureElements = picturesContainer.querySelectorAll('a.picture');
  pictureElements.forEach((pictureElement) => pictureElement.remove());
};

const showRandomImages = () => {
  clearThumbnails();
  const randomPhotos = [...allPhotos].sort(() => Math.random() - 0.5).slice(0, 10);
  renderThumbnails(randomPhotos);
};

const showDiscussedImages = () => {
  clearThumbnails();
  const discussedPhotos = [...allPhotos].sort((a, b) => b.comments.length - a.comments.length);
  renderThumbnails(discussedPhotos);
};

const initFilters = () => {
  imgFilters.classList.remove('img-filters--inactive');

  const handleFilterClick = debounce((evt) => {
    const selectedFilter = evt.target.id;
    imgFilters.querySelectorAll('.img-filters__button').forEach((button) => {
      button.classList.remove('img-filters__button--active');
    });

    evt.target.classList.add('img-filters__button--active');

    switch (selectedFilter) {
      case 'filter-default':
        renderThumbnails(allPhotos);
        break;
      case 'filter-random':
        showRandomImages();
        break;
      case 'filter-discussed':
        showDiscussedImages();
        break;
      default:
        break;
    }
  }, 500);

  imgFilters.querySelectorAll('.img-filters__button').forEach((button) => {
    button.addEventListener('click', handleFilterClick);
  });
};

allPhotos = await fetchPhotos();
renderThumbnails(allPhotos);

const handleFormSubmit = async (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    const submitButton = form.querySelector('.img-upload__submit');
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    const formData = new FormData(form);

    try {
      await sendPhotoData(formData);
      allPhotos = await fetchPhotos();
      renderThumbnails(allPhotos);

      imgFilters.classList.remove('img-filters--inactive');

      initFilters();
      showMessage('success');
      closeForm();
    } catch (error) {
      showMessage('error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Опубликовать';
    }
  }
};

form.addEventListener('submit', handleFormSubmit);

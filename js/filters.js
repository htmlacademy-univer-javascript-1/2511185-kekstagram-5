import { renderThumbnails } from './rendering-thumbnails.js';
import { fetchPhotos } from './api.js';


const imgFilters = document.querySelector('.img-filters');
const picturesContainer = document.querySelector('.pictures');

let allPhotos = [];

const clearThumbnails = () => {
  picturesContainer.innerHTML = '';
};

const showDefaultImages = () => {
  clearThumbnails();
  renderThumbnails(allPhotos);
};

const showRandomImages = () => {
  clearThumbnails();
  const randomPhotos = [...allPhotos]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
  renderThumbnails(randomPhotos);
};

const showDiscussedImages = () => {
  clearThumbnails();
  const discussedPhotos = [...allPhotos].sort((a, b) => b.comments.length - a.comments.length);
  renderThumbnails(discussedPhotos);
};

const initFilters = () => {
  imgFilters.classList.remove('img-filters--inactive');

  const debounce = (callback, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    };
  };

  const handleFilterClick = debounce((evt) => {
    const selectedFilter = evt.target.id;

    imgFilters.querySelectorAll('.img-filters__button').forEach((button) => {
      button.classList.remove('img-filters__button--active');
    });

    evt.target.classList.add('img-filters__button--active');

    switch (selectedFilter) {
      case 'filter-default':
        showDefaultImages();
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

const loadPhotos = async () => {
  try {
    allPhotos = await fetchPhotos();
    showDefaultImages();
    initFilters();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка загрузки изображений:', error);
  }
};

loadPhotos();

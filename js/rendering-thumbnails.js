import { fetchPhotos } from './api.js';
import { openBigPicture } from './big-picture.js';

const pictureTemplateContent = document.querySelector('#picture').content.querySelector('a');
const fragment = document.createDocumentFragment();

const renderThumbnails = async () => {
  try {
    const photos = await fetchPhotos();

    photos.forEach(({ url, description, likes, comments }) => {
      const pictureElement = pictureTemplateContent.cloneNode(true);

      const thumbnail = pictureElement.querySelector('img');
      thumbnail.src = url;
      thumbnail.alt = description;

      const pictureLikes = pictureElement.querySelector('.picture__likes');
      pictureLikes.textContent = likes;

      const pictureComments = pictureElement.querySelector('.picture__comments');
      pictureComments.textContent = comments.length;

      fragment.appendChild(pictureElement);

      pictureElement.addEventListener('click', (evt) => {
        evt.preventDefault();
        openBigPicture(url, description, likes, comments);
      });
    });

    const picturesContainer = document.querySelector('.pictures');
    picturesContainer.appendChild(fragment);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка загрузки миниатюр:', error);
    // рендеринг сообщения об ошибке
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = 'Не удалось загрузить миниатюры.';
    document.body.appendChild(errorElement);
  }
};

renderThumbnails();

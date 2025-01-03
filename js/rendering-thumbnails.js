import { openBigPicture } from './big-picture.js';

const pictureTemplateContent = document.querySelector('#picture').content.querySelector('a');
const fragment = document.createDocumentFragment();

export const renderThumbnails = (photos) => {
  const picturesContainer = document.querySelector('.pictures');

  const pictureElements = picturesContainer.querySelectorAll('a.picture');
  pictureElements.forEach((pictureElement) => pictureElement.remove());

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

  picturesContainer.appendChild(fragment);
};

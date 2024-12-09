import { createPhotosArray } from './data.js';
import { openBigPicture } from './big-picture.js';

const pictureTemplateContent = document.querySelector('#picture').content.querySelector('a');
const fragment = document.createDocumentFragment();
const createdPictures = createPhotosArray();

createdPictures.forEach(({url, description, likes, comments}) => {
  const pictureElement = pictureTemplateContent.cloneNode(true);

  const thumbnail = pictureElement.querySelector('img');
  thumbnail.src = url;
  thumbnail.alt = description;

  const pictureLikes = pictureElement.querySelector('.picture__likes');
  pictureLikes.textContent = likes;

  const pictureComments = pictureElement.querySelector('.picture__comments');
  pictureComments.textContent = comments;

  fragment.appendChild(pictureElement);

  pictureElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture(url, description, likes, comments);
  });
});

const picturesContainer = document.querySelector('.pictures');
picturesContainer.appendChild(fragment);

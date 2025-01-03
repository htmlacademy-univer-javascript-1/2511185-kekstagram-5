const form = document.querySelector('.img-upload__form');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

const HASHTAG_PATTERN = /^#[A-Za-zА-Яа-я0-9]{1,20}$/;

export const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'has-danger',
  successClass: 'has-success',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'form-error'
});

export function validateHashtags(value) {
  if (!value) {
    return { valid: true, message: '' };
  }
  const hashtags = value.trim().split(/\s+/);
  if (hashtags.length > 5) {
    return { valid: false, message: 'Превышено количество хэш-тегов' };
  }
  for (const hashtag of hashtags) {
    if (!HASHTAG_PATTERN.test(hashtag)) {
      return { valid: false, message: 'Введён невалидный хэш-тег' };
    }
  }
  const uniqueHashtags = new Set(hashtags.map((hashtag) => hashtag.toLowerCase()));
  if (uniqueHashtags.size !== hashtags.length) {
    return { valid: false, message: 'Хэш-теги повторяются' };
  }
  return { valid: true, message: '' };
}

pristine.addValidator(hashtagInput, (value) => validateHashtags(value).valid, (value) => validateHashtags(value).message);
pristine.addValidator(commentInput, (value) => value.length <= 140, 'Длина комментария не может составлять больше 140 символов');

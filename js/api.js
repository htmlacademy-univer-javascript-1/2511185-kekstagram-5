const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

// получаем данные
export const fetchPhotos = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/data`);
    if (!response.ok) {
      throw new Error('Не удалось загрузить данные');
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    throw error;
  }
};

// отправляем данные
export const sendPhotoData = async (formData) => {
  try {
    const response = await fetch(`${SERVER_URL}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Не удалось отправить данные');
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка отправки данных:', error);
    throw error;
  }
};

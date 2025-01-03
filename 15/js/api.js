const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

// Получение данных
export const fetchPhotos = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/data`);
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    document.body.insertAdjacentHTML('beforeend', `
      <section class="error">
        <div class="error__inner">
          <h2 class="error__title">${error.message}</h2>
          <button type="button" class="error__button" onclick="location.reload()">Попробовать ещё раз</button>
        </div>
      </section>
    `);
    throw error;
  }
};

// Отправка данных
export const sendPhotoData = async (formData) => {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    document.body.insertAdjacentHTML('beforeend', `
      <section class="error">
        <div class="error__inner">
          <h2 class="error__title">${error.message}</h2>
          <button type="button" class="error__button">Попробовать ещё раз</button>
        </div>
      </section>
    `);
    throw error;
  }
};

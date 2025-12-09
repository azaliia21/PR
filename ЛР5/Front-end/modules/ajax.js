// Модернизированный класс для работы с API через Fetch и async/await
class Ajax {
  /**
   * GET запрос
   * @param {string} url - Адрес запроса
   * @returns {Promise<any>} - Данные ответа
   */
  async get(url) {
    try {
      console.log(`📤 GET запрос: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📥 GET успешен:', data);
      return data;
    } catch (error) {
      console.error('❌ GET ошибка:', error);
      throw error;
    }
  }

  /**
   * POST запрос
   * @param {string} url - Адрес запроса
   * @param {object} data - Данные для отправки
   * @returns {Promise<any>} - Данные ответа
   */
  async post(url, data) {
    try {
      console.log(`📤 POST запрос: ${url}`, data);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('📥 POST успешен:', responseData);
      return responseData;
    } catch (error) {
      console.error('❌ POST ошибка:', error);
      throw error;
    }
  }

  /**
   * PATCH запрос
   * @param {string} url - Адрес запроса
   * @param {object} data - Данные для обновления
   * @returns {Promise<any>} - Данные ответа
   */
  async patch(url, data) {
    try {
      console.log(`📤 PATCH запрос: ${url}`, data);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('📥 PATCH успешен:', responseData);
      return responseData;
    } catch (error) {
      console.error('❌ PATCH ошибка:', error);
      throw error;
    }
  }

  /**
   * DELETE запрос
   * @param {string} url - Адрес запроса
   * @returns {Promise<void>}
   */
  async delete(url) {
    try {
      console.log(`📤 DELETE запрос: ${url}`);
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      console.log('📥 DELETE успешен');
      return;
    } catch (error) {
      console.error('❌ DELETE ошибка:', error);
      throw error;
    }
  }
}

// Экспортируем объект для использования в других файлах
export const ajax = new Ajax();
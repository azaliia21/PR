// Класс для хранения всех URL адресов
class SubjectUrls {
  constructor() {
    this.baseUrl = 'http://localhost:3000'; // Адрес нашего сервера
  }

  // Получить все предметы
  getSubjects() {
    return `${this.baseUrl}/subjects`;
  }

  // Получить предмет по ID
  getSubjectById(id) {
    return `${this.baseUrl}/subjects/${id}`;
  }

  // Создать предмет
  createSubject() {
    return `${this.baseUrl}/subjects`;
  }

  // Удалить предмет по ID
  removeSubjectById(id) {
    return `${this.baseUrl}/subjects/${id}`;
  }

  // Обновить предмет по ID
  updateSubjectById(id) {
    return `${this.baseUrl}/subjects/${id}`;
  }
}

// Экспортируем объект
export const subjectUrls = new SubjectUrls();
import { SubjectCardComponent } from "../../components/subject-card/index.js";
import { SubjectPage } from "../subject/index.js";
import { ajax } from "../../modules/ajax.js";
import { subjectUrls } from "../../modules/subjectUrls.js";

export class MainPage {
  constructor(parent) {
    this.parent = parent;
  }

  get pageRoot() {
    return document.getElementById('main-page');
  }

  getHTML() {
    return `
      <div class="container mt-4">
        <h1 class="text-center mb-4">📚 Учебные предметы (ЛР6 - Fetch)</h1>
        <p class="text-center text-muted mb-4">Используется Fetch API с async/await</p>
        
        <!-- Форма для добавления нового предмета -->
        <div class="card mb-4">
          <div class="card-header bg-success text-white">
            <h5>Добавить новый предмет</h5>
          </div>
          <div class="card-body">
            <form id="create-subject-form">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="subject-title" class="form-label">Название предмета</label>
                  <input type="text" class="form-control" id="subject-title" required 
                         placeholder="Введите название предмета">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="subject-teacher" class="form-label">Преподаватель</label>
                  <input type="text" class="form-control" id="subject-teacher" required 
                         placeholder="ФИО преподавателя">
                </div>
              </div>
              <div class="mb-3">
                <label for="subject-description" class="form-label">Описание</label>
                <textarea class="form-control" id="subject-description" rows="2" 
                          placeholder="Краткое описание предмета"></textarea>
              </div>
              <button type="submit" class="btn btn-success">
                <span class="spinner-border spinner-border-sm d-none" id="create-spinner"></span>
                Добавить предмет
              </button>
            </form>
          </div>
        </div>
        
        <!-- Состояние загрузки -->
        <div id="loading-state" class="text-center d-none">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p class="mt-2">Загружаем предметы с сервера...</p>
        </div>
        
        <!-- Здесь появятся карточки предметов -->
        <div id="main-page" class="d-flex flex-wrap justify-content-center"></div>
        
        <!-- Сообщение об ошибке -->
        <div id="error-message" class="alert alert-danger d-none mt-3" role="alert">
          Ошибка при загрузке данных. Проверьте подключение к серверу.
        </div>
      </div>
    `;
  }

  // Получаем данные с сервера через async/await
  async getData() {
    try {
      // Показываем индикатор загрузки
      document.getElementById('loading-state').classList.remove('d-none');
      document.getElementById('error-message').classList.add('d-none');
      
      // Используем новый метод с async/await
      const data = await ajax.get(subjectUrls.getSubjects());
      
      // Скрываем индикатор загрузки
      document.getElementById('loading-state').classList.add('d-none');
      
      // Отображаем данные
      this.renderData(data);
      
    } catch (error) {
      console.error('Ошибка в getData:', error);
      document.getElementById('loading-state').classList.add('d-none');
      document.getElementById('error-message').classList.remove('d-none');
    }
  }

  // Отображаем карточки предметов
  renderData(items) {
    // Очищаем контейнер
    this.pageRoot.innerHTML = '';
    
    if (items.length === 0) {
      this.pageRoot.innerHTML = `
        <div class="alert alert-info w-100 text-center">
          Предметов пока нет. Добавьте первый предмет!
        </div>
      `;
      return;
    }
    
    items.forEach((item) => {
      const subjectCard = new SubjectCardComponent(this.pageRoot);
      subjectCard.render(item, this.clickCard.bind(this));
    });
  }

  // Обработчик клика по карточке
  clickCard(e) {
    const cardId = e.target.dataset.id;
    const subjectPage = new SubjectPage(this.parent, cardId);
    subjectPage.render();
  }

  // Создание нового предмета через async/await
  async createSubject(event) {
    event.preventDefault();
    
    const title = document.getElementById('subject-title').value;
    const teacher = document.getElementById('subject-teacher').value;
    const description = document.getElementById('subject-description').value;
    
    // Валидация
    if (!title.trim() || !teacher.trim()) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }
    
    // Показываем спиннер
    const spinner = document.getElementById('create-spinner');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    spinner.classList.remove('d-none');
    submitBtn.disabled = true;
    
    const newSubject = {
      title: title,
      teacher: teacher,
      shortDescription: description || "Новый учебный предмет",
      images: [
        "https://i.pinimg.com/736x/4c/95/e4/4c95e468f1a031544bc201e7ba64725d.jpg",
        "https://i.pinimg.com/1200x/9f/7b/33/9f7b3339a2380c961269f4002330e16b.jpg"
      ],
      description: description || "Описание нового учебного предмета",
      difficulty: "Средняя",
      materials: "Учебники, тетради, методические материалы"
    };
    
    try {
      // Используем новый метод с async/await
      const data = await ajax.post(subjectUrls.createSubject(), newSubject);
      
      alert(`✅ Предмет "${data.title}" успешно добавлен!`);
      document.getElementById('create-subject-form').reset();
      
      // Обновляем список предметов
      await this.getData();
      
    } catch (error) {
      console.error('Ошибка при добавлении предмета:', error);
      alert('❌ Ошибка при добавлении предмета. Проверьте консоль.');
    } finally {
      // Скрываем спиннер
      spinner.classList.add('d-none');
      submitBtn.disabled = false;
    }
  }

  render() {
    this.parent.innerHTML = '';
    const html = this.getHTML();
    this.parent.insertAdjacentHTML('beforeend', html);
    
    // Добавляем обработчик формы
    document.getElementById('create-subject-form').addEventListener('submit', 
      this.createSubject.bind(this));
    
    // Загружаем данные
    this.getData();
  }
}
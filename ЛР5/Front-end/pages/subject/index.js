import { BackButtonComponent } from "../../components/back-button/index.js";
import { SubjectDetailComponent } from "../../components/subject-detail/index.js";
import { CarouselComponent } from "../../components/carousel/index.js";
import { MainPage } from "../main/index.js";
import { ajax } from "../../modules/ajax.js";
import { subjectUrls } from "../../modules/subjectUrls.js";

export class SubjectPage {
  constructor(parent, id) {
    this.parent = parent;
    this.id = id;
  }

  get pageRoot() {
    return document.getElementById('subject-page');
  }

  getHTML() {
    return `
      <div class="container mt-4">
        <div id="subject-page"></div>
      </div>
    `;
  }

  // Получаем данные о предмете с сервера
  getData() {
    ajax.get(subjectUrls.getSubjectById(this.id), (data, status) => {
      if (status === 200 && data) {
        this.renderData(data);
        this.renderUpdateForm(data);
      } else {
        console.error('Ошибка загрузки данных:', status);
        this.pageRoot.innerHTML = '<p class="text-danger">Ошибка загрузки данных</p>';
      }
    });
  }

  // Отображаем информацию о предмете
  renderData(item) {
    const subjectDetail = new SubjectDetailComponent(this.pageRoot);
    subjectDetail.render(item);

    const carousel = new CarouselComponent(this.pageRoot);
    carousel.render(item);
  }

  // Форма для редактирования предмета
  renderUpdateForm(data) {
    const formHtml = `
      <div class="card mt-4">
        <div class="card-header">
          <h4>Редактировать предмет</h4>
        </div>
        <div class="card-body">
          <form id="update-subject-form">
            <div class="mb-3">
              <label for="edit-title" class="form-label">Название</label>
              <input type="text" class="form-control" id="edit-title" value="${data.title}">
            </div>
            <div class="mb-3">
              <label for="edit-teacher" class="form-label">Преподаватель</label>
              <input type="text" class="form-control" id="edit-teacher" value="${data.teacher}">
            </div>
            <div class="mb-3">
              <label for="edit-difficulty" class="form-label">Сложность</label>
              <select class="form-select" id="edit-difficulty">
                <option value="Низкая" ${data.difficulty === 'Низкая' ? 'selected' : ''}>Низкая</option>
                <option value="Средняя" ${data.difficulty === 'Средняя' ? 'selected' : ''}>Средняя</option>
                <option value="Высокая" ${data.difficulty === 'Высокая' ? 'selected' : ''}>Высокая</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Сохранить изменения</button>
            <button type="button" id="delete-button" class="btn btn-danger ms-2">Удалить предмет</button>
          </form>
        </div>
      </div>
    `;

    const formContainer = document.createElement('div');
    formContainer.innerHTML = formHtml;
    this.pageRoot.appendChild(formContainer);

    // Обработчики событий
    document.getElementById('update-subject-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.updateSubject();
    });

    document.getElementById('delete-button').addEventListener('click', () => {
      if (confirm('Удалить этот предмет?')) {
        this.deleteSubject();
      }
    });
  }

  // Обновление предмета
  updateSubject() {
    const updatedData = {
      title: document.getElementById('edit-title').value,
      teacher: document.getElementById('edit-teacher').value,
      difficulty: document.getElementById('edit-difficulty').value
    };

    ajax.patch(subjectUrls.updateSubjectById(this.id), updatedData, (data, status) => {
      if (status === 200) {
        alert('Предмет обновлен!');
        this.getData(); // Перезагружаем данные
      } else {
        alert('Ошибка при обновлении');
      }
    });
  }

  // Удаление предмета
  deleteSubject() {
    ajax.delete(subjectUrls.removeSubjectById(this.id), (data, status) => {
      if (status === 204) {
        alert('Предмет удален!');
        this.clickBack();
      } else {
        alert('Ошибка при удалении');
      }
    });
  }

  // Возврат на главную
  clickBack() {
    const mainPage = new MainPage(this.parent);
    mainPage.render();
  }

  render() {
    this.parent.innerHTML = '';
    const html = this.getHTML();
    this.parent.insertAdjacentHTML('beforeend', html);

    const backButton = new BackButtonComponent(this.pageRoot);
    backButton.render(this.clickBack.bind(this));

    this.getData();
  }
}
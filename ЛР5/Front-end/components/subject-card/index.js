// Карточка предмета для главной страницы
export class SubjectCardComponent {
  constructor(parent) {
    this.parent = parent; // Родительский элемент, куда вставлять карточку
  }

  getHTML(data) {
    return `
      <div class="card m-2" style="width: 18rem;">
        <img src="${data.images[0]}" class="card-img-top" alt="${data.title}" 
             style="height: 180px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${data.title}</h5>
          <p class="card-text">${data.shortDescription}</p>
          <button class="btn btn-primary" id="click-card-${data.id}" data-id="${data.id}">
            Подробнее
          </button>
        </div>
      </div>
    `;
  }

  addListeners(data, listener) {
    // Добавляем обработчик нажатия на кнопку
    document.getElementById(`click-card-${data.id}`).addEventListener("click", listener);
  }

  render(data, listener) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML('beforeend', html);
    this.addListeners(data, listener);
  }
}
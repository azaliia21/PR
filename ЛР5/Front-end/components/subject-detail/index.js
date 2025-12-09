// Детальная информация о предмете
export class SubjectDetailComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    return `
      <div class="card">
        <div class="card-body">
          <h2 class="card-title">${data.title}</h2>
          <p class="card-text"><strong>Описание:</strong> ${data.description}</p>
          <p class="card-text"><strong>Сложность:</strong> ${data.difficulty}</p>
          <p class="card-text"><strong>Материалы:</strong> ${data.materials}</p>
          <p class="card-text"><strong>Преподаватель:</strong> ${data.teacher}</p>
        </div>
      </div>
    `;
  }

  render(data) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML('beforeend', html);
  }
}
// Карусель с изображениями
export class CarouselComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    let indicators = '';
    let items = '';
    
    // Создаём индикаторы и слайды для карусели
    data.images.forEach((image, index) => {
      const isActive = index === 0 ? 'active' : '';
      
      indicators += `
        <button type="button" data-bs-target="#carousel-${data.id}" 
                data-bs-slide-to="${index}" class="${isActive}" 
                aria-label="Slide ${index + 1}"></button>
      `;
      
      items += `
        <div class="carousel-item ${isActive}">
          <div class="d-flex justify-content-center">
            <img src="${image}" class="img-fluid" alt="${data.title}" 
                 style="max-height: 400px; width: auto;">
          </div>
        </div>
      `;
    });

    return `
      <div class="mt-4">
        <h3>Галерея изображений</h3>
        <div id="carousel-${data.id}" class="carousel slide" data-bs-ride="carousel" 
             style="max-width: 600px; margin: 0 auto;">
          <div class="carousel-indicators">${indicators}</div>
          <div class="carousel-inner rounded shadow">${items}</div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${data.id}" 
                  data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carousel-${data.id}" 
                  data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    `;
  }

  render(data) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML('beforeend', html);
  }
}
export default function decorate(block) {
  const slides = [...block.children];

  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((slide) => {
    slide.classList.add('carousel-slide');
    track.append(slide);
  });

  block.textContent = '';
  block.append(track);

  let index = 0;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '<';
  prevBtn.className = 'carousel-btn prev';

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '>';
  nextBtn.className = 'carousel-btn next';

  block.append(prevBtn, nextBtn);

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  prevBtn.addEventListener('click', () => {
    index = (index === 0) ? slides.length - 1 : index - 1;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    index = (index === slides.length - 1) ? 0 : index + 1;
    updateCarousel();
  });

  // Auto slide (optional)
  setInterval(() => {
    index = (index === slides.length - 1) ? 0 : index + 1;
    updateCarousel();
  }, 4000);
}
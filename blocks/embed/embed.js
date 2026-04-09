function getVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    return u.searchParams.get('v');
  } catch {
    return '';
  }
}

function openPopup(url) {
  const id = getVideoId(url);
  if (!id) return;

  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <button class="popup-close" aria-label="Close">×</button>
    <div class="popup-box">
      <iframe
        src="https://www.youtube.com/embed/${id}?autoplay=1"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  `;

  const close = () => popup.remove();

  popup.querySelector('.popup-close').onclick = close;
  popup.onclick = (e) => {
    if (e.target === popup) close();
  };

  document.body.append(popup);
}

function makeTag(text) {
  const span = document.createElement('span');
  span.className = 'card-tag';
  span.textContent = text.trim();
  return span;
}

export default function decorate(block) {
  if (!block.classList.contains('cards')) return;

  const wrap = document.createElement('div');
  wrap.className = 'cards-wrap';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 4) return;

    const imageCell = cells[0];
    const link = cells[1].textContent.trim();
    const title = cells[2].textContent.trim();
    const tags = cells[3].textContent.trim();

    if (!imageCell.querySelector('img') || !link) return;

    const card = document.createElement('article');
    card.className = 'card-item';

    const heading = document.createElement('h3');
    heading.className = 'card-title';
    heading.textContent = title;

    const thumb = document.createElement('button');
    thumb.className = 'card-thumb';
    thumb.type = 'button';
    thumb.innerHTML = imageCell.innerHTML;
    thumb.onclick = () => openPopup(link);

    const tagsWrap = document.createElement('div');
    tagsWrap.className = 'card-tags';

    tags.split(',').forEach((tag) => {
      if (tag.trim()) tagsWrap.append(makeTag(tag));
    });

    card.append(heading, thumb, tagsWrap);
    wrap.append(card);
  });

  block.textContent = '';
  block.append(wrap);
}

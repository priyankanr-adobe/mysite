function toClassName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getVideoId(url) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1);
    }

    return parsed.searchParams.get('v') || '';
  } catch {
    return '';
  }
}

function bindEscToClose(close) {
  const onEsc = (e) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onEsc);
    }
  };

  document.addEventListener('keydown', onEsc);
}

function openVideoPopup(url) {
  const id = getVideoId(url);
  if (!id) return;

  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="popup-box">
      <button class="popup-close" type="button" aria-label="Close">
        <img src="/icons/close_white.svg" alt="" />
      </button>
      <iframe
        src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
        title="YouTube video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  `;

  const close = () => {
    popup.remove();
    document.body.classList.remove('popup-open');
  };

  popup.querySelector('.popup-close').addEventListener('click', close);
  popup.addEventListener('click', (e) => {
    if (e.target === popup) close();
  });

  bindEscToClose(close);

  document.body.classList.add('popup-open');
  document.body.append(popup);
}

function openImagePopup(imageMarkup) {
  const popup = document.createElement('div');
  popup.className = 'popup image-popup';
  popup.innerHTML = `
    <div class="popup-box image-popup-box">
      <button class="popup-close" type="button" aria-label="Close">
        <img src="/icons/close_white.svg" alt="" />
      </button>
      <div class="image-popup-content">${imageMarkup}</div>
    </div>
  `;

  const close = () => {
    popup.remove();
    document.body.classList.remove('popup-open');
  };

  popup.querySelector('.popup-close').addEventListener('click', close);
  popup.addEventListener('click', (e) => {
    if (e.target === popup) close();
  });

  bindEscToClose(close);

  document.body.classList.add('popup-open');
  document.body.append(popup);
}

function makeImageZoomable(mediaWrapper) {
  const img = mediaWrapper.querySelector('img, picture');
  if (!img) return;

  mediaWrapper.classList.add('zoomable');
  mediaWrapper.setAttribute('role', 'button');
  mediaWrapper.setAttribute('tabindex', '0');
  mediaWrapper.setAttribute('aria-label', 'Open image preview');

  const open = () => openImagePopup(mediaWrapper.innerHTML);

  mediaWrapper.addEventListener('click', open);
  mediaWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
}

function readSectionMetadata(block) {
  const section = block.closest('.section');
  const metadataBlock = section ? section.querySelector('.section-metadata') : null;
  const metadata = {};

  if (!metadataBlock) return metadata;

  [...metadataBlock.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const key = toClassName(cells[0].textContent || '');
    const value = cells[1].innerHTML.trim();

    if (key) metadata[key] = value;
  });

  return metadata;
}

function createKnowledgeRepoHeader(block) {
  const metadata = readSectionMetadata(block);
  const heading = metadata['repo-heading'];
  const subheading = metadata['repo-subheading'];

  if (!heading && !subheading) return null;

  const header = document.createElement('div');
  header.className = 'knowledge-repo-header';

  if (heading) {
    const h2 = document.createElement('h2');
    h2.className = 'knowledge-repo-heading';
    h2.innerHTML = heading;
    header.append(h2);
  }

  if (subheading) {
    const p = document.createElement('p');
    p.className = 'knowledge-repo-subheading';
    p.innerHTML = subheading;
    header.append(p);
  }

  return header;
}

function decorateVideoCard(card, textCell, mediaCell) {
  const labels = mediaCell.innerText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const images = [...mediaCell.querySelectorAll('picture, img')];
  const urls = textCell.innerText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('http'));

  const list = document.createElement('ul');
  list.className = 'video-list';

  images.forEach((imgNode, index) => {
    const label = labels[index] || `Video ${index + 1}`;
    const url = urls[index];
    if (!url) return;

    const item = document.createElement('li');
    item.className = 'video-list-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Open video: ${label}`);

    const thumb = document.createElement('div');
    thumb.className = 'video-thumb';
    thumb.innerHTML = imgNode.outerHTML;

    const text = document.createElement('span');
    text.className = 'video-label';
    text.textContent = label;

    const open = () => openVideoPopup(url);

    item.append(thumb, text);
    item.addEventListener('click', open);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });

    list.append(item);
  });

  card.append(list);
}

function decorateStandardRepoCard(card, textCell, mediaCell) {
  if (mediaCell.querySelector('picture, img')) {
    const media = document.createElement('div');
    media.className = 'repo-card-media';
    media.innerHTML = mediaCell.innerHTML;
    makeImageZoomable(media);
    card.append(media);
  }

  const description = textCell.innerText.trim();
  if (description) {
    const desc = document.createElement('p');
    desc.className = 'repo-card-description';
    desc.textContent = description;
    card.append(desc);
  }
}

function decorateKnowledgeRepo(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const shell = document.createElement('div');
  shell.className = 'knowledge-repo-shell';

  const header = createKnowledgeRepoHeader(block);
  if (header) shell.append(header);

  const grid = document.createElement('div');
  grid.className = 'knowledge-repo-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 4) return;

    const [titleCell, metaCell, textCell, mediaCell] = cells;
    const title = titleCell.textContent.trim();

    const metaParts = metaCell.innerText
      .split('\n')
      .map((part) => part.trim())
      .filter(Boolean);

    const type = metaParts[metaParts.length - 1] || '';
    const subtitle = type === 'video-list'
      ? metaParts.slice(0, -1).join(' ')
      : metaParts.join(' ');

    const card = document.createElement('article');
    card.className = 'repo-card';

    if (title) {
      const heading = document.createElement('h3');
      heading.className = 'repo-card-title';
      heading.textContent = title;
      card.append(heading);
    }

    if (subtitle) {
      const sub = document.createElement('p');
      sub.className = 'repo-card-subtitle';
      sub.textContent = subtitle;
      card.append(sub);
    }

    if (type === 'video-list') {
      decorateVideoCard(card, textCell, mediaCell);
    } else {
      decorateStandardRepoCard(card, textCell, mediaCell);
    }

    grid.append(card);
  });

  shell.append(grid);
  block.textContent = '';
  block.append(shell);
}

function decorateDefault(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    while (row.firstElementChild) {
      const child = row.firstElementChild;
      child.className = child.querySelector('picture') ? 'cards-card-image' : 'cards-card-body';
      li.append(child);
    }

    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) => {
    img.loading = 'lazy';
  });

  block.textContent = '';
  block.append(ul);
}

export default function decorate(block) {
  if (block.classList.contains('knowledge-repo')) {
    decorateKnowledgeRepo(block);
    return;
  }

  decorateDefault(block);
}

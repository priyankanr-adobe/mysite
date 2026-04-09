function getYouTubeId(url) {
  try {
    const u = new URL(url);

    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace('/', '');
    }

    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v');
    }

    return null;
  } catch (e) {
    return null;
  }
}

function createIframe(videoId, autoplay = false) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1&rel=0' : '?rel=0'}`;
  iframe.title = 'YouTube video player';
  iframe.loading = 'lazy';
  iframe.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  return iframe;
}

function openLightbox(videoId) {
  const overlay = document.createElement('div');
  overlay.className = 'video-gallery-overlay';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'video-gallery-close';
  closeBtn.setAttribute('aria-label', 'Close video');
  closeBtn.textContent = '×';

  const frameWrapper = document.createElement('div');
  frameWrapper.className = 'video-gallery-overlay-frame';

  const iframe = createIframe(videoId, true);
  frameWrapper.append(iframe);

  overlay.append(closeBtn, frameWrapper);
  document.body.append(overlay);
  document.body.classList.add('video-gallery-no-scroll');

  const closeOverlay = () => {
    overlay.remove();
    document.body.classList.remove('video-gallery-no-scroll');
  };

  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  document.addEventListener(
    'keydown',
    function escHandler(e) {
      if (e.key === 'Escape') {
        closeOverlay();
        document.removeEventListener('keydown', escHandler);
      }
    },
    { once: true },
  );
}

export default function decorate(block) {
  const rows = [...block.children];
  const links = rows
    .map((row) => row.querySelector('a'))
    .filter(Boolean);

  block.textContent = '';

  const list = document.createElement('div');
  list.className = 'video-gallery-list';

  links.forEach((link) => {
    const videoId = getYouTubeId(link.href);
    if (!videoId) return;

    const item = document.createElement('div');
    item.className = 'video-gallery-item';

    const thumb = document.createElement('button');
    thumb.className = 'video-gallery-thumb';
    thumb.type = 'button';
    thumb.setAttribute('aria-label', 'Open video');

    const img = document.createElement('img');
    img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    img.alt = 'Video thumbnail';
    img.loading = 'lazy';

    const play = document.createElement('span');
    play.className = 'video-gallery-play';
    play.textContent = '▶';

    thumb.append(img, play);
    thumb.addEventListener('click', () => openLightbox(videoId));

    item.append(thumb);
    list.append(item);
  });

  block.append(list);
}
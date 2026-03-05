export default function decorate(block) {
  if (block.children.length < 2) return;
  const titleRow = block.children[0];
  const contentRow = block.children[1];
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-wrapper';
  // Title
  const h1 = document.createElement('h1');
  h1.className = 'hero-title';
  h1.textContent = titleRow.textContent.trim();
  wrapper.append(h1);
  // Image
  const img = contentRow.querySelector('img');
  if (img) {
    img.className = 'hero-image';
    wrapper.append(img);
  }
  // Overlay text
  const text = contentRow.textContent.replace(img?.alt || '', '').trim();
  if (text) {
    const overlay = document.createElement('div');
    overlay.className = 'hero-text-overlay';
    overlay.textContent = text;
    wrapper.append(overlay);
  }
  block.textContent = '';
  block.append(wrapper);
}
 
export default function decorate(block) {
  const link = block.querySelector('a');
  const image = block.querySelector('img');
  if (!link) return;
  const url = link.href;
  const wrapper = document.createElement('div');
  wrapper.className = 'embed-wrapper';
  // If image exists → use as thumbnail
  if (image) {
    image.classList.add('embed-thumbnail');
    wrapper.appendChild(image); 
    wrapper.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = convertToEmbedURL(url);
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('allowfullscreen', true);
      wrapper.innerHTML = '';
      wrapper.appendChild(iframe);
    });
  } else {
    // If no image → load iframe directly
    const iframe = document.createElement('iframe');
    iframe.src = convertToEmbedURL(url);
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allowfullscreen', true);
    wrapper.appendChild(iframe);
  }
  block.innerHTML = '';
  block.appendChild(wrapper);
} 
// Convert URL to embed if needed
function convertToEmbedURL(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return videoId
      ? `https://www.youtube.com/embed/${videoId[1]}?autoplay=1`
      : url;
  }
  if (url.includes('google.com/maps')) {
    return url.replace('/maps/', '/maps/embed/');
  }
  return url;
}

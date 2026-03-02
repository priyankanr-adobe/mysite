export default function decorate(block) {
  const link = block.querySelector('a');

  if (!link) return;

  const url = link.href;

  // Clear existing content
  block.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'embed-wrapper';

  let iframe = document.createElement('iframe');
  iframe.src = convertToEmbedURL(url);
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allowfullscreen', true);

  wrapper.appendChild(iframe);
  block.appendChild(wrapper);
}

// Convert normal URLs to embed URLs
function convertToEmbedURL(url) {
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Google Maps
  if (url.includes('google.com/maps')) {
    return url.replace('/maps/', '/maps/embed/');
  }

  // Default (any iframe URL)
  return url;
}
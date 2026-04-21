/**
 * Embed block — responsive iframe embeds (YouTube, etc.)
 * Authored structure: a single link to a YouTube URL.
 * Decorated structure: responsive 16:9 iframe container.
 * @param {Element} block The embed block element
 */

const YOUTUBE_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/;

function getYouTubeId(url) {
  const match = url.match(YOUTUBE_RE);
  return match ? match[1] : null;
}

export default function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const url = link.href;
  const videoId = getYouTubeId(url);

  if (videoId) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-video-container';

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.title = 'YouTube video';

    wrapper.append(iframe);
    block.textContent = '';
    block.append(wrapper);
  }
}

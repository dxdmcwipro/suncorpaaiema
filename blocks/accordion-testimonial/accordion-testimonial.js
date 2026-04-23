/*
 * Accordion Testimonial Block
 * Collapsible section with text content and YouTube video grid
 */

const YOUTUBE_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/;

function getYouTubeId(url) {
  const match = url.match(YOUTUBE_RE);
  return match ? match[1] : null;
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    const body = row.children[1];
    body.className = 'accordion-item-body';

    // Convert YouTube links in body to embedded iframes in a video grid
    const links = body.querySelectorAll('a[href]');
    const videoLinks = [...links].filter((a) => getYouTubeId(a.href));

    if (videoLinks.length > 0) {
      const grid = document.createElement('div');
      grid.className = 'video-grid';

      videoLinks.forEach((a) => {
        const videoId = getYouTubeId(a.href);
        const wrapper = document.createElement('div');
        wrapper.className = 'video-wrapper';

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.title = 'YouTube video';

        wrapper.append(iframe);
        grid.append(wrapper);

        // Remove the original link paragraph
        const p = a.closest('p');
        if (p) p.remove();
      });

      body.append(grid);
    }

    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.open = true;
    details.append(summary, body);
    row.replaceWith(details);
  });
}

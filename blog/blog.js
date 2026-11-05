const TAG_LABELS = {
  cs135: 'CS 135',
  cs115: 'CS 115',
  research: 'Research',
  news: 'News',
};
const tagLabel = t => TAG_LABELS[t] || t;

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));

document.querySelectorAll('.post-tags[data-tags]').forEach(el => {
  el.dataset.tags.split(/\s+/).filter(Boolean).forEach(t => {
    const a = document.createElement('a');
    a.className = 'tag';
    a.href = '/blog/?tag=' + encodeURIComponent(t);
    a.textContent = tagLabel(t);
    el.appendChild(a);
  });
});

const filters = document.getElementById('postFilters');
if (filters) {
  const cards = [...document.querySelectorAll('.post-card')];
  const empty = document.getElementById('postEmpty');
  const tagsOf = c => (c.dataset.tags || '').split(/\s+/).filter(Boolean);
  const requested = new URLSearchParams(location.search).get('tag');
  const tags = [...new Set(cards.flatMap(tagsOf))].sort();
  if (requested && !tags.includes(requested)) tags.push(requested);

  const apply = tag => {
    filters.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.tag === (tag || 'all')));
    let shown = 0;
    cards.forEach(c => {
      const show = !tag || tagsOf(c).includes(tag);
      c.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    empty.textContent = tag ? `No posts tagged ${tagLabel(tag)} yet.` : 'No posts yet.';
    empty.style.display = shown ? 'none' : '';
    const url = tag ? '?tag=' + encodeURIComponent(tag) : location.pathname;
    history.replaceState(null, '', url);
  };

  ['all', ...tags].forEach(t => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pub-filter-btn';
    b.dataset.tag = t;
    b.textContent = t === 'all' ? 'All posts' : tagLabel(t);
    b.addEventListener('click', () => apply(t === 'all' ? null : t));
    filters.appendChild(b);
  });
  apply(requested);
}

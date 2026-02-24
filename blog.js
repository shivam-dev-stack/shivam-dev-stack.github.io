/**
 * blog.js — DataLog GitHub Pages Engine
 * Hash routing: # → home | #about → about | #projects → projects | #post/file.md → post
 */

const BASE = '';  // '' for root repo, '/repo-name' for project repo

// ── UTILITIES ─────────────────────────────────────────────────────────────

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

function parseFrontMatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) meta[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
  });
  return { meta, body: match[2] };
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── ROUTING ───────────────────────────────────────────────────────────────

const PAGES = ['home', 'about', 'projects', 'post'];

function showPage(name, postFile) {
  // Hide all, deactivate all nav
  PAGES.forEach(p => {
    const el = document.getElementById(`${p}-page`);
    if (el) el.classList.remove('active');
    const nav = document.getElementById(`nav-${p}`);
    if (nav) nav.classList.remove('active');
  });

  // Show target page
  const page = document.getElementById(`${name}-page`);
  if (page) page.classList.add('active');

  // Activate nav
  const navEl = document.getElementById(`nav-${name}`);
  if (navEl) navEl.classList.add('active');
  // home nav special case
  if (name === 'home') {
    const homeNav = document.getElementById('nav-home');
    if (homeNav) homeNav.classList.add('active');
  }

  // Load content
  if (name === 'post' && postFile) { loadPost(postFile); window.scrollTo(0, 0); }
  else if (name === 'about')    loadAbout();
  else if (name === 'projects') loadProjects();
}

function handleHash() {
  const hash = window.location.hash.slice(1);
  if (hash.startsWith('post/'))   showPage('post', hash.slice(5));
  else if (hash === 'about')      showPage('about');
  else if (hash === 'projects')   showPage('projects');
  else                            showPage('home');
}

// ── HOME: POST LIST ───────────────────────────────────────────────────────

async function loadPostList() {
  const container = document.getElementById('posts-list');
  try {
    const posts = await fetchJSON(`${BASE}/posts.json`);
    if (!posts.length) { container.innerHTML = '<div class="loading">No posts yet.</div>'; return; }
    container.innerHTML = posts.map(post => `
      <a class="post-card" href="#post/${post.file}">
        <div>
          <div class="post-meta">
            <span class="post-date">${formatDate(post.date)}</span>
            ${post.tags ? post.tags.slice(0,2).map(t => `<span class="post-tag">${t}</span>`).join('') : ''}
          </div>
          <div class="post-title">${post.title}</div>
          <div class="post-excerpt">${post.excerpt || ''}</div>
        </div>
        <span class="post-arrow">→</span>
      </a>
    `).join('');
  } catch (e) {
    container.innerHTML = `<div class="loading">Error loading posts: ${e.message}</div>`;
  }
}

// ── POST PAGE ─────────────────────────────────────────────────────────────

async function loadPost(file) {
  const container = document.getElementById('post-content');
  container.innerHTML = '<div class="loading">loading…</div>';
  try {
    const raw = await fetchText(`${BASE}/posts/${file}`);
    const { meta, body } = parseFrontMatter(raw);
    const html = marked.parse(body);
    container.innerHTML = `
      <h1>${meta.title || file.replace('.md', '')}</h1>
      <div class="post-meta">
        ${meta.date ? `<span class="post-date">${formatDate(meta.date)}</span>` : ''}
        ${meta.tags ? meta.tags.split(',').map(t => `<span class="post-tag">${t.trim()}</span>`).join('') : ''}
      </div>
      ${html}
    `;
  } catch (e) {
    container.innerHTML = `<div class="loading">Error: ${e.message}</div>`;
  }
}

// ── ABOUT PAGE ────────────────────────────────────────────────────────────

async function loadAbout() {
  const container = document.getElementById('about-content');
  if (container.dataset.loaded) return;
  try {
    const raw = await fetchText(`${BASE}/about.md`);
    const { meta, body } = parseFrontMatter(raw);
    const html = marked.parse(body);
    container.dataset.loaded = 'true';
    container.innerHTML = `
      <div class="about-header">
        <div class="about-avatar">${meta.initials || 'DS'}</div>
        <div class="about-intro">
          <h1>${meta.name || 'Your Name'}</h1>
          <div class="role">${meta.role || 'Data Scientist'}</div>
        </div>
      </div>
      <div class="about-body">${html}</div>
    `;
  } catch (e) {
    container.innerHTML = `<div class="loading">Error loading about: ${e.message}</div>`;
  }
}

// ── PROJECTS PAGE ─────────────────────────────────────────────────────────

async function loadProjects() {
  const container = document.getElementById('projects-content');
  if (container.dataset.loaded) return;
  try {
    const raw = await fetchText(`${BASE}/projects.md`);
    const { meta, body } = parseFrontMatter(raw);
    const html = marked.parse(body);
    container.dataset.loaded = 'true';
    container.innerHTML = `
      <div class="projects-header">
        <div class="projects-avatar">${meta.initials || '🚀'}</div>
        <div class="projects-intro">
          <h1>${meta.title || 'Projects'}</h1>
          <div class="role">${meta.subtitle || 'Things I have built'}</div>
        </div>
      </div>
      <div class="projects-body">${html}</div>
    `;
  } catch (e) {
    container.innerHTML = `<div class="loading">Error loading projects: ${e.message}</div>`;
  }
}

// ── INIT ──────────────────────────────────────────────────────────────────

document.getElementById('year').textContent = new Date().getFullYear();
marked.setOptions({ gfm: true, breaks: true });
window.addEventListener('hashchange', handleHash);
loadPostList().then(() => handleHash());
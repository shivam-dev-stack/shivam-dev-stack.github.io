/**
 * blog.js — DataLog GitHub Pages Engine
 * ─────────────────────────────────────
 * Reads posts.json for the post index, then fetches individual .md files.
 * To add a post: add an entry to posts.json and drop the .md in /posts/
 */

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

// Parse optional YAML-like front matter (---) from markdown
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

function showPage(name, postFile, updateHash = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

  const page = document.getElementById(`${name}-page`);
  if (page) page.classList.add('active');

  const navEl = document.getElementById(`nav-${name}`);
  if (navEl) navEl.classList.add('active');

  // Update URL hash
  if (updateHash) {
    if (name === 'post' && postFile) window.location.hash = `post/${postFile}`;
    else if (name === 'about') window.location.hash = 'about';
    else window.location.hash = '';
  }

  if (name === 'post' && postFile) {
    loadPost(postFile);
    window.scrollTo(0, 0);
  }
  if (name === 'about') loadAbout();
}

// Read hash and navigate to correct page
function handleHash() {
  const hash = window.location.hash.slice(1); // remove the #
  if (hash.startsWith('post/')) {
    const file = hash.replace('post/', '');
    showPage('post', file, false);
  } else if (hash === 'about') {
    showPage('about', null, false);
  } else {
    showPage('home', null, false);
  }
}

// ── HOME: POST LIST ───────────────────────────────────────────────────────

async function loadPostList() {
  const container = document.getElementById('posts-list');
  try {
    const posts = await fetchJSON('posts.json');
    if (!posts.length) {
      container.innerHTML = '<div class="loading">No posts yet.</div>';
      return;
    }
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
    const raw = await fetchText(`posts/${file}`);
    const { meta, body } = parseFrontMatter(raw);
    const html = marked.parse(body);

    container.innerHTML = `
      <h1>${meta.title || file.replace('.md','')}</h1>
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
    const raw = await fetchText('about.md');
    const { meta, body } = parseFrontMatter(raw);
    const html = marked.parse(body);
    container.dataset.loaded = 'true';
    container.innerHTML = `
      <div class="about-header">
        <div class="about-avatar">${(meta.initials || 'DS')}</div>
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

// ── INIT ──────────────────────────────────────────────────────────────────

document.getElementById('year').textContent = new Date().getFullYear();

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Listen for back/forward browser navigation
window.addEventListener('hashchange', handleHash);

// On first load, read the hash and go to correct page
loadPostList().then(() => handleHash());
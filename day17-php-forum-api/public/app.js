const api = (path, opts = {}) => fetch(path, Object.assign({ credentials: 'same-origin' }, opts));

const state = { token: localStorage.getItem('token') };

// Toast helper
function showToast(message, type = 'info', ms = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return; // no-op in tests
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = message;
  container.appendChild(t);
  setTimeout(() => { t.style.transition = 'opacity 300ms'; t.style.opacity = '0'; setTimeout(() => t.remove(), 320); }, ms);
}

// Modal confirm helper returning Promise<boolean>
function confirmModal(text) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirm-modal');
    const body = document.getElementById('confirm-body');
    const ok = document.getElementById('confirm-ok');
    const cancel = document.getElementById('confirm-cancel');
    if (!modal || !body || !ok || !cancel) {
      // modal markup missing -> do not confirm by default
      resolve(false);
      return;
    }
    body.textContent = text;
    modal.classList.remove('hidden');
    const cleanup = () => { ok.removeEventListener('click', okHandler); cancel.removeEventListener('click', cancelHandler); modal.classList.add('hidden'); };
    const okHandler = () => { cleanup(); resolve(true); };
    const cancelHandler = () => { cleanup(); resolve(false); };
    ok.addEventListener('click', okHandler);
    cancel.addEventListener('click', cancelHandler);
  });
}

async function loadPosts() {
  const res = await api('/posts');
  const json = await res.json();
  const ul = document.getElementById('posts-list');
  ul.innerHTML = '';
  json.data.forEach(p => {
    const li = document.createElement('li');
    const deleteBtn = (state.username && state.username === p.author) ? `<button data-id="${p.id}" class="btn-delete-post">Delete Post</button>` : '';
    li.innerHTML = `
      <div class="post-header"><strong>${escapeHtml(p.title)}</strong>
        <div class="meta">by ${escapeHtml(p.author)} — ${escapeHtml(formatTimestamp(p.created_at) || '')}</div>
      </div>
      <p>${escapeHtml(p.body)}</p>
      <div>
        <button data-post="${p.id}" class="btn-show-comments">Show comments</button>
        ${deleteBtn}
        <span class="count-badge" id="count-${p.id}">...</span>
        <div class="comments" id="comments-for-${p.id}"></div>
      </div>
    `;
    ul.appendChild(li);
  });

  document.querySelectorAll('.btn-show-comments').forEach(b => b.addEventListener('click', async (e) => {
    const id = e.currentTarget.dataset.post;
    await loadComments(id);
  }));

  // wire delete post buttons
  document.querySelectorAll('.btn-delete-post').forEach(b => b.addEventListener('click', async (ev) => {
    const id = ev.currentTarget.dataset.id;
    if (!state.token) { showToast('You must be logged in to delete posts', 'error'); return; }
    const ok = await confirmModal('Delete this post?');
    if (!ok) return;
    try {
      const r = await api(`/posts/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + state.token } });
      if (r.status === 204) {
        showToast('Post deleted', 'success');
        await loadPosts();
      } else {
        let msg = 'Delete failed';
        try { const j = await r.json(); msg = j.error || JSON.stringify(j); } catch (err) {}
        showToast(msg, 'error');
      }
    } catch (e) {
      console.error('Delete post failed', e);
      showToast('Network error', 'error');
    }
  }));

  // load counts for posts (simple parallel requests)
  json.data.forEach(async p => {
    try {
      const r = await api(`/posts/${p.id}/comments`);
      const j = await r.json();
      const badge = document.getElementById('count-' + p.id);
      if (badge) badge.textContent = j.data.length + ' comments';
    } catch (e) { const badge = document.getElementById('count-' + p.id); if (badge) badge.textContent = '—'; }
  });
}

async function updateCommentCount(postId) {
  try {
    const r = await api(`/posts/${postId}/comments`);
    const j = await r.json();
    const badge = document.getElementById('count-' + postId);
    if (badge) badge.textContent = j.data.length + ' comments';
  } catch (e) { const badge = document.getElementById('count-' + postId); if (badge) badge.textContent = '—'; }
}

async function loadComments(postId, page = 1, perPage = 5) {
  const el = document.getElementById('comments-for-' + postId);
  el.innerHTML = '<div class="small">Loading comments…</div>';
  el.classList.add('loading');
  let json;
  try {
    const res = await api(`/posts/${postId}/comments?page=${page}&per_page=${perPage}`);
    json = await res.json();
  } catch (e) {
    el.innerHTML = '<div class="error">Could not load comments</div>';
    el.classList.remove('loading');
    return;
  }
  el.classList.remove('loading');
  el.innerHTML = '';
  const ul = document.createElement('ul');
  ul.className = 'comments-list';
  json.data.forEach(c => {
    const li = document.createElement('li');
    let controls = '';
    if (state.token && state.username && state.username === c.author) {
      controls = ` <button data-id="${c.id}" class="btn-delete-comment">Delete</button>`;
    }
    li.innerHTML = `<div class="meta">${escapeHtml(c.author)} — ${escapeHtml(formatTimestamp(c.created_at) || '')}${controls}</div><p>${escapeHtml(c.body)}</p>`;
    ul.appendChild(li);
  });
  el.appendChild(ul);

  // pagination info (no Prev/Next buttons)
  const meta = json.meta || { page: 1, per_page: perPage, total: json.data.length };
  const total = meta.total ?? json.data.length;
  // don't show per-comment pagination summary here; the post list already shows comment counts

  if (state.token) {
    const form = document.createElement('div');
    form.innerHTML = `\
      <textarea id="comment-body-${postId}" placeholder="Write a comment"></textarea>\
      <button data-post="${postId}" class="btn-add-comment">Add Comment</button>`;
    el.appendChild(form);
    form.querySelector('.btn-add-comment').addEventListener('click', async (ev) => {
      const pid = ev.currentTarget.dataset.post;
      const bodyEl = document.getElementById('comment-body-' + pid);
      const body = bodyEl.value;
      // optimistic UI: append the comment locally until server confirms
      const ul = el.querySelector('.comments-list');
      const optimistic = document.createElement('li');
      optimistic.className = 'loading';
      optimistic.innerHTML = `<div class="meta">You — just now</div><p>${escapeHtml(body)}</p>`;
      if (ul) ul.appendChild(optimistic);
      bodyEl.value = '';
      try {
        const r = await api(`/posts/${pid}/comments`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + state.token }, body: JSON.stringify({ body }) });
        if (r.status === 201) {
          // refresh comments to show server-authoritative data
          await loadComments(pid);
          // update the post's comment count badge
          await updateCommentCount(pid);
        } else {
          optimistic.remove();
          const err = await r.json().catch(() => ({}));
          el.insertAdjacentHTML('beforeend', `<div class="error">Comment failed: ${escapeHtml(err.error || 'unknown')}</div>`);
        }
      } catch (e) {
        optimistic.remove();
        el.insertAdjacentHTML('beforeend', `<div class="error">Network error: could not post comment</div>`);
      }
    });
    // attach delete handlers
    el.querySelectorAll('.btn-delete-comment').forEach(b => b.addEventListener('click', async (ev) => {
      // cache elements immediately to avoid event reuse nullifying currentTarget after awaits
      const btn = ev.currentTarget || ev.target;
      if (!btn) { showToast('Unexpected event target', 'error'); return; }
      const id = btn.dataset.id;
      if (!state.token) { showToast('You must be logged in to delete comments', 'error'); return; }
      // confirm destructive action
      const ok = await confirmModal('Delete this comment?');
      if (!ok) return;
      const li = btn.closest('li');
      const container = btn.closest('[id^="comments-for-"]');
      const pid = container ? container.id.replace('comments-for-','') : null;
      btn.disabled = true;
      try {
        const headers = { 'Authorization': 'Bearer ' + state.token };
        const r = await api(`/comments/${id}`, { method: 'DELETE', headers });
        if (r.status === 204) {
          li && li.remove();
          // update the post's comment count badge
          if (pid) await updateCommentCount(pid);
        } else {
          let msg = 'Delete failed';
          try { const j = await r.json(); msg = j.error || JSON.stringify(j); } catch (err) { /* ignore parse errors */ }
          showToast(msg, 'error');
        }
      } catch (e) {
        console.error('Delete request failed', e);
        showToast('Network error: ' + (e && e.message ? e.message : 'unknown'), 'error');
      } finally {
        // re-enable button if it still exists
        try { btn.disabled = false; } catch (e) { /* ignore */ }
      }
    }));
  }
}

function escapeHtml(s = '') {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function formatTimestamp(ts) {
  if (!ts) return '';
  // SQLite uses 'YYYY-MM-DD HH:MM:SS' (UTC when using datetime('now')).
  // Convert to ISO and force Z (UTC) so Date parses correctly, then format to local.
  try {
    let iso = ts.replace(' ', 'T');
    if (!/[zZ\+\-]/.test(iso)) iso = iso + 'Z';
    const d = new Date(iso);
    if (isNaN(d)) return ts;
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch (e) {
    return ts;
  }
}

async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await api('/register', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ username, password }) });
  if (res.status === 201) {
    showToast('Registered — please login', 'success');
  } else {
    const j = await res.json(); showToast('Register failed: ' + (j.error || 'unknown'), 'error');
  }
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await api('/login', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ username, password }) });
  const j = await res.json();
  if (res.ok && j.data && j.data.token) {
    state.token = j.data.token;
    localStorage.setItem('token', state.token);
    state.username = username;
    document.getElementById('current-user').textContent = username;
    updateAuthUI();
    document.getElementById('create-post').classList.remove('hidden');
    showToast('Logged in', 'success');
  } else {
    showToast('Login failed: ' + (j.error || 'unknown'), 'error');
  }
}

function updateAuthUI() {
  const loginPanel = document.getElementById('login-panel');
  const userPanel = document.getElementById('user-panel');
  const avatar = document.getElementById('user-avatar');
  const logoutBtn = document.getElementById('btn-logout');
  if (state.token && state.username) {
    loginPanel.classList.add('hidden');
    userPanel.classList.remove('hidden');
    avatar.textContent = state.username.charAt(0).toUpperCase();
    document.getElementById('current-user').textContent = state.username;
    if (logoutBtn) logoutBtn.style.display = '';
    if (avatar) avatar.style.display = '';
  } else {
    loginPanel.classList.remove('hidden');
    userPanel.classList.add('hidden');
    avatar.textContent = '';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (avatar) avatar.style.display = 'none';
  }
}

function logout() {
  state.token = null;
  state.username = null;
  localStorage.removeItem('token');
  updateAuthUI();
  document.getElementById('create-post').classList.add('hidden');
  showToast('Logged out', 'info');
}

async function createPost() {
  const title = document.getElementById('post-title').value;
  const body = document.getElementById('post-body').value;
  const createBtn = document.getElementById('btn-create');
  createBtn.disabled = true;
  createBtn.textContent = 'Creating…';
  try {
    const res = await api('/posts', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + state.token }, body: JSON.stringify({ title, body }) });
    if (res.status === 201) {
      // optimistic: reload posts
      await loadPosts();
      document.getElementById('post-title').value = '';
      document.getElementById('post-body').value = '';
    } else {
      const j = await res.json();
      document.getElementById('create-post').insertAdjacentHTML('beforeend', `<div class="error">Create failed: ${escapeHtml(j.error || 'unknown')}</div>`);
    }
  } catch (e) {
    document.getElementById('create-post').insertAdjacentHTML('beforeend', `<div class="error">Network error: could not create post</div>`);
    showToast('Network error: could not create post', 'error');
  } finally {
    createBtn.disabled = false;
    createBtn.textContent = 'Create';
  }
}

document.getElementById('btn-register').addEventListener('click', register);
document.getElementById('btn-login').addEventListener('click', login);
document.getElementById('btn-create').addEventListener('click', createPost);
document.getElementById('btn-logout').addEventListener('click', logout);

// reflect stored token immediately
updateAuthUI();
// if we have a token, fetch /me to display username
async function init() {
  // if a token exists, verify it and populate username; clear token if invalid
  if (state.token) {
    try {
      const res = await api('/me', { headers: { 'Authorization': 'Bearer ' + state.token } });
      if (res.ok) {
        const j = await res.json();
        state.username = j.data.username;
        document.getElementById('current-user').textContent = state.username;
        updateAuthUI();
        document.getElementById('create-post').classList.remove('hidden');
      } else {
        // token invalid -> clear
        state.token = null;
        localStorage.removeItem('token');
        updateAuthUI();
      }
    } catch (e) {
      // network or other error - clear token to avoid inconsistent UI
      state.token = null;
      localStorage.removeItem('token');
      updateAuthUI();
    }
  }
  await loadPosts();
}

init();

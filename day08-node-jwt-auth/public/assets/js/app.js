async function request(path, method='GET', body=null, token=null){
  const headers = {};
  if (body && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(path, { method, headers, body });
  const text = await res.text();
  let data = text;
  try { data = JSON.parse(text); } catch (e) { /* keep raw text */ }
  return { status: res.status, ok: res.ok, data };
}

function $id(id){ return document.getElementById(id); }

document.addEventListener('DOMContentLoaded', ()=>{
  const out = $id('output');
  const tokenEl = $id('token');
  const username = $id('username');
  const password = $id('password');

  function show(obj){ out.textContent = JSON.stringify(obj, null, 2); }

  $id('btn-register').addEventListener('click', async ()=>{
    const resp = await request('/api/auth/register','POST',{ username: username.value, password: password.value });
    show(resp);
  });

  $id('btn-login').addEventListener('click', async ()=>{
    const resp = await request('/api/auth/login','POST',{ username: username.value, password: password.value });
    if (resp.ok && resp.data && resp.data.token) tokenEl.value = resp.data.token;
    show(resp);
  });

  $id('btn-protected').addEventListener('click', async ()=>{
    const resp = await request('/api/protected','GET',null, tokenEl.value.trim());
    show(resp);
  });

  $id('btn-copy').addEventListener('click', ()=>{
    if (!tokenEl.value) return;
    navigator.clipboard?.writeText(tokenEl.value);
  });
});

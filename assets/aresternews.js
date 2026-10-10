(() => {
  const cfg = window.ARESTERNEWS_CONFIG;
  const table = 'aresternews_articles';
  const client = window.supabase.createClient(cfg.url, cfg.key);
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[c]);

  async function loadPublic() {
    const host = $('#news-list');
    if (!host) return;
    host.textContent = 'Memuat berita…';
    const { data, error } = await client.from(table)
      .select('id,title,slug,excerpt,content,cover_url,published_at,created_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) {
      host.textContent = 'Berita belum dapat dimuat. Pastikan SQL Supabase sudah dijalankan.';
      return;
    }
    if (!data.length) {
      host.textContent = 'Belum ada berita yang diterbitkan.';
      return;
    }
    host.innerHTML = data.map(a => `
      <article class="an-card">
        ${a.cover_url ? `<img class="an-cover" src="${esc(a.cover_url)}" alt="" loading="lazy">` : ''}
        <p class="an-date">${esc(new Date(a.published_at || a.created_at).toLocaleDateString('id-ID',{dateStyle:'long'}))}</p>
        <h2>${esc(a.title)}</h2>
        <p>${esc(a.excerpt || '')}</p>
        <details><summary>Baca selengkapnya</summary><div class="an-content">${esc(a.content).replace(/\n/g,'<br>')}</div></details>
      </article>`).join('');
  }

  async function initAdmin() {
    const root = $('#admin-app');
    if (!root) return;
    root.innerHTML = `
      <section class="an-panel">
        <h2>Masuk Admin</h2>
        <p>Akses hanya untuk ${esc(cfg.adminEmail)}.</p>
        <form id="an-login">
          <label>Email<input name="email" type="email" autocomplete="username" required></label>
          <label>Password<input name="password" type="password" autocomplete="current-password" required></label>
          <button>Masuk</button>
        </form>
        <p id="an-msg" role="status"></p>
      </section>
      <section id="an-editor" class="an-panel" hidden>
        <div class="an-actions"><h2>Kelola Berita</h2><button id="an-logout" type="button">Keluar</button></div>
        <form id="an-form">
          <input name="id" type="hidden">
          <label>Judul<input name="title" maxlength="180" required></label>
          <label>Ringkasan<textarea name="excerpt" rows="3" maxlength="500"></textarea></label>
          <label>Isi berita<textarea name="content" rows="10" required></textarea></label>
          <label>URL gambar (opsional)<input name="cover_url" type="url" placeholder="https://..."></label>
          <label>Status<select name="status"><option value="draft">Draft</option><option value="published">Terbitkan</option></select></label>
          <div class="an-actions"><button type="submit">Simpan berita</button><button id="an-clear" type="button">Berita baru</button></div>
        </form>
        <h3>Daftar berita</h3><div id="an-items">Memuat…</div>
      </section>`;

    const msg = $('#an-msg');
    const editor = $('#an-editor');
    const login = $('#an-login');
    const form = $('#an-form');

    function tell(s) { msg.textContent = s; }
    function slugify(s) {
      return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
        .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);
    }
    function clearForm() { form.reset(); form.elements.id.value=''; }

    async function refresh() {
      const {data,error} = await client.from(table).select('*').order('created_at',{ascending:false});
      if (error) { $('#an-items').textContent = error.message; return; }
      const items = $('#an-items');
      items.replaceChildren();
      if (!data.length) { items.textContent = 'Belum ada berita.'; return; }
      data.forEach(a => {
        const row = document.createElement('div');
        row.className = 'an-item';
        const title = document.createElement('strong');
        title.textContent = `${a.title} (${a.status})`;
        const edit = document.createElement('button');
        edit.type = 'button'; edit.textContent = 'Edit';
        edit.addEventListener('click', () => {
          Object.keys(a).forEach(k => {
            if (form.elements[k]) form.elements[k].value = a[k] ?? '';
          });
          window.scrollTo({top:0,behavior:'smooth'});
        });
        const del = document.createElement('button');
        del.type = 'button'; del.textContent = 'Hapus';
        del.addEventListener('click', async () => {
          if (!confirm('Hapus berita ini?')) return;
          const {error} = await client.from(table).delete().eq('id',a.id);
          tell(error ? error.message : 'Berita dihapus.');
          if (!error) refresh();
        });
        row.append(title, edit, del); items.append(row);
      });
    }

    async function showSession() {
      const {data:{session}} = await client.auth.getSession();
      const valid = session && (session.user.email || '').toLowerCase() === cfg.adminEmail.toLowerCase();
      login.hidden = !!valid;
      editor.hidden = !valid;
      if (session && !valid) {
        await client.auth.signOut();
        tell('Email ini tidak diizinkan menjadi admin.');
      }
      if (valid) { tell('Login berhasil.'); await refresh(); }
    }

    login.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(login);
      if (String(fd.get('email')).toLowerCase() !== cfg.adminEmail.toLowerCase()) {
        tell('Gunakan email admin yang sudah ditentukan.'); return;
      }
      tell('Memeriksa akun…');
      const {error} = await client.auth.signInWithPassword({
        email:String(fd.get('email')).trim(),
        password:String(fd.get('password'))
      });
      tell(error ? error.message : 'Berhasil masuk.');
      if (!error) await showSession();
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const {data:{session}} = await client.auth.getSession();
      if (!session || (session.user.email || '').toLowerCase() !== cfg.adminEmail.toLowerCase()) {
        tell('Silakan masuk menggunakan akun admin.'); return;
      }
      const fd = new FormData(form);
      const title = String(fd.get('title')).trim();
      const status = String(fd.get('status'));
      const oldId = String(fd.get('id') || '');
      const payload = {
        title,
        slug: slugify(title) + (oldId ? '' : '-' + Date.now().toString(36)),
        excerpt: String(fd.get('excerpt') || '').trim(),
        content: String(fd.get('content') || '').trim(),
        cover_url: String(fd.get('cover_url') || '').trim(),
        status,
        author_email: cfg.adminEmail,
        published_at: status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };
      let result;
      if (oldId) {
        delete payload.slug;
        result = await client.from(table).update(payload).eq('id',oldId);
      } else {
        result = await client.from(table).insert(payload);
      }
      tell(result.error ? result.error.message : 'Berita berhasil disimpan.');
      if (!result.error) { clearForm(); await refresh(); }
    });

    $('#an-clear').addEventListener('click', clearForm);
    $('#an-logout').addEventListener('click', async () => {
      await client.auth.signOut(); await showSession();
    });
    client.auth.onAuthStateChange(() => { showSession(); });
    await showSession();
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadPublic();
    initAdmin();
  });
})();

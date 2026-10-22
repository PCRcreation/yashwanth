/* Portfolio: JavaScript. Reads content saved by admin.html (same browser) */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const KEY = 'lavanya-admin-data';
  const catName = { site: 'Website', app: 'Web app', tool: 'Utility' };

  /* Default content (used until the admin saves changes) */
  const defaults = {
    profile: { name: 'Yashwant K S', head: 'BCA student who enjoys web development, Python and databases, and learns best by building real projects.', email: 'yashwant.email@gmail.com', git: 'https://github.com/', lin: 'https://www.linkedin.com/', open: true },
    projects: [
      { id: 1, title: 'Personal Portfolio', cat: 'site', desc: 'A responsive portfolio with dark mode, project filters and a contact section.', feat: ['Smooth-scrolling navigation', 'Light and dark theme toggle', 'Project filters with expandable details', 'Fully responsive on mobile and desktop'], tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'] },
      { id: 2, title: 'Todo List', cat: 'tool', desc: 'Add, complete and delete daily tasks, saved automatically in the browser.', feat: ['Add, edit and delete tasks', 'Mark tasks as completed', 'Filter by all, active and completed', 'Data saved with localStorage'], tags: ['HTML', 'CSS', 'JavaScript', 'localStorage'] },
      { id: 3, title: 'Food Delivery', cat: 'app', desc: 'Browse dishes, add them to a cart and see the order total instantly.', feat: ['Browse menu by category', 'Add and remove items in the cart', 'Live quantity and total price', 'Responsive card layout'], tags: ['HTML', 'CSS', 'JavaScript', 'DOM'] }
    ],
    skills: [['HTML', 4], ['CSS', 4], ['JavaScript', 4], ['Python', 4], ['DBMS', 4], ['SQL', 4], ['AI Tools', 2]].map((s, i) => ({ id: i + 1, name: s[0], lvl: s[1] })),
    messages: []
  };
  let db = defaults;
  try { const raw = localStorage.getItem(KEY); if (raw) db = Object.assign({}, defaults, JSON.parse(raw)); } catch (e) {}

  /* Render content */
  $('#year').textContent = new Date().getFullYear();
  $('#cProj').textContent = db.projects.length;
  $('#cSkill').textContent = db.skills.length;
  if (db.profile.head) $('#headline').textContent = (db.profile.name ? "I'm " + db.profile.name + ', a ' : 'A ') + db.profile.head.charAt(0).toLowerCase() + db.profile.head.slice(1);
  $('#status').lastChild.textContent = db.profile.open ? 'Open to internships and entry-level roles' : 'Not looking for roles right now';
  $('#mailLink').href = 'mailto:' + db.profile.email; $('#mailLink').textContent = db.profile.email;
  $('#gitLink').href = db.profile.git; $('#linLink').href = db.profile.lin;

  $('#skillList').innerHTML = db.skills.map(s =>
    `<li><b>${esc(s.name)}</b><span class="dots" aria-label="Level ${s.lvl} of 5">${[1, 2, 3, 4, 5].map(n => `<i class="${n <= s.lvl ? 'on' : ''}"></i>`).join('')}</span></li>`).join('');

  $('#projectList').innerHTML = db.projects.length ? db.projects.map(p =>
    `<article class="project" data-cat="${esc(p.cat)}">
      <button class="p-head" aria-expanded="false"><h3>${esc(p.title)}</h3><span class="p-type">${catName[p.cat] || ''}</span><span class="p-plus" aria-hidden="true">+</span></button>
      <div class="p-body"><div><p>${esc(p.desc)}</p><ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
      <ul class="feat">${p.feat.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>
    </article>`).join('') : '<p class="empty">No projects yet.</p>';

  /* Theme */
  const root = document.documentElement;
  let saved = null; try { saved = localStorage.getItem('lavanya-theme'); } catch (e) {}
  root.setAttribute('data-theme', saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  $('#themeBtn').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('lavanya-theme', next); } catch (e) {}
  });

  /* Mobile menu */
  const nav = $('#nav'), menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', () => menuBtn.setAttribute('aria-expanded', nav.classList.toggle('open')));
  $$('#nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }));

  /* Active nav link */
  const links = $$('#nav a');
  const navObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => navObs.observe(s));

  /* Project filter + expand */
  $('#filters').addEventListener('click', e => {
    const btn = e.target.closest('.chip'); if (!btn) return;
    $$('.chip').forEach(b => b.classList.toggle('active', b === btn));
    const f = btn.dataset.filter;
    $$('.project').forEach(p => p.classList.toggle('hide', f !== 'all' && p.dataset.cat !== f));
  });
  $('#projectList').addEventListener('click', e => {
    const head = e.target.closest('.p-head'); if (!head) return;
    const card = head.parentElement, open = card.classList.toggle('open');
    head.setAttribute('aria-expanded', open);
  });
  const first = $('.project'); if (first) { first.classList.add('open'); $('.p-head', first).setAttribute('aria-expanded', 'true'); }

  /* Back to top */
  const toTop = $('#toTop');
  addEventListener('scroll', () => toTop.classList.toggle('show', scrollY > 600), { passive: true });
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* Contact form: saved to the admin inbox in this browser */
  const form = $('#contactForm'), err = $('#formError'), toast = $('#toast');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#name').value.trim(), email = $('#email').value.trim(), text = $('#message').value.trim();
    if (!name || !email || !text) { err.textContent = 'Please fill in all the fields.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Enter a valid email address, like name@example.com.'; return; }
    err.textContent = '';
    try {
      const cur = JSON.parse(localStorage.getItem(KEY) || 'null') || db;
      cur.messages = (cur.messages || []).concat({ id: Date.now(), name, email, text, date: Date.now(), read: false });
      localStorage.setItem(KEY, JSON.stringify(cur));
    } catch (x) {}
    form.reset();
    toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000);
  });
})();

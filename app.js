/* ============================================================
 * app.js — 《咫尺乾坤 · 苏州园林志》共享交互层
 * 导航 / 折叠 / 标签页 / 模态 / 抽屉 / Toast / 微交互 / 动效编排
 * ============================================================ */
(function(){
  'use strict';
  if (window.GP_APP) return;

  const GP = window.GP_APP = {};
  // 注意：window.GP 由 illustrations.js 占用（插画与照片 API），此处不再覆盖。
  // 本模块统一通过 window.GP_APP 暴露。

  /* ---------- 工具 ---------- */
  GP.$  = (s, r) => (r||document).querySelector(s);
  GP.$$ = (s, r) => Array.from((r||document).querySelectorAll(s));
  GP.el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  GP.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 顶部导航（统一注入） ---------- */
  const NAV_ITEMS = [
    { key:'home',     href:'index.html',        label:'园 志' },
    { key:'explore',  href:'explore.html',      label:'寻 园' },
    { key:'detail',   href:'detail.html',       label:'园 情' },
    { key:'scene',    href:'garden.html',       label:'移 步' },
    { key:'profile',  href:'profile.html',      label:'我 的' },
    { key:'about',    href:'about.html',        label:'关 于' }
  ];

  GP.nav = function(active, opts){
    opts = opts || {};
    const holder = document.querySelector('[data-gp-nav]');
    if (!holder) return;

    const links = NAV_ITEMS.map(it => {
      const on = it.key === active ? ' is-active' : '';
      return `<a class="gp-nav__link${on}" href="${it.href}">${it.label}</a>`;
    }).join('');

    const drawerLinks = NAV_ITEMS.map(it => {
      const on = it.key === active ? ' is-active' : '';
      return `<a class="${on.trim()}" href="${it.href}">${it.label.replace(/\s/g,'')}</a>`;
    }).join('');

    holder.innerHTML = `
      <div class="gp-nav__inner gp-wrap">
        <a class="gp-brand" href="index.html" aria-label="苏州园林志 首页">
          <svg class="gp-brand__mark" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="1.5" y="1.5" width="37" height="37" rx="3" fill="none" stroke="#b13a2f" stroke-width="2"/>
            <path d="M9 30 q6-4 11-2 t11-2" fill="none" stroke="#1a1410" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M8 22 h24" stroke="#1a1410" stroke-width="1.2" opacity=".55"/>
            <path d="M13 16 l7-8 7 8 z" fill="none" stroke="#2f5a6e" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
          <span>
            <span class="gp-brand__txt">苏州园林志</span>
            <span class="gp-brand__sub">SUZHOU GARDENS ARCHIVE</span>
          </span>
        </a>
        <nav class="gp-nav__links" aria-label="主导航">${links}</nav>
        <div class="gp-nav__tools">
          <button class="gp-iconbtn" data-gp-search-open aria-label="搜索" title="搜索（S）">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
              <circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 L21 21"/>
            </svg>
          </button>
          <button class="gp-iconbtn" data-gp-fav aria-label="我的收藏" title="我的收藏">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">
              <path d="M6 3h12v18l-6-4.2L6 21z"/>
            </svg>
            <span class="gp-iconbtn__dot" hidden></span>
          </button>
          <button class="gp-iconbtn gp-nav__toggle" data-gp-drawer-open aria-label="打开菜单">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M4 7h16M4 12h16M4 17h16"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="gp-drawer" data-gp-drawer>
        <div class="gp-drawer__mask" data-gp-drawer-close></div>
        <div class="gp-drawer__panel">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span class="gp-eyebrow">导 览</span>
            <button class="gp-iconbtn" data-gp-drawer-close aria-label="关闭">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <div class="gp-drawer__links">${drawerLinks}</div>
        </div>
      </div>`;

    // 抽屉
    const drawer = holder.querySelector('[data-gp-drawer]');
    const openDrawer = () => drawer.classList.add('is-open');
    const closeDrawer = () => drawer.classList.remove('is-open');
    holder.querySelector('[data-gp-drawer-open]').addEventListener('click', openDrawer);
    GP.$$('[data-gp-drawer-close]', holder).forEach(b => b.addEventListener('click', closeDrawer));

    // 收藏入口 → 个人中心
    const favBtn = holder.querySelector('[data-gp-fav]');
    if (favBtn) favBtn.addEventListener('click', () => { location.href = 'profile.html#fav'; });

    // 搜索入口 → 列表页并聚焦
    const sBtn = holder.querySelector('[data-gp-search-open]');
    if (sBtn) sBtn.addEventListener('click', () => { location.href = 'explore.html?focus=search'; });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
        location.href = 'explore.html?focus=search';
      }
      if (e.key === 'Escape') { closeDrawer(); GP.closeModal && GP.closeModal(); }
    });
  };

  /* ---------- 1b. 行内导航（沉浸页等自带导航栏的页面） ---------- */
  GP.inlineNav = function(active){
    const holder = document.querySelector('[data-gp-inline-nav]');
    if (!holder) return;
    holder.innerHTML = NAV_ITEMS.map(it => {
      const on = it.key === active ? ' is-active' : '';
      return `<a class="gp-nav__link${on}" href="${it.href}">${it.label}</a>`;
    }).join('');
  };

  /* ---------- 2. 页脚 ---------- */
  GP.footer = function(){
    const holder = document.querySelector('[data-gp-footer]');
    if (!holder) return;
    holder.innerHTML = `
      <div class="gp-wrap">
        <div class="gp-footer__grid">
          <div>
            <div class="gp-brand" style="margin-bottom:14px">
              <svg class="gp-brand__mark" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="1.5" y="1.5" width="37" height="37" rx="3" fill="none" stroke="#b13a2f" stroke-width="2"/>
                <path d="M9 30 q6-4 11-2 t11-2" fill="none" stroke="#1a1410" stroke-width="1.6" stroke-linecap="round"/>
                <path d="M8 22 h24" stroke="#1a1410" stroke-width="1.2" opacity=".55"/>
                <path d="M13 16 l7-8 7 8 z" fill="none" stroke="#2f5a6e" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
              <span><span class="gp-brand__txt">苏州园林志</span><span class="gp-brand__sub">网络艺术设计 · 第五六周</span></span>
            </div>
            <p class="gp-body" style="max-width:330px;font-size:14px">
              以数字化手段记录江南造园智慧。本站点为课程设计原型，数据依据公开史料整理，图像仅作示意。
            </p>
          </div>
          <div>
            <h4>游 览</h4>
            <ul>
              <li><a href="index.html">首页 · 园志</a></li>
              <li><a href="explore.html">寻园 · 列表与搜索</a></li>
              <li><a href="detail.html?id=zhuozheng">园情 · 详情样板</a></li>
              <li><a href="garden.html?id=zhuozheng">移步 · 沉浸场景</a></li>
            </ul>
          </div>
          <div>
            <h4>页 面</h4>
            <ul>
              <li><a href="splash.html">启动 / 引导页</a></li>
              <li><a href="loading.html">加载等待页</a></li>
              <li><a href="states.html">错误 / 空状态页</a></li>
              <li><a href="profile.html">个人中心</a></li>
            </ul>
          </div>
          <div>
            <h4>规 范</h4>
            <ul>
              <li><a href="design-system.html">设计系统</a></li>
              <li><a href="motion.html">交互动效规范</a></li>
              <li><a href="about.html">关于 / 帮助</a></li>
              <li><a href="states.html#offline">无网络状态</a></li>
            </ul>
          </div>
        </div>
        <div class="gp-footer__bottom">
          <span>© 2026 咫尺乾坤小组 · 《网络艺术设计》课程设计</span>
          <span>姑苏园林志 · A3 加长页设计交付物</span>
        </div>
      </div>`;
  };

  /* ---------- 3. 滚动揭示 ---------- */
  GP.reveal = function(root){
    const nodes = GP.$$('.gp-reveal', root||document);
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) { nodes.forEach(n => n.classList.add('in-view')); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    nodes.forEach(n => io.observe(n));
  };

  /* ---------- 4. 折叠面板 ---------- */
  GP.accordion = function(root){
    GP.$$('.gp-acc__head', root||document).forEach(head => {
      if (head.dataset.gpBound) return;
      head.dataset.gpBound = '1';
      head.addEventListener('click', () => {
        const item = head.closest('.gp-acc__item');
        const panel = item.querySelector('.gp-acc__panel');
        const inner = item.querySelector('.gp-acc__inner');
        const open = head.getAttribute('aria-expanded') === 'true';
        head.setAttribute('aria-expanded', String(!open));
        if (open) {
          panel.style.height = inner.offsetHeight + 'px';
          requestAnimationFrame(() => { panel.style.height = '0px'; });
        } else {
          panel.style.height = inner.offsetHeight + 'px';
          setTimeout(() => { panel.style.height = 'auto'; }, 620);
        }
      });
    });
  };

  /* ---------- 5. 标签页 ---------- */
  GP.tabs = function(root){
    GP.$$('.gp-tabs', root||document).forEach(bar => {
      const btns = GP.$$('button', bar);
      const panels = GP.$$('[data-gp-tab-panel]', bar.parentElement);
      btns.forEach((b, i) => {
        if (b.dataset.gpBound) return;
        b.dataset.gpBound = '1';
        b.addEventListener('click', () => {
          btns.forEach(x => { x.classList.remove('is-on'); x.setAttribute('aria-selected','false'); });
          b.classList.add('is-on'); b.setAttribute('aria-selected','true');
          panels.forEach((p, j) => {
            p.hidden = (j !== i);
            if (j === i) { p.classList.remove('in-view'); void p.offsetWidth; p.classList.add('gp-reveal'); }
          });
          GP.reveal(bar.parentElement);
        });
      });
    });
  };

  /* ---------- 6. 模态 ---------- */
  GP.modal = function(sel){
    const m = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!m) return;
    GP.closeModal = () => { m.classList.remove('is-open'); document.body.style.overflow = ''; };
    GP.$$('[data-gp-close]', m).forEach(b => b.addEventListener('click', GP.closeModal));
    const mask = m.querySelector('.gp-modal__mask');
    if (mask) mask.addEventListener('click', GP.closeModal);
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  GP.openModal = GP.modal;

  /* ---------- 7. Toast ---------- */
  GP.toast = function(msg, type){
    let t = document.querySelector('.gp-toast');
    if (!t) {
      t = GP.el('div', 'gp-toast');
      t.setAttribute('role','status');
      document.body.appendChild(t);
    }
    const icons = {
      ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
      err:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 8v5M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>',
      info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>'
    };
    t.className = 'gp-toast' + (type ? ' gp-toast--' + type : '');
    t.innerHTML = `<span class="gp-toast__icon">${icons[type||'info']||icons.info}</span><span>${msg}</span>`;
    requestAnimationFrame(() => t.classList.add('is-show'));
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('is-show'), 2400);
  };

  /* ---------- 8. 微交互：点赞 / 收藏 / 分享 ---------- */
  const spark = (btn, n, color) => {
    for (let i = 0; i < n; i++) {
      const s = GP.el('span', 'gp-spark');
      s.style.background = color || '#b13a2f';
      s.style.left = (18 + Math.random()*44) + '%';
      s.style.top = '50%';
      btn.appendChild(s);
      const dx = (Math.random()*46 - 23);
      const dy = -(28 + Math.random()*38);
      s.animate([
        { transform:'translate(0,0) scale(.4)', opacity:1 },
        { transform:`translate(${dx}px,${dy}px) scale(1)`, opacity:0 }
      ], { duration: 620 + Math.random()*260, easing:'cubic-bezier(.16,1,.3,1)' }).onfinish = () => s.remove();
    }
  };

  GP.bindSocial = function(root){
    GP.$$('[data-like]', root||document).forEach(btn => {
      if (btn.dataset.gpBound) return; btn.dataset.gpBound = '1';
      btn.addEventListener('click', () => {
        const on = btn.classList.toggle('is-on');
        const cnt = btn.querySelector('[data-like-count]');
        if (cnt) cnt.textContent = (+cnt.textContent + (on ? 1 : -1));
        if (on) { spark(btn, 7, '#b13a2f'); GP.toast('已题赞 · 留名卷末', 'ok'); }
      });
    });
    GP.$$('[data-collect]', root||document).forEach(btn => {
      if (btn.dataset.gpBound) return; btn.dataset.gpBound = '1';
      btn.addEventListener('click', () => {
        const on = btn.classList.toggle('is-on');
        const icon = btn.querySelector('.gp-collect__icon');
        if (icon) icon.style.fill = on ? 'currentColor' : 'none';
        GP.toast(on ? '已收入我的笺囊' : '已从笺囊取出', on ? 'ok' : 'info');
        if (on) spark(btn, 5, '#b58d4e');
      });
    });
    GP.$$('[data-share]', root||document).forEach(btn => {
      if (btn.dataset.gpBound) return; btn.dataset.gpBound = '1';
      btn.addEventListener('click', async () => {
        const url = location.href;
        try {
          if (navigator.clipboard) await navigator.clipboard.writeText(url);
          GP.toast('游园笺已复制，可分享同行', 'ok');
        } catch(e) { GP.toast('游园笺已生成', 'ok'); }
      });
    });
  };

  /* ---------- 9. 页面进入动效 ---------- */
  GP.pageEnter = function(){
    if (GP.reduced) return;
    document.body.classList.add('gp-pagefade');
  };

  /* ---------- 10. 启动页：印章落款 → 跳转 ---------- */
  GP.splash = function(opts){
    opts = opts || {};
    const seal = document.querySelector('[data-gp-seal]');
    const bar = document.querySelector('[data-gp-progress]');
    const tip = document.querySelector('[data-gp-tip]');
    const tips = opts.tips || ['展卷 · 泼墨','理水 · 叠山','点景 · 借景','移步 · 换景'];
    let p = 0, i = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + Math.random()*11 + 4);
      if (bar) bar.style.width = p + '%';
      if (tip) tip.textContent = tips[Math.min(tips.length-1, Math.floor(p/26))];
      if (p >= 100) {
        clearInterval(tick);
        if (seal) seal.classList.add('gp-stamp');
        setTimeout(() => { location.href = opts.to || 'index.html'; }, 620);
      }
    }, 220);
  };

  /* ---------- 11. 骨架屏模拟加载 ---------- */
  GP.simulateLoad = function(opts){
    opts = opts || {};
    const bar = document.querySelector('[data-gp-progress]');
    const target = opts.target || 88;
    let p = 0;
    const t = setInterval(() => {
      p += Math.random()*9;
      if (p >= target) { p = target; clearInterval(t); }
      if (bar) bar.style.width = p + '%';
      if (p >= target && opts.done) setTimeout(opts.done, 240);
    }, 260);
  };

  /* ---------- 12. 视差 ---------- */
  GP.parallax = function(){
    const layers = GP.$$('[data-parallax]');
    if (!layers.length || GP.reduced) return;
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      layers.forEach(el => {
        const r = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.parallax) || 0.12;
        const offset = (r.top + r.height/2 - vh/2) * speed;
        el.style.transform = `translate3d(0,${offset.toFixed(2)}px,0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive:true });
    update();
  };

  /* ---------- 13. 启动 ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    GP.reveal();
    GP.accordion();
    GP.tabs();
    GP.bindSocial();
    GP.parallax();
    GP.pageEnter();
  });

  /* ---------- 14. 页面高度标记（供批量截图取用） ---------- */
  const markHeight = () => {
    document.documentElement.setAttribute('data-page-height', String(document.documentElement.scrollHeight));
  };
  window.addEventListener('load', () => { markHeight(); setTimeout(markHeight, 400); });
  setTimeout(markHeight, 900);
})();

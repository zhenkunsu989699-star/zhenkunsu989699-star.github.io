// 全站交互：导航栏、菜单、主题、滚动显现、数字滚动、视差、筛选、复制
// 配合 Astro ClientRouter，每次页面切换后由 astro:page-load 重新初始化

let controller: AbortController | null = null;
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function applyTheme() {
  try {
    const t = localStorage.getItem('theme');
    if (t) document.documentElement.dataset.theme = t;
  } catch {}
  document.documentElement.classList.remove('no-js');
}

export function init() {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  setupNav(signal);
  setupTheme(signal);
  setupReveal(signal);
  setupCounters(signal);
  setupScrollEffects(signal);
  setupFilters(signal);
  setupCopy(signal);
}

function setupNav(signal: AbortSignal) {
  const nav = document.getElementById('nav');
  const btn = document.getElementById('menu-toggle');
  if (!nav || !btn) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true, signal });

  const setOpen = (open: boolean) => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', () => setOpen(!nav.classList.contains('open')), { signal });
  document.querySelectorAll('#mobile-menu a').forEach((a) => a.addEventListener('click', () => setOpen(false), { signal }));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false), { signal });
  document.addEventListener('astro:before-swap', () => setOpen(false), { signal, once: true });
}

function setupTheme(signal: AbortSignal) {
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => {
    const root = document.documentElement;
    const dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    const next = dark ? 'light' : 'dark';
    const swap = () => {
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch {}
    };
    // 支持 View Transitions 的浏览器使用淡入淡出切换主题
    const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (d.startViewTransition && !reduceMotion()) d.startViewTransition(swap);
    else swap();
  }, { signal });
}

function setupReveal(signal: AbortSignal) {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduceMotion()) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  els.forEach((el) => io.observe(el));
  signal.addEventListener('abort', () => io.disconnect());
}

function setupCounters(signal: AbortSignal) {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  const run = (el: HTMLElement) => {
    const target = parseFloat(el.dataset.count!);
    const decimals = parseInt(el.dataset.decimals ?? '0', 10);
    if (reduceMotion()) { el.textContent = target.toFixed(decimals); return; }
    const dur = 1600;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(2, -10 * p); // easeOutExpo
      el.textContent = (target * (p === 1 ? 1 : eased)).toFixed(decimals);
      if (p < 1 && !signal.aborted) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { run(e.target as HTMLElement); io.unobserve(e.target); }
    }),
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
  signal.addEventListener('abort', () => io.disconnect());
}

// data-parallax="0.12"：随滚动轻微位移；data-zoom：进入视口时由 0.9 放大到 1
function setupScrollEffects(signal: AbortSignal) {
  if (reduceMotion()) return;
  const par = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  const zoom = [...document.querySelectorAll<HTMLElement>('[data-zoom]')];
  if (!par.length && !zoom.length) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    for (const el of par) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const speed = parseFloat(el.dataset.parallax || '0.1');
      const offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    }
    for (const el of zoom) {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
      el.style.transform = `scale(${(0.9 + 0.1 * p).toFixed(4)})`;
      el.style.borderRadius = `${(40 - 12 * p).toFixed(1)}px`;
    }
  };
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true, signal });
  window.addEventListener('resize', onScroll, { passive: true, signal });
}

// 分段控件筛选：[data-filter-group] 内的按钮 data-filter，对应条目 data-cat
function setupFilters(signal: AbortSignal) {
  document.querySelectorAll<HTMLElement>('[data-filter-group]').forEach((group) => {
    const buttons = [...group.querySelectorAll<HTMLButtonElement>('[data-filter]')];
    const pill = group.querySelector<HTMLElement>('.seg-pill');
    const items = document.querySelectorAll<HTMLElement>(group.dataset.filterGroup!);
    const move = (b: HTMLButtonElement) => {
      if (!pill) return;
      pill.style.width = `${b.offsetWidth}px`;
      pill.style.transform = `translateX(${b.offsetLeft}px)`;
    };
    const select = (b: HTMLButtonElement) => {
      buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      move(b);
      const f = b.dataset.filter;
      let i = 0;
      items.forEach((it) => {
        const show = f === 'all' || it.dataset.cat === f;
        it.hidden = !show;
        if (show) {
          it.classList.remove('in');
          it.style.setProperty('--d', `${i++ * 60}ms`);
          requestAnimationFrame(() => requestAnimationFrame(() => it.classList.add('in')));
        }
      });
    };
    buttons.forEach((b) => b.addEventListener('click', () => select(b), { signal }));
    const active = buttons.find((b) => b.getAttribute('aria-pressed') === 'true') ?? buttons[0];
    requestAnimationFrame(() => move(active));
    window.addEventListener('resize', () => move(buttons.find((b) => b.getAttribute('aria-pressed') === 'true') ?? buttons[0]), { signal });
  });
}

function setupCopy(signal: AbortSignal) {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const src = document.getElementById(btn.dataset.copy!);
      if (!src) return;
      let ok = true;
      try { await navigator.clipboard.writeText(src.textContent?.trim() ?? ''); } catch { ok = false; }
      toast(ok ? '引用已复制到剪贴板' : '复制失败，请手动选择文本');
    }, { signal });
  });
}

function toast(msg: string) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout((el as any)._t);
  (el as any)._t = setTimeout(() => el!.classList.remove('show'), 2200);
}

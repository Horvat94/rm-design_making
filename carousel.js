(() => {
  const section = document.querySelector('.news');
  const track = document.querySelector('#news-track');
  if (!section || !track) return;

  const outletItems = [
    { badge: 'Do konca septembra 2026', title: 'Podloga za miške iz plute', imageAlt: 'PODLOGA ZA MIŠKO IZ NARAVNE PLUTE', image: 'https://gdkwp.img.a.d.sendibm1.com/im/sh/p4_OvqUY2XD5.png?u=1vcqsYC5HMzcSMokuphxY3Tcz5UGPh', link: 'https://gdkwp.r.a.d.sendibm1.com/mk/mr/sh/6rqJ8GoudeITPxaanPS1ca6AOcL/cXc9Wz-nhW0k' },
    { badge: 'Do konca septembra 2026', title: 'Podloga za miške iz plute', imageAlt: 'PODLOGA ZA MIŠKO IZ NARAVNE PLUTE', image: 'https://gdkwp.img.a.d.sendibm1.com/im/sh/p4_OvqUY2XD5.png?u=1vcqsYC5HMzcSMokuphxY3Tcz5UGPh', link: 'https://gdkwp.r.a.d.sendibm1.com/mk/mr/sh/6rqJ8GoudeITPxaanPS1ca6AOcL/cXc9Wz-nhW0k' },
    { badge: 'Do konca septembra 2026', title: 'Podloga za miške iz plute', imageAlt: 'PODLOGA ZA MIŠKO IZ NARAVNE PLUTE', image: 'https://gdkwp.img.a.d.sendibm1.com/im/sh/p4_OvqUY2XD5.png?u=1vcqsYC5HMzcSMokuphxY3Tcz5UGPh', link: 'https://gdkwp.r.a.d.sendibm1.com/mk/mr/sh/6rqJ8GoudeITPxaanPS1ca6AOcL/cXc9Wz-nhW0k' },
    { badge: 'Do konca septembra 2026', title: 'Podloga za miške iz plute', imageAlt: 'PODLOGA ZA MIŠKO IZ NARAVNE PLUTE', image: 'https://gdkwp.img.a.d.sendibm1.com/im/sh/p4_OvqUY2XD5.png?u=1vcqsYC5HMzcSMokuphxY3Tcz5UGPh', link: 'https://gdkwp.r.a.d.sendibm1.com/mk/mr/sh/6rqJ8GoudeITPxaanPS1ca6AOcL/cXc9Wz-nhW0k' },
    { badge: 'Do konca septembra 2026', title: 'Podloga za miške iz plute', imageAlt: 'PODLOGA ZA MIŠKO IZ NARAVNE PLUTE', image: 'https://gdkwp.img.a.d.sendibm1.com/im/sh/p4_OvqUY2XD5.png?u=1vcqsYC5HMzcSMokuphxY3Tcz5UGPh', link: 'https://gdkwp.r.a.d.sendibm1.com/mk/mr/sh/6rqJ8GoudeITPxaanPS1ca6AOcL/cXc9Wz-nhW0k' },
    ];

  function element(name, className, text) {
    const node = document.createElement(name);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function createCard(item, index) {
    const article = element('article', 'news-card');
    const linkTarget = element('a', 'news-card__open');
    linkTarget.href = item.link;
    linkTarget.setAttribute('aria-label', `Preberi več: ${item.title}`);

    const media = element('span', 'news-card__media');
    const image = element('img');
    image.src = item.image;
    image.alt = item.imageAlt;
    image.loading = 'lazy';
    image.decoding = 'async';
    media.append(image, element('span', 'news-badge', item.badge));

    const body = element('span', 'news-card__body');
    const number = element('span', 'news-card__number', `${String(index + 1).padStart(2, '0')} / RM DESIGN`);
    number.setAttribute('aria-hidden', 'true');
    const title = element('span', 'news-card__title', item.title);
    title.setAttribute('role', 'heading');
    title.setAttribute('aria-level', '3');
    const excerpt = element('span', 'news-card__excerpt', item.excerpt);
    const link = element('span', 'news-card__link');
    const arrow = element('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    link.append('Preberi več ', arrow);
    body.append(number, title, excerpt, link);
    linkTarget.append(media, body);
    article.append(linkTarget);
    return article;
  }

  const fragment = document.createDocumentFragment();
  outletItems.forEach((item, index) => fragment.append(createCard(item, index)));
  track.replaceChildren(fragment);
  const originals = [...track.children];
  const shouldLoop = originals.length > 1;
  section.classList.toggle('news--single', !shouldLoop);

  if (shouldLoop) {
    originals.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('button, a, input, select, textarea, [tabindex]').forEach(control => control.tabIndex = -1);
      track.append(clone);
    });
  }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let hovering = false;
  let focused = false;
  let interacting = false;
  let animating = false;
  let resumeAt = 0;
  let cycle = 0;
  let animationFrame = 0;

  function measuredCycle() {
    const firstClone = track.children[originals.length];
    return firstClone ? firstClone.offsetLeft - originals[0].offsetLeft : 0;
  }

  function normalizePosition() {
    if (cycle <= 0) return;
    if (track.scrollLeft >= cycle) track.scrollLeft %= cycle;
    if (track.scrollLeft < 0) track.scrollLeft = ((track.scrollLeft % cycle) + cycle) % cycle;
  }

  function measure({ preserve = true } = {}) {
    const previousCycle = cycle;
    const previousPosition = track.scrollLeft;
    const nextCycle = measuredCycle();
    if (nextCycle <= 0) return;
    cycle = nextCycle;
    if (preserve && previousCycle > 0 && Math.abs(previousCycle - nextCycle) > .5) {
      const logicalPosition = ((previousPosition / previousCycle) % 1 + 1) % 1;
      track.scrollLeft = logicalPosition * nextCycle;
    } else {
      normalizePosition();
    }
  }

  function itemStep() {
    if (track.children.length < 2) return originals[0]?.getBoundingClientRect().width || 0;
    return track.children[1].offsetLeft - track.children[0].offsetLeft;
  }

  function move(direction) {
    if (animating || cycle <= 0) return;
    const step = itemStep();
    if (step <= 0) return;
    resumeAt = performance.now() + 5000;
    if (direction < 0 && track.scrollLeft < step - 1) track.scrollLeft += cycle;
    const start = track.scrollLeft;
    const distance = direction * step;

    if (reducedMotion.matches) {
      track.scrollLeft = start + distance;
      normalizePosition();
      return;
    }

    cancelAnimationFrame(animationFrame);
    animating = true;
    const started = performance.now();
    const duration = 450;
    const animate = now => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      track.scrollLeft = start + distance * eased;
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
      else { animating = false; normalizePosition(); }
    };
    animationFrame = requestAnimationFrame(animate);
  }

  new ResizeObserver(() => measure()).observe(track);
  requestAnimationFrame(() => measure({ preserve: false }));
  track.addEventListener('scroll', () => { if (!animating) normalizePosition(); }, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target === track && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  section.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') hovering = true; });
  section.addEventListener('pointerleave', () => { hovering = false; });
  section.addEventListener('focusin', () => { focused = true; });
  section.addEventListener('focusout', event => { focused = section.contains(event.relatedTarget); });
  track.addEventListener('pointerdown', () => { interacting = true; });
  window.addEventListener('pointerup', () => {
    if (!interacting) return;
    interacting = false;
    resumeAt = performance.now() + 5000;
  });
  window.addEventListener('pointercancel', () => { interacting = false; resumeAt = performance.now() + 5000; });
  track.addEventListener('wheel', () => { resumeAt = performance.now() + 5000; }, { passive: true });

  function advance() {
    const paused = hovering || focused || interacting || animating || reducedMotion.matches || document.hidden || performance.now() < resumeAt;
    if (!paused && cycle > 0) move(1);
  }
  window.setInterval(advance, 2500);
})();

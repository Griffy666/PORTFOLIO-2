/*
  Binder page-turn engine.

  Treats the seven portfolio pages as sheets bound by the same fixed
  rings/acrylic frame. Navigating between them (via nav clicks, mouse
  wheel, touch swipe, or arrow keys) plays a 3D rotate-around-the-ring-
  line animation instead of a normal page load, then finalizes the URL
  via history.pushState. Falls back to a completely normal navigation
  if fetch/animation isn't available or anything goes wrong, so the
  site never gets stuck.
*/
(function () {
  'use strict';

  var PAGES = [
    { url: 'index.html', title: 'RONI / Grifel — Portfolio' },
    { url: 'campaigns.html', title: 'Campaigns — RONI / Grifel' },
    { url: 'fashion.html', title: 'Fashion — RONI / Grifel' },
    { url: 'products.html', title: 'Products — RONI / Grifel' },
    { url: 'concepts.html', title: 'Concepts — RONI / Grifel' },
    { url: 'about.html', title: 'About — RONI / Grifel' },
    { url: 'contact.html', title: 'Contact — RONI / Grifel' }
  ];

  var FLIP_DURATION = 850; // ms, must match css/flip.css --flip-duration
  var WHEEL_COOLDOWN = 900;
  var SWIPE_THRESHOLD = 70;

  var canvas = document.querySelector('.canvas');
  if (!canvas || !('DOMParser' in window) || typeof fetch !== 'function') {
    return; // no canvas shell, or unsupported browser: leave normal links alone
  }

  document.documentElement.style.setProperty('--flip-duration', (FLIP_DURATION / 1000) + 's');

  function currentFileName() {
    var path = location.pathname.replace(/\/+$/, '');
    var last = path.substring(path.lastIndexOf('/') + 1);
    return last === '' ? 'index.html' : last;
  }

  var currentIndex = PAGES.findIndex(function (p) { return p.url === currentFileName(); });
  if (currentIndex === -1) currentIndex = 0;

  history.replaceState({ index: currentIndex }, '', location.href);

  var isAnimating = false;
  var lastWheelAt = 0;
  var cache = {}; // url -> extracted innerHTML string

  function getFlipPage() {
    return document.getElementById('flip-page');
  }

  function getScrollPane(flipPageEl) {
    return flipPageEl ? flipPageEl.querySelector('.paper--pane') : null;
  }

  function fetchInner(url) {
    if (cache[url]) return Promise.resolve(cache[url]);
    return fetch(url, { credentials: 'same-origin' }).then(function (res) {
      if (!res.ok) throw new Error('fetch failed: ' + res.status);
      return res.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var node = doc.getElementById('flip-page');
      var front = node ? node.querySelector('.flip-page__face--front') : null;
      if (!front) throw new Error('no flip-page found in ' + url);
      cache[url] = front.innerHTML;
      return cache[url];
    });
  }

  function buildLayer(innerHTML, extraClass) {
    var layer = document.createElement('div');
    layer.className = 'flip-page ' + extraClass;
    var front = document.createElement('div');
    front.className = 'flip-page__face flip-page__face--front';
    front.innerHTML = innerHTML;
    var back = document.createElement('div');
    back.className = 'flip-page__face flip-page__face--back';
    layer.appendChild(front);
    layer.appendChild(back);
    return layer;
  }

  function withTimeoutFallback(el, eventName, ms, cb) {
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      el.removeEventListener(eventName, onEvent);
      cb();
    }
    function onEvent(e) {
      if (e.target === el) finish();
    }
    el.addEventListener(eventName, onEvent);
    setTimeout(finish, ms + 150);
  }

  function goTo(newIndex) {
    if (isAnimating || newIndex === currentIndex || newIndex < 0 || newIndex >= PAGES.length) return;
    var direction = newIndex > currentIndex ? 1 : -1;
    var target = PAGES[newIndex];
    isAnimating = true;

    fetchInner(target.url).then(function (innerHTML) {
      var outgoing = getFlipPage();
      if (!outgoing) throw new Error('no current flip-page');

      var shade = canvas.querySelector('.flip-shade');
      var incoming = buildLayer(innerHTML, 'flip-page--incoming');
      canvas.insertBefore(incoming, outgoing);

      outgoing.classList.add(direction > 0 ? 'flip-out-fwd' : 'flip-out-bwd');
      incoming.classList.add(direction > 0 ? 'flip-in-fwd' : 'flip-in-bwd');
      if (shade) shade.classList.add(direction > 0 ? 'is-active-fwd' : 'is-active-bwd');

      withTimeoutFallback(outgoing, 'animationend', FLIP_DURATION, function () {
        outgoing.remove();
        incoming.classList.remove('flip-page--incoming', 'flip-in-fwd', 'flip-in-bwd');
        incoming.id = 'flip-page';
        if (shade) shade.classList.remove('is-active-fwd', 'is-active-bwd');

        currentIndex = newIndex;
        history.pushState({ index: newIndex }, '', target.url);
        document.title = target.title;
        isAnimating = false;
      });
    }).catch(function () {
      // Anything went wrong (network, parsing, unsupported): just navigate normally.
      isAnimating = false;
      window.location.href = target.url;
    });
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  // ---- wheel ----
  canvas.addEventListener('wheel', function (e) {
    if (isAnimating) { e.preventDefault(); return; }
    var now = Date.now();
    var pane = getScrollPane(getFlipPage());
    var atBottom = !pane || (pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 2);
    var atTop = !pane || pane.scrollTop <= 2;

    if (e.deltaY > 0 && atBottom) {
      e.preventDefault();
      if (now - lastWheelAt > WHEEL_COOLDOWN) { lastWheelAt = now; next(); }
    } else if (e.deltaY < 0 && atTop) {
      e.preventDefault();
      if (now - lastWheelAt > WHEEL_COOLDOWN) { lastWheelAt = now; prev(); }
    }
    // otherwise let the pane scroll natively
  }, { passive: false });

  // ---- touch swipe ----
  var touchStartY = null;

  canvas.addEventListener('touchstart', function (e) {
    if (isAnimating || e.touches.length !== 1) return;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', function (e) {
    if (isAnimating || touchStartY === null) return;
    var endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
    var deltaY = touchStartY - endY;
    touchStartY = null;
    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;

    var pane = getScrollPane(getFlipPage());
    var atBottom = !pane || (pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 2);
    var atTop = !pane || pane.scrollTop <= 2;

    if (deltaY > 0 && atBottom) next();       // swipe up -> next
    else if (deltaY < 0 && atTop) prev();     // swipe down -> previous
  }, { passive: true });

  // ---- keyboard ----
  window.addEventListener('keydown', function (e) {
    if (isAnimating) return;
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  // ---- click interception for in-sequence links ----
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    var idx = PAGES.findIndex(function (p) { return p.url === href; });
    if (idx === -1) return; // not one of our sequence pages (e.g. work.html, mailto:) - normal nav
    e.preventDefault();
    goTo(idx);
  });

  // ---- back/forward ----
  window.addEventListener('popstate', function (e) {
    var idx = (e.state && typeof e.state.index === 'number') ? e.state.index : PAGES.findIndex(function (p) { return p.url === currentFileName(); });
    if (idx === -1 || idx === currentIndex) return;
    goTo(idx);
  });

  // ---- ensure a shade overlay exists ----
  if (!canvas.querySelector('.flip-shade')) {
    var shadeEl = document.createElement('div');
    shadeEl.className = 'flip-shade';
    var hardware = canvas.querySelector('.hardware');
    canvas.insertBefore(shadeEl, hardware || null);
  }
})();

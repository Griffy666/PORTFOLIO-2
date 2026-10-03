/* Click any gallery image to view it full-screen. Arrow keys / swipe
   move between images on the same page; Esc, the × button or a click
   on the backdrop closes it. No dependencies. */
(function () {
  var items = Array.prototype.slice.call(
    document.querySelectorAll('.gallery__item, .spread__item')
  );
  if (!items.length || typeof HTMLDialogElement === 'undefined') return;

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML =
    '<button class="lightbox__close" type="button" aria-label="Close">&times;</button>' +
    '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image">&#8592;</button>' +
    '<figure class="lightbox__figure"><img class="lightbox__img" alt=""><figcaption class="lightbox__caption"></figcaption></figure>' +
    '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image">&#8594;</button>';
  document.body.appendChild(dialog);

  var img = dialog.querySelector('.lightbox__img');
  var caption = dialog.querySelector('.lightbox__caption');
  var current = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    var src = items[current].querySelector('img');
    var title = items[current].querySelector('.caption-title');
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    caption.textContent = title ? title.textContent : '';
  }

  items.forEach(function (item, i) {
    var el = item.querySelector('img');
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Enlarge: ' + el.alt);
    function open() { show(i); dialog.showModal(); }
    el.addEventListener('click', open);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  dialog.querySelector('.lightbox__close').addEventListener('click', function () { dialog.close(); });
  dialog.querySelector('.lightbox__nav--prev').addEventListener('click', function () { show(current - 1); });
  dialog.querySelector('.lightbox__nav--next').addEventListener('click', function () { show(current + 1); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  var startX = null;
  dialog.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  if (items.length < 2) {
    dialog.querySelectorAll('.lightbox__nav').forEach(function (b) { b.hidden = true; });
  }
})();

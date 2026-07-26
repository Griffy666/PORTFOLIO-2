(function () {
  var stage = document.querySelector('.stage');
  if (!stage) return;

  // Stacked mode: the original tall single-object binder (portrait,
  // pages stacked top/bottom) — used on narrow/portrait viewports where
  // a wide spread has no room to breathe.
  var STACKED_W = 1068;
  var STACKED_H = 1472;
  var STACKED_HEIGHT_FRACTION = 0.96;
  var STACKED_WIDTH_CAP = 0.98;

  // Spread mode: the binder opened flat as a two-page spread (wide,
  // short) — the primary desktop experience. Fit is width-dominant so
  // the binder spans almost the full browser width; the height cap only
  // protects unusually short/wide viewports from vertical overflow.
  var SPREAD_W = 2032;
  var SPREAD_H = 766;
  var SPREAD_WIDTH_FRACTION = 0.96;
  var SPREAD_HEIGHT_CAP = 0.92;

  var SPREAD_MIN_WIDTH = 860;

  function isSpreadViewport(vw) {
    return vw >= SPREAD_MIN_WIDTH;
  }

  function applyScale() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var spread = isSpreadViewport(vw);

    document.body.classList.toggle('mode-spread', spread);

    var scale;

    if (spread) {
      var scaleByWidth = (vw * SPREAD_WIDTH_FRACTION) / SPREAD_W;
      var scaleByHeight = (vh * SPREAD_HEIGHT_CAP) / SPREAD_H;
      scale = Math.min(scaleByWidth, scaleByHeight);
    } else {
      var scaleByHeightS = (vh * STACKED_HEIGHT_FRACTION) / STACKED_H;
      var scaleByWidthS = (vw * STACKED_WIDTH_CAP) / STACKED_W;
      scale = Math.min(scaleByHeightS, scaleByWidthS);
    }

    stage.style.transform = 'scale(' + scale + ')';
  }

  window.addEventListener('resize', applyScale);
  applyScale();
})();

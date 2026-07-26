(function () {
  var stage = document.querySelector('.stage');
  if (!stage) return;

  var CANVAS_W = 1068;
  var CANVAS_H = 1472;

  // The binder is the primary visual element: it should read as a large,
  // near life-size object filling most of the viewport height, on any
  // screen size, while always keeping its full extent on-screen.
  var TARGET_HEIGHT_FRACTION = 0.88; // ~85-90% of viewport height
  var MAX_WIDTH_FRACTION = 0.94;     // safety cap so it never overflows horizontally

  function applyScale() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var scaleByHeight = (vh * TARGET_HEIGHT_FRACTION) / CANVAS_H;
    var scaleByWidth = (vw * MAX_WIDTH_FRACTION) / CANVAS_W;
    var scale = Math.min(scaleByHeight, scaleByWidth);

    stage.style.transform = 'scale(' + scale + ')';
  }

  window.addEventListener('resize', applyScale);
  applyScale();
})();

(function () {
  var stage = document.querySelector('.stage');
  if (!stage) return;

  var CANVAS_W = 1068;
  var CANVAS_H = 1472;

  function applyScale() {
    var scale = Math.min(1, window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H);
    stage.style.transform = 'scale(' + scale + ')';
    document.body.style.height = (CANVAS_H * scale) + 'px';
  }

  window.addEventListener('resize', applyScale);
  applyScale();
})();

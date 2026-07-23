/*
 * VerneGraphNavigator — arrastrar para desplazar y rueda/pellizco para
 * hacer zoom sobre un <canvas> o un <svg> que dibuja un plano x/y.
 *
 * No sabe nada de cómo dibuja cada laboratorio: solo necesita que le
 * digas cómo leer y escribir la ventana visible actual.
 *
 * Uso:
 *   VerneGraphNavigator.attach(canvas, {
 *     getViewport: () => ({ xMin, xMax, yMin, yMax }),
 *     setViewport: (next) => { ...guardar next y volver a dibujar... },
 *     margin: 52,       // píxeles del borde que no son zona de dibujo (ejes, etiquetas)
 *     panAxis: 'both',  // 'both' | 'x' | 'y'
 *     zoomAxis: 'both', // 'both' | 'x' | 'y'
 *   });
 */
(function (global) {
  'use strict';

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function attach(element, options) {
    options = options || {};
    var getViewport = options.getViewport;
    var setViewport = options.setViewport;

    if (typeof getViewport !== 'function' || typeof setViewport !== 'function') {
      throw new Error('VerneGraphNavigator.attach requiere getViewport y setViewport.');
    }

    var margin = options.margin || 0;
    var panAxis = options.panAxis || 'both';
    var zoomAxis = options.zoomAxis || 'both';
    var minSpanX = options.minSpanX || 0.05;
    var maxSpanX = options.maxSpanX || 1e6;
    var minSpanY = options.minSpanY || 0.05;
    var maxSpanY = options.maxSpanY || 1e6;
    var zoomSpeed = options.zoomSpeed || 0.0015;

    element.style.touchAction = 'none';
    if (!element.style.cursor) element.style.cursor = 'grab';

    function plotBox() {
      var rect = element.getBoundingClientRect();
      return {
        left: rect.left + margin,
        top: rect.top + margin,
        width: Math.max(1, rect.width - margin * 2),
        height: Math.max(1, rect.height - margin * 2),
      };
    }

    function fractionsAt(clientX, clientY) {
      var box = plotBox();
      return {
        fx: (clientX - box.left) / box.width,
        fy: 1 - (clientY - box.top) / box.height,
      };
    }

    function mathPointAt(clientX, clientY) {
      var view = getViewport();
      var frac = fractionsAt(clientX, clientY);
      return {
        x: view.xMin + frac.fx * (view.xMax - view.xMin),
        y: view.yMin + frac.fy * (view.yMax - view.yMin),
        fx: frac.fx,
        fy: frac.fy,
      };
    }

    function zoomAt(clientX, clientY, factor) {
      var view = getViewport();
      var point = mathPointAt(clientX, clientY);
      var spanX = view.xMax - view.xMin;
      var spanY = view.yMax - view.yMin;
      var newSpanX = zoomAxis === 'y' ? spanX : clamp(spanX * factor, minSpanX, maxSpanX);
      var newSpanY = zoomAxis === 'x' ? spanY : clamp(spanY * factor, minSpanY, maxSpanY);
      var newXMin = point.x - point.fx * newSpanX;
      var newYMin = point.y - point.fy * newSpanY;

      setViewport({
        xMin: newXMin,
        xMax: newXMin + newSpanX,
        yMin: newYMin,
        yMax: newYMin + newSpanY,
      });
    }

    function panBy(dxPx, dyPx) {
      var view = getViewport();
      var box = plotBox();
      var spanX = view.xMax - view.xMin;
      var spanY = view.yMax - view.yMin;
      var dxMath = panAxis === 'y' ? 0 : -(dxPx / box.width) * spanX;
      var dyMath = panAxis === 'x' ? 0 : (dyPx / box.height) * spanY;

      setViewport({
        xMin: view.xMin + dxMath,
        xMax: view.xMax + dxMath,
        yMin: view.yMin + dyMath,
        yMax: view.yMax + dyMath,
      });
    }

    var dragging = false;
    var lastX = 0;
    var lastY = 0;
    var pinch = null;

    function startDrag(clientX, clientY) {
      dragging = true;
      lastX = clientX;
      lastY = clientY;
      element.style.cursor = 'grabbing';
    }

    function moveDrag(clientX, clientY) {
      if (!dragging) return;
      panBy(clientX - lastX, clientY - lastY);
      lastX = clientX;
      lastY = clientY;
    }

    function endDrag() {
      dragging = false;
      element.style.cursor = 'grab';
    }

    function onMouseDown(e) {
      if (e.button !== 0) return;
      startDrag(e.clientX, e.clientY);
      e.preventDefault();
    }

    function onMouseMove(e) {
      moveDrag(e.clientX, e.clientY);
    }

    function onMouseUp() {
      endDrag();
    }

    function onWheel(e) {
      e.preventDefault();
      var factor = Math.exp(e.deltaY * zoomSpeed);
      zoomAt(e.clientX, e.clientY, factor);
    }

    function touchDistance(touches) {
      var dx = touches[0].clientX - touches[1].clientX;
      var dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function touchMidpoint(touches) {
      return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
      };
    }

    function onTouchStart(e) {
      if (e.touches.length === 1) {
        pinch = null;
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        dragging = false;
        pinch = { distance: touchDistance(e.touches) };
      }
      e.preventDefault();
    }

    function onTouchMove(e) {
      if (e.touches.length === 1 && dragging) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2 && pinch) {
        var distance = touchDistance(e.touches);
        var midpoint = touchMidpoint(e.touches);
        zoomAt(midpoint.x, midpoint.y, pinch.distance / distance);
        pinch.distance = distance;
      }
      e.preventDefault();
    }

    function onTouchEnd(e) {
      if (e.touches.length === 0) {
        endDrag();
        pinch = null;
      }
    }

    element.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    element.addEventListener('wheel', onWheel, { passive: false });
    element.addEventListener('touchstart', onTouchStart, { passive: false });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    element.addEventListener('touchend', onTouchEnd);
    element.addEventListener('touchcancel', onTouchEnd);

    return {
      destroy: function () {
        element.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        element.removeEventListener('wheel', onWheel);
        element.removeEventListener('touchstart', onTouchStart);
        element.removeEventListener('touchmove', onTouchMove);
        element.removeEventListener('touchend', onTouchEnd);
        element.removeEventListener('touchcancel', onTouchEnd);
      },
    };
  }

  global.VerneGraphNavigator = { attach: attach };
})(window);

/** requestAnimationFrame polyfill
 * based on:
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 */
var now = require('./date-now'),
  vendors = ['ms', 'moz', 'webkit', 'o'],
  window = global,

  requestAnimationFrame = window.requestAnimationFrame,
  cancelAnimationFrame = window.cancelAnimationFrame,

  Math = window.Math,
  lastTime = 0, x, l;

for (x = 0, l = vendors.length; x < l; ++x) {
  if (requestAnimationFrame && cancelAnimationFrame) break;
  requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
  cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

if (!requestAnimationFrame || !cancelAnimationFrame) {
  requestAnimationFrame = function (callback, element) {
    var currTime = now(),
      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
      id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  cancelAnimationFrame = function (id) {
    window.clearTimeout(id);
  };
}

module.exports.request = requestAnimationFrame.bind(window);
module.exports.cancel = cancelAnimationFrame.bind(window);

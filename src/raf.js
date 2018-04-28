/** requestAnimationFrame polyfill
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 */
var vendors = ['ms', 'moz', 'webkit', 'o'],

  requestAnimationFrame = global.requestAnimationFrame,
  cancelAnimationFrame = global.cancelAnimationFrame,

  x = 0, l = vendors.length;

for (; x < l; ++x) {
  if (requestAnimationFrame && cancelAnimationFrame) break;
  requestAnimationFrame = global[vendors[x] + 'RequestAnimationFrame'];
  cancelAnimationFrame = global[vendors[x] + 'CancelAnimationFrame'] || global[vendors[x] + 'CancelRequestAnimationFrame'];
}

if (!requestAnimationFrame || !cancelAnimationFrame) {
  var now = require('./date-now'),
      currTime = 0,
      timeToCall = 0,
      id = null,
      lastTime = 0;

  requestAnimationFrame = function(callback, element) {
    currTime = now();
    timeToCall = Math.max(0, 16 - (currTime - lastTime));
    id = global.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  cancelAnimationFrame = function (id) {
    global.clearTimeout(id);
  };
}

module.exports.request = requestAnimationFrame.bind(global);
module.exports.cancel = cancelAnimationFrame.bind(global);

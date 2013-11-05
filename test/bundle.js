require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"qCJbFB":[function(require,module,exports){
module.exports = require('./src/fixed-game-loop.js');

},{"./src/fixed-game-loop.js":4}],"../":[function(require,module,exports){
module.exports=require('qCJbFB');
},{}],3:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};// return the current time in milliseconds
var d = global.Date;

module.exports = d.now || function () {
  return (new d()).getTime();
};

},{}],4:[function(require,module,exports){
var now = require('./date-now'),
  raf = require('./raf');

function tick() {
  var currentTime = Date.now(),
    needRedraw = false,
    i, l;

  this._accumulator += currentTime - this._previousTime;
  this._previousTime = currentTime;

  if (this._accumulator > this._timePerFrameMax) {
    this._accumulator = this._timePerFrameMax;
  }

  while (this._accumulator > this._timePerFrame) {
    this._accumulator -= this._timePerFrame;
    l = this._ontick.length;
    if (l > 0) {
      for (i = 0; i < l; ++i) {
        this._ontick[i](); 
      }
    }
    needRedraw = true;
  }

  l = this._ondraw.length;
  if (needRedraw && l > 0) {
    for (i = 0; i < l; ++i) {
      this._ondraw[i]();
    }
  }

  this._requestID = raf.request(this._tick);
}

/**
 * @constructor
 * @param fps [default=60] - frequency of timer/frames per second (optional)
 */
function Timer(fps) {
  this._initialized = false;
  this._fps = typeof fps === 'number' ? fps | 0 : 60 /*default fps*/;
  
  this._timePerFrame = 1000 / this._fps;
  this._timePerFrameMax = this._timePerFrame * 2;

  this._ontick = [];
  this._ondraw = [];
}

Timer.prototype = {
  start: function() {
    if (!this._initialized) {
      this._initialized = true;

      this._accumulator = 0;
      this._tick = tick.bind(this);

      this._isPaused = false;
      this._previousTime = now();
      this._requestID = raf.request(this._tick);

      return true;
    }
    return false;
  },

  ontick: function(callback) {
    if (typeof callback === 'function') {
      this._ontick.push(callback);
    }
  },

  ondraw: function(callback) {
    if (typeof callback === 'function') {
      this._ondraw.push(callback);
    }
  },

  /** pauses the timer */
  pause: function () {
    if (this._initialized && this._isPaused) {
      return false;
    }

    this._isPaused = true;
    raf.cancel(this._requestID);
    return true;
  },

  /** resumes the timer */
  resume: function () {
    if (this._initialized && !this._isPaused) {
      return false;
    }

    this._isPaused = false;
    this._previousTime = now();
    this._requestID = raf.request(this._tick);

    return true;
  },

  /** returns true if the timer is paused */
  isPaused: function () {
    return this._isPaused;
  }
};

module.exports = Timer; // CommonJS Module

},{"./date-now":3,"./raf":5}],5:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};/** requestAnimationFrame polyfill
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
    lastTime = 0, max = Math.max;

  requestAnimationFrame = function(callback, element) {
    var currTime = now(),
      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
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

},{"./date-now":3}]},{},[])
;
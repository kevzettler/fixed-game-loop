require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"KkGNIf":[function(require,module,exports){
module.exports = require('./src/fixed-game-loop.js');

},{"./src/fixed-game-loop.js":3}],2:[function(require,module,exports){
var global=self;// return the current time in milliseconds
var window = global,
  Date = window.Date;

module.exports = Date.now || function () {
  return (new Date()).getTime();
};

},{}],3:[function(require,module,exports){
var now = require('./date-now'),
  raf = require('./raf');

function tick() {
  var currentTime = Date.now(),
    redraw = false,
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
      for (var i = 0; i < l; ++i) {
        this._ontick[i](); 
      }
    }
    redraw = true;
  }

  l = this._ondraw.length;
  if (redraw && l > 0) {
    for (var i = 0; i < l; ++i) {
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

},{"./date-now":2,"./raf":4}],4:[function(require,module,exports){
var global=self;/** requestAnimationFrame polyfill
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

},{"./date-now":2}],"../":[function(require,module,exports){
module.exports=require('KkGNIf');
},{}]},{},[])
;
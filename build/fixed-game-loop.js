!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Timer=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
// return the current time in milliseconds
var d = global.Date;

module.exports = d.now || function () {
  return (new d()).getTime();
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
var now = require('./date-now'),
  raf = require('./raf');

module.exports = Timer;

/**
 * @constructor
 */
function Timer(options) {
  this._initialized = false;

  this._fixedDeltaTime = 1000 / 60;
  this._fixedDeltaTimeInSeconds = this._fixedDeltaTime / 1000;
  this._FRAME_TIME_MAX = 250;
  this._elapsed = 0;

  this._config(options);

  if (this._autoStart) {
    this.start();
  }
}

Timer.prototype = {
  start: function() {
    if (!this._initialized) {
      this._initialized = true;

      this._accumulator = 0;
      this._tick = tick.bind(this);

      this._isPaused = false;
      this._prevTime = now();
      this._requestID = raf.request(this._tick);

      return true;
    }
    return false;
  },

  /** pauses the timer */
  pause: function() {
    if (this._initialized && this._isPaused) {
      return false;
    }

    this._isPaused = true;
    raf.cancel(this._requestID);

    this._pauseTime = now();
    this._onPause();

    return true;
  },

  /** resumes the timer */
  resume: function() {
    if (this._initialized && !this._isPaused) {
      return false;
    }

    var pauseDuration;

    this._isPaused = false;
    this._prevTime = now();

    pauseDuration = this._prevTime - this._pauseTime;
    this._onResume(pauseDuration);

    this._requestID = raf.request(this._tick);

    return true;
  },

  togglePause: function() {
    if (this._isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  },

  /** returns true if the timer is paused */
  isPaused: function () {
    return this._isPaused;
  },

  _config: function(options) {
    var empty = function() {};

    this._update = options.update || empty;
    this._render = options.render || empty;
    this._onPause = options.onPause || empty;
    this._onResume = options.onResume || empty;

    this._autoStart = options.autoStart == null ? true : options.autoStart;
  }
};

function tick() {
  var curTime = now();
  var frameTime = curTime - this._prevTime;

  if (frameTime > this._FRAME_TIME_MAX) {
    frameTime = this._FRAME_TIME_MAX;
  }

  this._prevTime = curTime;

  this._accumulator += frameTime;

  while(this._accumulator >= this._fixedDeltaTime) {
    this._accumulator -= this._fixedDeltaTime;
    this._elapsed += this._fixedDeltaTime;
    this._update(this._fixedDeltaTimeInSeconds, this._elapsed);
  }

  this._render();

  this._requestID = raf.request(this._tick);
}

},{"./date-now":1,"./raf":3}],3:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./date-now":1}],4:[function(require,module,exports){
module.exports = require('./src/fixed-game-loop.js');

},{"./src/fixed-game-loop.js":2}]},{},[4])(4)
});
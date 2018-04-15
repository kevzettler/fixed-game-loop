(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Timer = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
// return the current time in milliseconds
var d = global.Date;

module.exports = d.now || function () {
  return (new d()).getTime();
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
var now = require('./date-now'),
  getRAF = require('./raf').getRAF;

module.exports = Timer;

/**
 * @constructor
 */
function Timer(options) {
  this._initialized = false;

  this._curTime = 0;
  this._frametime = 0;
  this._fixedDeltaTime = 1000 / 60;
  this._fixedDeltaTimeInSeconds = this._fixedDeltaTime / 1000;
  this._FRAME_TIME_MAX = 250;
  this._elapsed = 0;
  this._useRAF = options.useRAF || true;

  this._config(options);

  this._raf = getRAF(this._useRAF);

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
      this._requestID = this._raf.request(this._tick);

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
    this._raf.cancel(this._requestID);

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

    this._requestID = this._raf.request(this._tick);

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
  this._curTime = now();
  this._frameTime = this._curTime - this._prevTime;

  if (this._frameTime > this._FRAME_TIME_MAX) {
    this._frameTime = this._FRAME_TIME_MAX;
  }

  this._prevTime = this._curTime;

  this._accumulator += this._frameTime;

  while(this._accumulator >= this._fixedDeltaTime) {
    this._accumulator -= this._fixedDeltaTime;
    this._elapsed += this._fixedDeltaTime;
    this._update(this._fixedDeltaTimeInSeconds, this._elapsed);
  }

  this._render();
  this._requestID = this._raf.request(this._tick);
}

},{"./date-now":1,"./raf":3}],3:[function(require,module,exports){
(function (global){
/** requestAnimationFrame polyfill
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 */

module.exports.getRAF = function(useRAF){
  var vendors = ['ms', 'moz', 'webkit', 'o'],

  requestAnimationFrame = global.requestAnimationFrame,
  cancelAnimationFrame = global.cancelAnimationFrame,

  x = 0, l = vendors.length;

  for (; x < l; ++x) {
    if (requestAnimationFrame && cancelAnimationFrame) break;
    requestAnimationFrame = global[vendors[x] + 'RequestAnimationFrame'];
    cancelAnimationFrame = global[vendors[x] + 'CancelAnimationFrame'] || global[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!useRAF || !requestAnimationFrame || !cancelAnimationFrame) {
    var now = require('./date-now'),
    currTime = 0,
    timeToCall = 0,
    id = null,
    lastTime = 0;

    requestAnimationFrame = function(callback, element) {
      currTime = now();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      id = global.setTimeout(function RAFPollyFill() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    cancelAnimationFrame = function (id) {
      global.clearTimeout(id);
    };
  }
  return {
    request: requestAnimationFrame.bind(global),
    cancel: requestAnimationFrame.bind(global)
  };
};

// module.exports.request = requestAnimationFrame.bind(global);
// module.exports.cancel = cancelAnimationFrame.bind(global);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./date-now":1}],4:[function(require,module,exports){
module.exports = require('./src/fixed-game-loop.js');

},{"./src/fixed-game-loop.js":2}]},{},[4])(4)
});

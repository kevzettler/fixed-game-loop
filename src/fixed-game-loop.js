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

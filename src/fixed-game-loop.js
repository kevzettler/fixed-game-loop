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

  this._avoidRAF = options.avoidRAF || false;

  this._config(options);

  this._raf = getRAF(this._avoidRAF);

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

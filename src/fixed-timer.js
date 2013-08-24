/** 
 * FixedTimerJS v0.0.1
 * @author Luiz Paulo "Bills" / luizpbills@gmail.com
 * @repo github.com/luizbills/fixed-timer.js
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Luiz Paulo "Bills" Brandão
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
;(function(window, Date, undefined){
  /**
   * @constructor
   * @param ontick - timer callback
   * @param freq [default=60] - frequency of timer/frames per second (optional)
   */
  function Timer(ontick, ondraw, fps) {
    if (typeof ontick !== 'function') {
      throw "[Timer] TypeError: First argument of the constructor is not of type Function";
    }

    this._ontick = ontick;
    this._ondraw = typeof ondraw === 'function' ? ondraw : undefined;
    this._fps = typeof fps === 'number' && fps > 0 ? fps : 60,

    this._timePerFrame = 1000/this._fps,
    this._timePerFrameMax = this._timePerFrame * 2,
    this._accumulator = 0;

    this._isPaused = false;
    this._tick2 = this._tick.bind(this);

    this._previousTime = Date.now();
    this._tick();
  }

  Timer.prototype = {
    /** resumes the timer */
    resume: function() {
      if (!this._requestID || !this._isPaused) {
        return false;
      }

      this._isPaused = false;
      this._previousTime = Date.now();
      this._requestID = window.requestAnimationFrame(this._tick2);
      return true;
    },

    /** pauses the timer */
    pause: function() {
      if (!this._requestID || this._isPaused) {
        return false;
      }

      this._isPaused = true;
      window.cancelAnimationFrame(this._requestID);
      return true;
    },

    /** returns true if the timer is paused */
    isPaused: function() {
      return this._isPaused;
    },

    _tick: function() {
      var currentTime = Date.now(),
        redraw = false;

      this._accumulator += currentTime - this._previousTime;
      this._previousTime = currentTime;

      if (this._accumulator > this._timePerFrameMax) {
        this._accumulator = this._timePerFrameMax;
      }

      while(this._accumulator > this._timePerFrame) {
        this._accumulator -= this._timePerFrame;
        this._ontick();
        redraw = true;
      }

      if (redraw && this._ondraw) {
        this._ondraw();
      }

      this._requestID = window.requestAnimationFrame(this._tick2);
    }
  };

  // return the current time in milliseconds
  Date.now = Date.now || function(){return (new Date()).getTime();};

  /** requestAnimationFrame polyfill
   * based on:
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
   */
  (function (Math) {
    var lastTime = 0,
      vendors = ['ms', 'moz', 'webkit', 'o'],
      requestAnimationFrame = window.requestAnimationFrame,
      cancelAnimationFrame = window.cancelAnimationFrame,
      x, l;

    for (x = 0, l = vendors.length; x < l; ++x) {
      if (requestAnimationFrame && cancelAnimationFrame) break;
      requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!requestAnimationFrame || !cancelAnimationFrame) {
      requestAnimationFrame = function (callback, element) {
        var currTime = Date.now(),
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

    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
  }(window.Math));

  if (typeof module === 'object' && module.exports) {
    module.exports = Timer; // CommonJS Module
  } else {
    window.Timer = Timer; // turns it a global
  }
})(window, window.Date);

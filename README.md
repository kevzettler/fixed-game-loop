#FixedTimerJS v0.0.1

###Usage
```javascript
// create a timer
var timer = new Timer(function() {
  /* called every 33 milliseconds */
}, 30 /* frequency (in Hz) or fps (default is 60) */);

timer.pause(); // pauses the timer

if (timer.isPaused()) {
  console.log('timer is paused'); 
}

timer.resume(); // resumes the timer
```
===
###License
Licensed under MIT License (MIT). Copyright (c) 2013 Luiz Paulo "Bills" Brandão

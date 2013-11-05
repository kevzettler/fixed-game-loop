#Fixed Game Loop v0.1.2

###Install
```javascript
npm install fixed-game-loop
```

###Usage
```javascript
// create a timer
var GameLoop = require('fixed-game-loop');
var timer = new GameLoop(30 /*fps [default=60]*/);

timer.ontick(function() {
	console.log('updating...');
});

timer.ondraw(function() {
	console.log('drawing...');
});

timer.start(); // starts the timer

timer.pause(); // pauses the timer

if (timer.isPaused()) {
  console.log('timer is paused'); 
}

timer.resume(); // resumes the timer
```
===
###License
Licensed under MIT License (MIT). Copyright (c) 2013 Luiz "Bills"

var ctx = document.getElementById('game').getContext('2d'),
  stats = new Stats(); // used to fps measurement

document.body.appendChild(stats.domElement);

var x = -32,
  y = -32,
  speed = 25;

function updateFunc(dt, elapsed) {
  x += speed * dt;
  y += speed * dt;

  document.getElementById('elapsed').innerHTML = ((+elapsed) / 1000).toFixed(0);
}

function renderFunc() {
  stats.begin(); // start fps measurement
  ctx.clearRect(0, 0, 300, 300);
  ctx.fillStyle = '#555';
  ctx.fillRect(x, y, 32, 32);
  stats.end(); // finish fps measurement
}

function pauseCallback() {
  console.log('timer is paused');
}

function resumeCallback() {
  console.log('timer is running');
}

var timer = new Timer({
  update: updateFunc,
  render: renderFunc,
  onPause: pauseCallback,
  onResume: resumeCallback,
  autoStart: true // default is true
});

document.addEventListener('keydown', function(ev) {
  if (ev.keyCode == 13) {
    timer.togglePause();
  }
});

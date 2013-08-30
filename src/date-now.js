// return the current time in milliseconds
var Date = window.Date;

module.exports = Date.now || function () {
  return (new Date()).getTime();
};

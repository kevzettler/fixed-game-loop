// return the current time in milliseconds
var window = global,
  Date = window.Date;

module.exports = Date.now || function () {
  return (new Date()).getTime();
};

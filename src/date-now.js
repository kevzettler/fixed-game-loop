// return the current time in milliseconds
var d = global.Date;

module.exports = d.now || function () {
  return (new d()).getTime();
};

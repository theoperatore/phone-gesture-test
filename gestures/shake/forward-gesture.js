'use strict';

var Gesture = require('../Gesture');
var THRESHOLD = 17;

module.exports = function (onReset, onMatched, onUpdate) {
  return new Gesture({
    name: 'forward',
    transform: function (point, points) {
      onUpdate('forward', point);
      return point;
    },
    condition: function (points) {
      var result = points.filter(function (point) {
        return point.x > 0 && point.x >= THRESHOLD;
      })

      return result.length >= 1;
    },
    onMatched: function (name, points) {
      onMatched('forward', points);
    },
    onReset: onReset
  });
}
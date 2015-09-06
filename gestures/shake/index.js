'use strict';

var Gesture = require('../Gesture');

module.exports = function (onReset, onMatched, onUpdate) {

  var forward = require('./forward-gesture')(onReset, onMatched, onUpdate);
  var backward = require('./backward-gesture')(onReset, onMatched, onUpdate);

  return new Gesture({
    name: 'Shake',
    numTracked: 6,
    condition: [forward, backward],
    transform: function (point, points) {
      onUpdate('shake', point);
      return point;
    },
    onMatched: function (name, points) {
      onMatched('shake', points);
    },
    onReset: onReset
  })
}
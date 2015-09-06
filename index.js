'use strict';

var msg = document.querySelector('#msg');
var upd = document.querySelector('#upd');
var sqr = document.querySelector('#sqr');

var colors = ['#00ffd0', '#fb0', '#f600ff', '#00b7ff', '#ff0400', '#4cff00'];
var idx = 0;

var matched = false;
var dist;
var anim;

var Shake = require('./gestures/shake');
var shake;

function handleUpdate(name, point) {
  upd.innerHTML = Number(point.x).toFixed(2);
}

function handleMatched(name, points) {
  if (name === 'shake') {
    var p = document.createElement('span');
    p.innerHTML = name + " ";
    msg.appendChild(p);
    sqr.style.backgroundColor = colors[idx++ % colors.length];
  }
}

function handleReset() {
  // msg.innerHTML = "";
}

function handleMotion(ev) {
  shake.update(ev.acceleration);
}

function init() {
  shake = Shake(handleReset, handleMatched, handleUpdate);
}

// bind events
window.addEventListener('devicemotion', handleMotion);

// do the gestures!
init();
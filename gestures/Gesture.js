'use strict';

///////////////////////////////////////////////////////////////////////////////
//
// Defines a Gesture. 
//
// A Gesture should be able to be defined as any motion; as long as it's
// trackable.
//
// Gestures should also be composable; new gestures should be able to be 
// combined into more complex gestures.
//
// I'm imagining gestures building to create 'combo' gestures like a fighting
// game. aka Tekken, Marvel vs Capcom...
//
// Currently, once a gesture is matched, a callback will be executed.
//
// This Gesture object should accept a variable amount of Gesture objects
// that each track the smallest possible input in order to make a single 
// gesture: down, forward, [] => haduken in mmx
//
///////////////////////////////////////////////////////////////////////////////
function Gesture(opts) {
  
  // the name of this gesture
  this.name = opts.name || 'nameless_gesture';
  
  // a function that transforms the points upon each update.
  // this function should return the transformed point.
  this.transform = opts.transform;
  
  // function to be called on a successfull match of a gesture.
  this.onMatched = opts.onMatched;

  // function to be called whenever the gesture is reset
  this.onReset = opts.onReset;
  
  // array of booleans to track the success of gestures.
  // the length of this array is equal to the number of conditions to check.
  this._matched = [];
  
  // function to be computed against each update tick.
  // if this function returns true, then the gesture is treated as a matched
  // gesture.
  //
  // can also be an array of Gesture objects to be satisfied in order for this
  // entire gesture to be matched.
  this.condition = opts.condition;
  
  // the number of points to keep track of when matching a gesture. This might
  // get pretty resource intensive so the number of points to track should be 
  // as low as possible.
  //
  // I guess it should be the sum total of all gestures to check.
  this.numTracked = opts.numTracked || 5;
  
  // the underlying points tracked. this array should be passed into the 
  // condition function upon each invokation. It's length should be maintained
  // by the numTracked property
  this._points = [];
}

// update this gesture with a new point. This function maintains the collection
// of recent points and is resposible for calling each condition function and
// keeping track of the success of the gesture.
Gesture.prototype.update = function (point) {
  if (this._points.length > this.numTracked) {
    this._points.splice(0,1);
  }
  
  this._matched.length = 0;
  
  var p = this.transform ? this.transform(point) : point;
  
  this._points.push(p);
  
  if (this.condition && this.condition instanceof Array) {
    this.condition.forEach(function (gesture, i) {
      this.checkCondition(gesture.condition, i, gesture.onMatched);
    }, this);
    
    var results = this._matched.filter(function(match) {
      return match === true; 
    })
      
    if (results.length === this._matched.length) {
      this.onMatched.call(this, this.name, this._points);
      this.reset();
    }
  }
  else if (this.condition) {
    this.checkCondition(this.condition, 0, this.onMatched);  
  }
}

// call the condition function with the current state of the points. If the
// condition function returns a truthy value, the gesture is marked as matched.
Gesture.prototype.checkCondition = function (condition, idx, onMatched) {
  this._matched[idx] = condition.call(this, this._points);
  
  if (this._matched[idx]) {
    onMatched.call(this, this.name, this._points);
  }  
}

// reset this gesture by emptying it's array of points
Gesture.prototype.reset = function () {
  this._points.length = 0;

  if (this.onReset) {
    this.onReset.call(this);
  }
}

// return the thing!
module.exports = Gesture;

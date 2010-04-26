/**
* Stop any propagation - both capturing and bubbling. Conforms to DOM3.
* The 'this' keyword for 'stopPropagation' is a reference to the event object.
*/
Event.prototype.stopPropagation =
  function() {
    this.propagationStopped = true;
  };

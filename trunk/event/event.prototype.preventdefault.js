/**
* Prevent default action.  The default action is the semantics, often
* visual, of the HTML element that fired the event.
* The 'this' keyword for 'preventDefault' is a reference to the event object.
*/
Event.prototype.preventDefault =
  function() {
    if (this.cancelable) {
      this.defaultPrevented = true;
      this.e.returnValue = false;
    }
  };

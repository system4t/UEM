//http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent
// Constructor
window.MouseEvent =
  function() {
    this.altKey = null;
    this.button = null;
    this.clientX = null;
    this.clientY = null;
    this.ctrlKey = null;
    this.metaKey = null;
    this.relatedTarget = null;
    this.screenX = null;
    this.screenY = null;
    this.shiftKey = null;
  };
// Inherit from UIEvent
MouseEvent.prototype = new UIEvent();
// Reset constructor
MouseEvent.prototype.constructor = MouseEvent;

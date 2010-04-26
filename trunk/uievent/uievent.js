//http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-UIEvent

// Constructor
window.UIEvent =
  function() {
    // Rest of properties should be set with initUIEvent
    this.detail = null;
    this.view = window;
    // Extend to include all properties of Event object
  };

// Inherit from Event
UIEvent.prototype = new Event();
// Reset constructor
UIEvent.prototype.constructor = UIEvent;

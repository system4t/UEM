
  /**
   * Construct an Event object.
   * W3C Reference: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event  
   *
   * @param e { IE Event object } An actual IE event object. Optional 
   * @returns A new Event object
   * @type Event
   */
window.Event =
  function() {
    this.bubbles = null;
    this.cancelable = null;
    this.currentTarget = null;
    this.eventPhase = null;
    this.target = null;
    this.timeStamp = null;
    this.type = null;
  };

// Constants
Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

if (document.createEventObject) {

document.createEvent =
  function(type) {
    try {
      // We are holding back on MutationEvent and KeyboardEvent
      if (type == 'Event' || type == 'UIEvent' || type == 'TextEvent' || type == 'MouseEvent' || type == 'Event')
        return new window[type]
    }
    catch(e) {
      throw new Error('UEM: Event type not supported.');
    }
  };

// http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event
// Constructor
function Event() {
    this.bubbles = null
    this.cancelable = null;
    this.currentTarget = null;
    this.eventPhase = Event.CAPTURING_PHASE;
    this.target = null;
    this.timeStamp = (new Date()).getTime();
    this.type = null;
  }
// Constants
Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

// Methods
/**
* Initialize an event object.  Keyword 'this' is an event object.
* 
* @param type {String} Event type.
* @param canBubble Boolean that determines if the event propagates.
* @param cancelable Boolean that determines if the event can be cancelled. 
*/
Event.prototype.initEvent =
  function(type,canBubble,cancelable) {
    this.type = type;
    this.bubbles = canBubble;
    this.cancelable = cancelable;
  };

/**
* Stop any propagation - both capturing and bubbling. Conforms to DOM3.
* The 'this' keyword for 'stopPropagation' is a reference to the event object.
*/
Event.prototype.stopPropagation =
  function() {
    this.propagationStopped = true;
  };
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

// DOM 3 Methods
// http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-isCustom
Event.prototype.isCustom =
  function() {
    return false;
  };

// http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-isDefaultPrevented
Event.prototype.isDefaultPrevented =
  function() {
    return this.defaultPrevented;
  };

// http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-stopImmediatePropagation
Event.prototype.stopImmediatePropagation =
  function() {
  };
}
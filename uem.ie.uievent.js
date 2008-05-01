//http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-UIEvent

if (document.createEventObject) {
// Constructor
function UIEvent() {
    this.detail = null;
    this.view = window;
    // Extend to include all properties of Event object
  };
// Inherit from Event
UIEvent.prototype = new Event();
// Reset constructor
UIEvent.prototype.constructor = UIEvent;
// We don't want to inherit initEvent
UIEvent.prototype.initEvent = undefined;

// Methods
/**
* Initialize an event object.  Keyword 'this' is an event object.
* 
* @param type {String} Event type.
* @param canBubble Boolean that determines if the event propagates.
* @param cancelable Boolean that determines if the event can be cancelled. 
*/
UIEvent.prototype.initUIEvent =
  function(type,canBubble,cancelable,view,detail) {
    this.type = type;
    this.bubbles = canBubble;
    this.cancelable = cancelable;
    this.view = view;
    this.detail = detail;
  };
}
//http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-UIEvent

if (document.createEventObject) {
// Constructor
function TextEvent() {
    this.data = null;
  };
// Inherit from Event
TextEvent.prototype = new UIEvent();
// Reset constructor
TextEvent.prototype.constructor = TextEvent;
// We don't want to inherit initUIEvent or the detail property
TextEvent.prototype.initUIEvent = undefined;
TextEvent.prototype.detail = undefined;

// Methods
/**
* Initialize an event object.  Keyword 'this' is an event object.
* 
* @param type {String} Event type.
* @param canBubble Boolean that determines if the event propagates.
* @param cancelable Boolean that determines if the event can be cancelled. 
*/
TextEvent.prototype.initTextEvent =
  function(type,canBubble,cancelable,view,data) {
    this.type = type;
    this.bubbles = canBubble;
    this.cancelable = cancelable;
    this.view = view;
    this.data = data;
  };
}
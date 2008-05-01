//http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-UIEvent

if (document.createEventObject) {
// Constructor
function MouseEvent() {
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
// Inherit from Event
MouseEvent.prototype = new UIEvent();
// Reset constructor
MouseEvent.prototype.constructor = MouseEvent;
// We don't want to inherit initUIEvent
MouseEvent.prototype.initUIEvent = undefined;

// Methods
/**
* Initialize an event object.  Keyword 'this' is an event object.
* 
* @param type {String} Event type.
* @param canBubble Boolean that determines if the event propagates.
* @param cancelable Boolean that determines if the event can be cancelled. 
*/
MouseEvent.prototype.initMouseEvent =
  function(type,canBubble,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget) {
    this.type = type;
    this.bubbles = canBubble;
    this.cancelable = cancelable;
    this.view = view;
    this.detail = detail;
    this.screenX = screenX; 
    this.screenY = screenY;
    this.clientX = clientX;
    this.clientY = clientY;
    this.ctrlKey = ctrlKey;
    this.altKey = altKey;
    this.shiftKey = shiftKey;
    this.metaKey = metaKey;
    this.button = button;
  };
}

//DOM 3 Methods
MouseEvent.prototype.getModifierState =
  function(keyIdentifier) {
  };
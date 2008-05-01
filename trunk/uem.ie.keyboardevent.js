//http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-UIEvent

if (document.createEventObject) {
// Constructor
function KeyboardEvent() {
    this.altKey = null;
    this.ctrlKey = null;
    this.keyIdentifier = null;
    this.keyLocation = null;
    this.metaKey = null;
    this.shiftKey = null;

  };
// Inherit from UIEvent
KeyboardEvent.prototype = new UIEvent();
// Reset constructor
KeyboardEvent.prototype.constructor = KeyboardEvent;
// We don't want to inherit initUIEvent or the detail property
KeyboardEvent.prototype.initUIEvent = undefined;
KeyboardEvent.prototype.detail = undefined;

// Constants
KeyboardEvent.DOM_KEY_LOCATION_STANDARD = 0;
KeyboardEvent.DOM_KEY_LOCATION_LEFT = 1;
KeyboardEvent.DOM_KEY_LOCATION_RIGHT = 2;
KeyboardEvent.DOM_KEY_LOCATION_NUMPAD = 3;

// Methods
/**
* Initialize an event object.  Keyword 'this' is an event object.
* 
* @param type {String} Event type.
* @param canBubble Boolean that determines if the event propagates.
* @param cancelable Boolean that determines if the event can be cancelled. 
*/
KeyboardEvent.prototype.initKeyboardEvent =
  function(type,canBubble,cancelable,view,keyIdentifier,keyLocation,modifiersList) {
    this.type = type;
    this.bubbles = canBubble;
    this.cancelable = cancelable;
    this.view = view;
    this.keyIdentifier = keyIdentifier;
    this.keyLocation = keyLocation;
    // Don't know yet what to do with modifiersList
  };

//DOM 3 Methods
KeyboardEvent.prototype.getModifierState =
  function(keyIdentifier) {
  };
//http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-TextEvent

if (document.createEventObject) {
  // Constructor
  function TextEvent() {
    this.data = null;
    this.detail = undefined;
  };
  // Inherit from UIEvent
  TextEvent.prototype = new UIEvent();
  // Reset constructor
  TextEvent.prototype.constructor = TextEvent;
 
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
    this.initUIEvent(type, canBubble, cancelable, view, 0);
    this.detail = undefined;
    this.data = data;
  };
}
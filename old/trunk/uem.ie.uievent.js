//http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-UIEvent

if (document.createEventObject) {
  // Constructor
  /*@cc_on
  function UIEvent() {
    // Rest of properties should be set with initUIEvent
    this.detail = null;
    this.view = window;
    // Extend to include all properties of Event object
  }
  @*/
  // Inherit from Event
  UIEvent.prototype = new Event();
  // Reset constructor
  UIEvent.prototype.constructor = UIEvent;

  // Methods
  /**
   * Initialize an event object.  Keyword 'this' is an event object.
   * 
   * @param type {String} Event type.
   * @param canBubble Boolean that determines if the event propagates.
   * @param cancelable Boolean that determines if the event can be cancelled.
   * @param view The view from which the event was generated.
   * @param detail Detailed information about the event.  For MouseEvents, the
   *    detail identifies the button pressed.
   */
  UIEvent.prototype.initUIEvent =
    function(type,canBubble,cancelable,view,detail) {
    this.initEvent(type, canBubble, cancelable);
    this.view = view;
    this.detail = detail;
  };
}
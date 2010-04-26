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

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

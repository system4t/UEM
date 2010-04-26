// http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-isDefaultPrevented
Event.prototype.isDefaultPrevented =
  function() {
    return this.defaultPrevented;
  };

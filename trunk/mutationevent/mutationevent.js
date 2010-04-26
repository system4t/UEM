// http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MutationEvent
window.MutationEvent =
  function(e) {
    this.attrChange = null;
    this.attrName = null;
    this.newValue = null;
    this.prevValue = null;
    this.relatedNode = null;
  };

// Inherit from Event
MutationEvent.prototype = new Event();
// Reset constructor
MutationEvent.prototype.constructor = MutationEvent;

// Constants
MutationEvent.MODIFICATION = 1;
MutationEvent.ADDITION = 2;
MutationEvent.REMOVAL = 2;

// http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MutationEvent

if (document.createEventObject) {
  // Constructor
  /*@cc_on
  function MutationEvent(e) {
      this.attrChange = null;
      this.attrName = null;
      this.newValue = null;
      this.prevValue = null;
      this.relatedNode = null;
    };
  @*/
  // Inherit from Event
  MutationEvent.prototype = new Event();
  // Reset constructor
  MutationEvent.prototype.constructor = MutationEvent;
  
  // Constants
  MutationEvent.MODIFICATION = 1;
  MutationEvent.ADDITION = 2;
  MutationEvent.REMOVAL = 2;
  
  // Methods
  /**
  * Initialize an event object.  Keyword 'this' is an event object.
  * 
  * @param type {String} Event type.
  * @param canBubble Boolean that determines if the event propagates.
  * @param cancelable Boolean that determines if the event can be cancelled. 
  */
  MutationEvent.prototype.initMutationEvent =
    function(type,canBubble,cancelable,relatedNode,prevValue,newValue,attrName,attrChange) {
      this.initEvent(type, canBubble, cancelable);
      this.relatedNode = relatedNode;
      this.prevValue = prevValue;
      this.newValue = newValue;
      this.attrName = attrName;
      this.attrChange = attrChange;
    };
}

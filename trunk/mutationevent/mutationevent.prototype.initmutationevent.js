// Methods
/**
* Initialize an event object.  Keyword 'this' is an event object.
* 
* @param type {String} Event type.
* @param canBubble Boolean that determines if the event propagates.
* @param cancelable Boolean that determines if the event can be cancelled. 
*/
MutationEvent.prototype.initMutationEvent =
  function(type, canBubble, cancelable, relatedNode, prevValue, newValue, attrName, attrChange) {
    this.initEvent(type, canBubble, cancelable);
    this.relatedNode = relatedNode;
    this.prevValue = prevValue;
    this.newValue = newValue;
    this.attrName = attrName;
    this.attrChange = attrChange;
  };

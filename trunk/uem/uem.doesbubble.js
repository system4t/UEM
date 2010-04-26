/**
* Look up whether an event of a given type bubbles.
* 
* @param type {String} Event type.
* @return true if the event can be capture or bubble propagated.  If
* event propagation is surpressed, return false.
*/
UEM.doesBubble =
  function(type) {
    try {
      return UEM.eventTable[type].bubbles;
    }
    catch (e) {
      throw new Error('UEM: Unsupported event type: ' + type);
    }
  };

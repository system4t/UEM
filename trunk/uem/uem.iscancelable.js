/**
* Look up whether an event of a given type is cancelable.
* 
* @param type {String} Event type.
* @return true if the event is cancelable as defined by the W3C DOM event
* specification.
*/
UEM.isCancelable =
  function(type) {
    try {
      return UEM.eventTable[type].cancels;
    }
    catch (e) {
      throw new Error('UEM: Unsupported event type: ' + type);
    }
  };

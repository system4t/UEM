/**
* Find the event class, given only an event name.
* @param type
* @return one of 'Event', 'UIEvent', 'MouseEvent', 'TextEvent',
* 'KeyboardEvent', or 'MutationEvent'.
*/
UEM.getEventClass =
  function(type) {
    try {
      return UEM.eventTable[type].eventClass;
    }
    catch (e) {
      throw new Error('UEM: Unsupported event type: ' + type);
    }
  };

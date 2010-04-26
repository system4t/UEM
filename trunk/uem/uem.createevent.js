/**
* Create an event for dispatching.  This method belongs to HTML elements which
* supply values for it's this keyword.
*
* W3C reference: http://www.w3.org/TR/DOM-Level-3-Events/events.html#Events-DocumentEvent-createEvent
* 
* Mozilla reference: http://developer.mozilla.org/en/docs/DOM:document.createEvent
* 
* IE reference: http://msdn2.microsoft.com/en-us/library/ms536390.aspx
* 
* Note:  The approach used now is using fireEvent to actually initiate an
*        event in IE. It might be better/more feasible to leave out fireEvent
*        and just create the type of event directly.
*        
* @param type { String } 'Event', 'MouseEvent', or 'UIEvent'.
* @param e { IE Event object } An actual IE event object. Optional   
* @return an event object.
*/
document.createEvent =
  function(eventClass, e) {
    // We are holding back on MutationEvent and KeyboardEvent
    if (eventClass == 'Event' || eventClass == 'HTMLEvent' || eventClass == 'UIEvent' || eventClass == 'TextEvent' || eventClass == 'MouseEvent' || eventClass == 'KeyboardEvent' || eventClass == 'MutationEvent') {
      // Map HTMLEvents to Event.
      if (eventClass == 'HTMLEvent')
        eventClass = 'Event';
      return new window[eventClass](e);
    }
    else
      throw new Error('UEM: Event class not supported.');
  };

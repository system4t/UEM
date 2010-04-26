/**
* Dispatch an event into any element.  This method belongs to HTML elements which
* supply values for it's this keyword.
* 
* W3C reference: http://www.w3.org/TR/DOM-Level-3-Events/events.html#Events-EventTarget-dispatchEvent
* 
* Mozilla reference: http://developer.mozilla.org/en/docs/DOM:element.dispatchEvent
* 
* IE reference: http://msdn2.microsoft.com/en-us/library/ms536423.aspx
*
* @param e The event to dispatch.
* @return true if the event was successfully dispatched and false if the
* event was cancelled.
* 
* Currently we avoid to use native IE event object and fireEvent method when dispatching.
* See also notes in UEM.wrapper.         
*/
UEM.dispatchEvent =
  function(e) {
    // When dispatch by the user the target is not set before now
    e.target = this;
    UEM.wrapper.call(this, e);
  };

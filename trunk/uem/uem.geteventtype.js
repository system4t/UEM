/**
* Translate name of event type from W3C to IE.
* 
* @param type {String} A W3C event name.
* @return the native event name.
*/
UEM.getEventType =
  function(type) {
    return UEM.eventTypes[type] ? UEM.eventTypes[type] : type;
  };

// Event type translation table
// Translate name of event type from W3C to IE
UEM.eventTypes =
  {
    DOMActivate: 'activate',
    DOMFocusIn: 'focusin',
    DOMFocusOut: 'focusout',
    // Don't know wheter this is W3C but Firefox is using DOMMouseScroll
    DOMMouseScroll: 'mousewheel'
  };
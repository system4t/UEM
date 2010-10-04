/**
* The event handler for all elements on all types of events
* except for the onpropertychange which is handled separately.  The
* assignment of the event handler is made in addEventListener.  The 'this'
* keyword for wrapper references the same object as the 'this' keyword
* for this call to addEventListener.  During propagation, the 'this'
* keyword refers to the same element as the currentTarget property of the
* event object.
* 
* EXPERIMENTAL: If argument e is supplied UEM.wrapper was called from UEM.dispatch.
*               This is a cleaner way of dispatching as IE behaves weird with UEM +
*               natie fireEvent method,            
*/
UEM.wrapper =
  function(e) {
    // If e is supplied this is event is dispatched by the user
    if (!e) {
      // Cancel bubbling - UEM takes care of this
      window.event.cancelBubble = true;
      // Create a proper W3C event object
      var e = UEM.createEventObject(window.event);
    }
    // Shortcut - the type of event. 'UEM' string added to minimize chance of property already existing.
    var eType = 'UEM' + e.type;
    // Temp. array for event functions higher up in the DOM structure - capture phase
    var aCap = [];
    // Temp. array for event functions higher up in the DOM structure - bubbling phase
    var aBub = [];
    var n = this;
    // Add all parent nodes which have an event function for this event type
    while((n = n.parentNode) != null)
        aCap.push(n);
    // Insert window in propagation chain ONLY if target is window and
    // type of handler exist for document
    // TODO: Check if this assumption is correct
    if (this == window && window[eType])
      aCap.push(window);
    // Reverse capture array to simulate capture phase
    aCap.reverse();
    // For all elements in capture chain. Return false if propagation was stopped
    if (!e.propagate(aCap,true))
      return false;
    // Event phase changes to AT_TARGET
    e.eventPhase = Event.AT_TARGET;
    // Check whether event handler for the target
    // still exist. It might have been removed by
    // another event handler in the capturing phase
    if (this[eType]) {
      // Execute event handlers for this element
      // if the same function is registered twice
      // using both capture and bubbling, then that
      // handler will be executed twice now
      //
      // If 2 event handlers are registered - one for capture
      // and one for bubbling then a special case where the
      // first might cancel itself or the next may arise.
      //
      // Save original length
      var l = this[eType].length;
      for (var i=0; i<this[eType].length; i++) {
        e.currentTarget = this;
        // Apperently you can never have an event listener execute in the target phase
        // for the document object - at least not in Firefox, Opera and Safari so we also
        // avoid it
        if (this != document) {
          // Do not trigger a capture phase handler for this element for an event
          // dispatched directly to this element unless this option is enabled by user
          if (!this[eType][i].useCapture || UEM.CAPTURE_ON_TARGET) {
            // Execute event handler
            this[eType][i].fnc.call(this,e);
            // Check whether stopPropagation() has been called
            if (e.propagationStopped)
              return false;
            // It is possible that this['UEM'+e.type] has now been modified
            // If this['UEM'+e.type] does not exist anymore just break
            if (!this[eType])
              break;
            // If the length of the array has been shortened
            else if (l > this[eType].length) {
              l = this[eType].length;
              i--;
            }
          }
        }
      }
    }
    // Only do bubbling phase if event bubbles
    if (e.bubbles) {
      // Event phase changes to BUBBLING_PHASE
      e.eventPhase = Event.BUBBLING_PHASE;
      // For all elements in bubbling chain. Return false if propagation was stopped
      if (!e.propagate(aCap.reverse(),false))
        return false;
    }
    return true;
  };

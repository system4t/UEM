/**
* Add an event listener.  This method belongs to HTML elements which
* supply values for it's this keyword.
*
* W3C Reference: http://www.w3.org/TR/DOM-Level-3-Events/events.html#Events-listeners
*  
* Mozilla reference: http://developer.mozilla.org/en/docs/DOM:element.addEventListener
*  
* @param type { String } Event type. One of DOMActivate, DOMFocusIn,
*     DOMFocusOut, abort, blur, change, click, dblclick, error, focus,
*     load, keydown, keypress, keyup, mousedown, mousemove, mouseover,
*     mouseup, reset, resize, scroll, select, submit, textinput, or  
*     unload. Of these, dbclick is an extension to the set of W3C event
*     types.
* @param fnc { Function } The handler for the event.
* @param useCapture {boolean} If true, then the handler is available for
*     invocation during the capture and target phases of event propagation.
*     If false, the handler is available for invocation during the target
*     and bubble phases.
*/
UEM.addEventListener =
  function(type, fnc, useCapture) {
    // For unknown reasons 'this' is not equal to window if a function
    // which is defined on an object is called as a method on window
    // Using call solves it.
    if (this.self && !UEM.ADD_TO_WINDOW) {
      // onload events *must* be assigned using attachEvent
      if (type == 'load')
        window.attachEvent('onload',function(){var e = UEM.createEventObject(window.event); fnc(e);});
      else {
        UEM.ADD_TO_WINDOW = true;
        arguments.callee.call(window, type, fnc, useCapture);
        UEM.ADD_TO_WINDOW = false;
      }
      return;
    }
    // Translate to W3C type
    type = UEM.getEventType(type);
    // Shortcut - the type of event. 'UEM' string added to minimize chance of property already existing.
    var eType = 'UEM'+type;
    // If no events are registered for this element
    // and this type of event create array to hold
    // event handlers for this type of event
    if (!this[eType])
      this[eType] = new Array();
    var l = this[eType].length;
    // Do not register duplicate event handlers
    for(var i=0; i<l; i++) {
      if (this[eType][i].fnc == fnc && this[eType][i].useCapture === useCapture)
        return;
    }
    // If this is a capture handler insert it as the last capture handler but
    // before any target/bubbling handler to prevent out-of-order execution
    // in the target phase.
    if (useCapture) {
      // Find first bubbling handler
      for(var i=0; i<l; i++) {
        if (!this[eType][i].useCapture)
          break;
      }
      // i is the position for the new capture handler
      // IE needs 2nd argument for array.splice - this is an error in IE
      var bHandlers = this[eType].splice(i, this[eType].length - i);
      // Create object for storing function reference to event handler
      // and boolean for using capture or not
      this[eType][i] = {};
      // Remember whether we want to use the capture phase or not
      this[eType][i].useCapture = useCapture;
      // Save function reference
      this[eType][i].fnc = fnc;
      // Concat arrays
      this[eType] = this[eType].concat(bHandlers);
    }
    // This is a target/bubbling handler just append to array
    else {
      // Create object for storing function reference to event handler
      // and boolean for using capture or not
      this[eType][l] = {};
      // Remember whether we want to use the capture phase or not
      this[eType][l].useCapture = useCapture;
      // Save function reference
      this[eType][l].fnc = fnc;
    }
    // Declare the event handler for this type of event to be the UEM.Wrapper
    this['on'+type] = UEM.wrapper;
  };

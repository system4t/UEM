/**
* Remove an event listener.  This method belongs to HTML elements which
* supply values for it's this keyword.
*
* W3C Reference: http://www.w3.org/TR/DOM-Level-3-Events/events.html#Events-listeners
*  
* Mozilla reference: http://developer.mozilla.org/en/docs/DOM:element.removeEventListener
*  
* @param type { String } Event type. One of DOMActivate, DOMFocusIn,
*     DOMFocusOut, abort, blur, change, click, dblclick, error, focus,
*     load, keydown, keypress, keyup, mousedown, mousemove, mouseover,
*     mouseup, reset, resize, scroll, select, submit, textinput, or  
*     unload. Of these, dbclick is an extension to the set of W3C event
*     types.
* @param fnc { Function } The handler for the event to be removed.
* @param useCapture {boolean} If true, then the handler is available for
*     invocation during the capture and target phases of event propagation.
*     If false, the handler is available for invocation during the target
*     and bubble phases.
*/
UEM.removeEventListener =
  function(type, fnc, useCapture) {
    type = UEM.getEventType(type);
    // Shortcut - the type of event. 'UEM' string added to minimize chance of property already existing.
    var eType = 'UEM'+type;
    // If handler exist for this element and this type of event
    if (this[eType]) {
      var l = this[eType].length;
      // Remove handler if function and useCapture match
      for(var i=0; i<l; i++) {
        if (this[eType][i].fnc == fnc && this[eType][i].useCapture === useCapture) {
          // Reorder array - move j+1 to j
          for(var j=i; j<l-1; j++) {
            this[eType][j] = this[eType][j+1]; 
          }
          this[eType].length--;
          // If array is empty then no event handlers of this type
          // is registered for this element. Remove array.
          if (!this[eType].length) {
            this[eType] = null;
            // Also remove reference from type of event to UEM.wrapper
            // Will avoid memory leak in IE 6.1
            this['on'+type] = null;
          }
          break;
        }
      }
    }
  };

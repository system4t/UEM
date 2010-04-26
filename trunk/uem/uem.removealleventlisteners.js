/**
* Used for removing all event handlers when assigning a single handler as a property
* NOTE: Currently only called by UEM.watch when watching is DISABLED. Hence no need
*       to disable watching in this function.
*       
* @param type { String } Event type. One of DOMActivate, DOMFocusIn,
*     DOMFocusOut, abort, blur, change, click, dblclick, error, focus,
*     load, keydown, keypress, keyup, mousedown, mousemove, mouseover,
*     mouseup, reset, resize, scroll, select, submit, textinput, or  
*     unload. Of these, dbclick is an extension to the set of W3C event
*     types.
*/
UEM.removeAllEventListeners =
  function(type) {
    UEM.getEventType(type);
    // If a type is provided remove only event handlers of that type
    if (type) {
      // Remove array of UEM object holding true event handler functions
      this['UEM'+type] = null;
      // Remove the actual event property of the element
      this['on'+type] = null;
    }
    // Else remove all event handlers
    // ** NOT WORKING YET - BUT NOT USED YET ** // 
    else {
      /*
    var tmp = "";
    for(var p in this) {
      if (typeof this[p] == "object" && p.match(/^on/) || && p != "onpropertychange") {
        tmp = p.replace(/on/,"");
        this['UEM'+tmp] = null;
        this[p] = null;
      }
    }
       */
    }
  };

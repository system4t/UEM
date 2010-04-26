UEM.createEventObject =
  function(ie_event) {
    // Get event class
    try {
    var eClass = UEM.getEventClass(ie_event.type);
    // Construct object
    var e = new window[eClass](ie_event);
    }
    catch(err) {
      alert(ie_event.type);
    }
    // Init UEM Event properties: currentTarget, eventPhase, target, timeStamp
    e.initUEMEvent(ie_event);
    // Determine general properties
    // If bubbling is enabled check whether event type actually bubbles
    var bubbles = UEM.doesBubble(ie_event.type);
    // If canceling is enabled (or not set at all) check whether event type can actually be cancelled
    // The cancelable property is set by Event.prototype.toIE when event is created from Element.dispatch
    var cancelable = ie_event.cancelable !== false || ie_event.cancelable === undefined ? UEM.isCancelable(ie_event.type) : false;
    // Switch on event class
    switch(eClass) {
      case 'Event':
        e.initEvent(ie_event.type, bubbles, cancelable);
        break;
      case 'UIEvent':
        e.initUIEvent(ie_event.type, bubbles, cancelable, window, null);
        break;
      case 'MouseEvent':
        // Number of clicks on mouse if any
        var detail = null;
        if (ie_event.type == 'dblclick')
          detail = 2;
        else if (ie_event.type == 'click' || ie_event.type == 'mouseup' || ie_event.type == 'mousedown')
          detail = 1;
        // wheel moves in multiplum of 120 and direction is reversed -> so multiply by -1 and divide by 40
        // to get Firefox equivalent
        else if (ie_event.type == 'mousewheel')
          detail = -1 * ie_event.wheelDelta / 40;
        // Translate button number from IE to W3C
        var button = UEM.getButton(ie_event.button);
        // Element which is related to the element firing the event
        var relatedTarget = null;
        if (ie_event.type == 'mouseout')
          relatedTarget = ie_event.toElement;
        else if (ie_event.type == 'mouseover')
          relatedTarget = ie_event.fromElement;
        e.initMouseEvent(ie_event.type, bubbles, cancelable, window, detail, ie_event.screenX, ie_event.screenY, ie_event.clientX, ie_event.clientY, ie_event.ctrlKey, ie_event.altKey, ie_event.shiftKey,null, button, relatedTarget);
        break;
      case 'TextEvent':
        var data = String.fromCharCode(ie_event.keyCode);
        e.initTextEvent(ie_event.type, bubbles, cancelable, window, data);
        e.ctrlKey = ie_event.ctrlKey;
        e.altKey = ie_event.altKey;
        e.shiftKey = ie_event.shiftKey;
        e.metaKey = false;
        break;
      case 'KeyboardEvent':
        // Not used at the moment
        var modifiersList = '';
        var keyIdentifier = null;
        e.keyCode = ie_event.keyCode;
        if (UEM.getW3CKeyIdentifier) {
          keyIdentifier = UEM.getW3CKeyIdentifier(ie_event.keyCode);
        }
        var keyLocation = KeyboardEvent.DOM_KEY_LOCATION_STANDARD;
        // keyIdentifier == 'Control'
        if (ie_event.keyCode == 17)
          keyLocation = ie_event.ctrlLeft ? KeyboardEvent.DOM_KEY_LOCATION_LEFT : KeyboardEvent.DOM_KEY_LOCATION_RIGHT;
        // keyIdentifier == 'Shift'
        else if (ie_event.keyCode == 16) 
          keyLocation = ie_event.shiftLeft ? KeyboardEvent.DOM_KEY_LOCATION_LEFT : KeyboardEvent.DOM_KEY_LOCATION_RIGHT;
        // keyIdentifier == 'Alt'
        else if (ie_event.keyCode == 18)
          keyLocation = ie_event.altLeft ? KeyboardEvent.DOM_KEY_LOCATION_LEFT : KeyboardEvent.DOM_KEY_LOCATION_RIGHT;
        // Left Win
        else if (ie_event.keyCode == 91) 
          keyLocation = KeyboardEvent.DOM_KEY_LOCATION_LEFT;
        // Right Win
        else if (ie_event.keyCode == 92) 
          keyLocation = KeyboardEvent.DOM_KEY_LOCATION_RIGHT;
        // Number pad
        else if (96 <= ie_event.keyCode && ie_event.keyCode <= 105) 
          keyLocation = KeyboardEvent.DOM_KEY_LOCATION_NUMPAD;
        if (ie_event.ctrlKey)
          modifiersList += " Control";
        if (ie_event.altKey)
          modifiersList += " Alt";
        if (ie_event.shiftKey)
          modifiersList += " Shift";
        // Remove leading space
        if (modifiersList.length > 0)
          modifiersList = modifiersList.substring(1);
        e.initKeyboardEvent(ie_event.type, bubbles, cancelable, window, keyIdentifier, keyLocation, modifiersList);
        break;
      case 'MutationEvent':
        // Not used at the moment
        /*
        var relatedNode = null;
        var prevValue = null;
        var newValue = null;
        var attrName = null;
        var attrChange = null;
        e.initMutationEvent(ie_event.type, bubbles, cancelable, relatedNode, prevValue, newValue, attrName, attrChange);
         */
        break;
      default:  
        break;
    }
    return e;
  };

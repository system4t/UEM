// Content
//  1. User configurable settings
//  2. W3C EventListener Interface
//  3. UEM EventListener utility methods
//  4. UEM Event Wrapper
//  5. Interaction with EPE
//  6. UEM Event object utility methods

// Works for IE version 6.0 and above
if (document.createEventObject) {

  /***********************************************
   *
   *
   *  Section 1 - User configurable settings
   *
   *
   ***********************************************/

  // Declare namespace
  UEM = {};

  // Include support for assigning event handlers
  // through innerHTML or assigning as properties.
  // If you are only assigning event handlers using
  // element.addEventListener turn this feature off
  // for increased performance.
  // Default value is 1. Set to 0 to turn off
  UEM.WATCH_PROPERTIES = 1;
  
  // Execute event listeners for the target in the
  // capture phase. This behavior is also implemented
  // in Firefox, Opera and Safari although the W3C standard
  // says the opposite.
  // Default value is 1. Set to 0 to turn off
  UEM.CAPTURE_ON_TARGET = 1;
  
  // THERE ARE NO CONFIGURABLE SETTINGS BELOW THIS LINE

  /***********************************************
   *
   *
   *  Section 2 - W3C EventListener Interface
   *
   *
   ***********************************************/

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
  UEM.ADD_TO_WINDOW = false; 
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
      // Don't monitor changes in elements properties while assigning new event handler
      // This can lead to all kind of unsuspected behaviors
      EPE.disableWatch(this);
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
        if (this[eType][i].fnc == fnc && this[eType][i].useCapture === useCapture) {
          // Enable watching of property changes
          EPE.enableWatch(this);
          return;
        }
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
      // Enable watching of property changes
      EPE.enableWatch(this);
    };

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
      // Don't monitor changes in elements properties while removing event handlers
      // This can lead to all kind of unsuspected behaviors
      EPE.disableWatch(this);
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
      // Enable watching of property changes
      EPE.enableWatch(this);
    };

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
    // Define createEvent
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
    
  /***********************************************
   *
   *
   *  Section 3 - UEM EventListener utility methods
   *
   *
   ***********************************************/
  
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
  
  /**
   * Return an array with names of events that EPE supports.  This is a subset
   * of the events that can actually be thrown natively, especially when the
   * browser is Internet Explorer.  The names returned are the native names,
   * not the W3C names.  The names returned are not prefixed with 'on'.  For
   * instance, 'activate' might be a member;  not 'DOMActivate' or 'onactivate'.
   * 
   * @param tag {String} An HTML tag name.
   * @return an array with names of allowed events.
   */
  UEM.getPossibleEventTypes =
    function(tag) {
      return UEM.elementEventTypes.allTags.concat(UEM.elementEventTypes[tag]);
    };
  
  // Lookup table for possible event types
  // W3C References: http://www.w3.org/2007/07/xhtml-basic-ref.html
  // http://www.w3.org/TR/1999/REC-html401-19991224/sgml/dtd.html
  UEM.elementEventTypes =
    {
      allTags: ['activate', 'click', 'dblclick', 'focusin', 'focusout', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mousewheel', 'mouseup'],
      a: ['blur','focus'],
      body: ['load','unload'],
      button: ['blur','focus'],
      form: ['reset','submit'],
      input: ['blur','change','focus','select'],
      label: ['blur','focus'],
      select: ['blur','change','focus'],
      textarea: ['blur','change','focus','select']
    };
  
  /**
   * If the specified tag is one that can have an event listener, return
   * true.  Otherwise false.  Most tags can have event listeners.  An
   * example of a tag that cannot have an event listener is 'br' or 'head'.
   *
   * @param tag {String} An HTML tag name.
   * @return true if the tag can have event listeners; otherwise, false.
   */
  UEM.canHaveEvents =
    function(tag) {
      var a = UEM.noEvents;
      var l = a.length;
      for(var i=0; i<l; i++) {
        if (a[i] == tag)
          return false;
      }
      return true;
    };
  
  // List of tags which can not have event listeners
  UEM.noEvents = ['br','style','script','head','meta','link','title'];
  
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
  
  /**
   * Convert functions defined as inline event handlers
   * to proper event listeners.
   *
   * @param f {String} The JavaScript statement or statements that define the
   * inline event handler.
   * @return a new W3C-compatible event handler.  The new handler takes an
   *     event object reference as it's first argument.  The new handler
   *     is wrapped in the body of an anonymous function.
   */
  UEM.convertInlineHandler =
    function(f) {
      // Get body of original event handler
      var m = f.toString().match(/\{([\s\S]*)\}/m)[1];
      var b = m.replace(/^\s*\/\/.*$/mg,'');
      // Wrap body in anonymous function with event as an extra argument
      return new Function('event',b);
    };
  
  /***********************************************
   *
   *
   *  Section 4 - UEM Event Wrapper
   *
   *
   ***********************************************/

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
      while((n = n.parentNode) != null) {
        if (n[eType])
          aCap.push(n);
      }
      // Insert document in propagation chain ONLY if target is document and
      // type of handler exist for document
      if (this == document && document[eType])
        aCap.push(document);
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
        // We have to iterate again as handlers in the
        // capture or atTarget phases might have removed/added
        // other handlers
        n = this;
        while((n = n.parentNode) != null) {
          if (n[eType])
            aBub.push(n);
        }
        // Insert document in propagation chain ONLY if target is document and
        // type of handler exist for document
        if (this == document && document[eType])
          aBub.push(document);
        if (this == window && window[eType])
          aBub.push(window);
        // Event phase changes to BUBBLING_PHASE
        e.eventPhase = Event.BUBBLING_PHASE;
        // For all elements in bubbling chain. Return false if propagation was stopped
        if (!e.propagate(aBub,false))
          return false;
      }
      return true;
    };
  
  /***********************************************
   *
   *
   *  Section 5 - Interaction with EPE
   *
   *
   ***********************************************/
  
  // Define Event interface for window
  window.addEventListener = UEM.addEventListener;
  window.removeEventListener = UEM.removeEventListener;
  window.dispatchEvent = UEM.dispatchEvent;
  window.removeAllEventListeners = UEM.removeAllEventListeners;

  
  // Define Event interface for document
  document.addEventListener = UEM.addEventListener;
  document.removeEventListener = UEM.removeEventListener;
  document.dispatchEvent = UEM.dispatchEvent;
  document.removeAllEventListeners = UEM.removeAllEventListeners;
  
  
  // Define Event interface for elements
  HTMLElement.prototype.addEventListener = UEM.addEventListener;
  HTMLElement.prototype.removeEventListener = UEM.removeEventListener;
  HTMLElement.prototype.dispatchEvent = UEM.dispatchEvent;
  HTMLElement.prototype.removeAllEventListeners = UEM.removeAllEventListeners;
  
  /**
   * Check for all possible native event handlers and convert to proper event
   * handlers.  This is a listener that is registered as a creation handler
   * with EPE.  The 'this' keyword refers to the element being created and is
   * supplied by EPE when the callback to onElementCreate is made.
   */
  UEM.onElementCreate =
    function() {
      // Get tagName
      var tag = this.tagName.toLowerCase();
      // If node is an element which can't have event listeners
      if (!UEM.canHaveEvents(tag))
        return;
      // Element may have event listeners
      // Possible types are click, dblclick, keydown, keypress, keyup, mousedown, mousemove, mouseout, mouseover, mouseup
      // and the types specific to the element
      var eTypes = UEM.getPossibleEventTypes(tag);
      var tmp = '';
      // For each possible event handler in tag 
      for(var p in eTypes) {
        tmp = 'on'+eTypes[p];
        // If handler is defined for node
        if (this[tmp]) {
          // Convert inline function to proper event listener and
          // register event listener. This will implicitely redefine the
          // inline event handler to UEM.wrapper
          this.addEventListener(eTypes[p], UEM.convertInlineHandler(this[tmp]), false);
        }
      }
    };
  
  /**
   * A property change listener.  It's purpose is to add an event listener
   * if required by some property change event.  The property
   * change event is generated when JavaScript code directly adds or sets a
   * property on a DOM HTML element or when JavaScript code adds elements
   * using the innerHTML property.
   *
   * The 'this' keyword refers to the element being created and is
   * supplied by EPE when the callback to onElementCreate is made.
   * 
   * @param e An Internet Explorer event object.
   */
  UEM.onElementChange =
    function(e) {
      var p = e.propertyName;
      if (p.match(/^on/))
        this.addEventListener(p, this[p], false);
    };
  
  // Create EPE PlugIn
  EPE.PlugIn.UEM = new EPE.PlugIn();
  // Register element create listener function with EPE
  EPE.PlugIn.UEM.addEPEListener('create',UEM.onElementCreate);
  // Register element change listener function with EPE
  // if enabled by user
  // functions
  if (UEM.WATCH_PROPERTIES)
    EPE.PlugIn.UEM.addEPEListener('change',UEM.onElementChange);
  
  /***********************************************
   *
   *
   *  Section 6 - UEM Event object utility methods
   *
   *
   ***********************************************/

  UEM.createEventObject =
    function(ie_event) {
      // Get event class
      var eClass = UEM.getEventClass(ie_event.type);
      // Construct object
      var e = new window[eClass](ie_event);
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
  
  /**
   * Look up whether an event of a given type bubbles.
   * 
   * @param type {String} Event type.
   * @return true if the event can be capture or bubble propagated.  If
   * event propagation is surpressed, return false.
   */
  UEM.doesBubble =
    function(type) {
      try {
        return UEM.eventTable[type].bubbles;
      }
      catch (e) {
        throw new Error('UEM: Unsupported event type: ' + type);
      }
    };
  
  /**
   * Get a W3C mouse button value for simple mouse events.  If two mouse
   * buttons are pressed simultaneously then
   * <table>
   * <thead><tr><th>Input</th><th>Output</th><th>Meaning</th><tr></thead>
   * <tbody>
   * <tr><td>0</td><td>0</td><td>No button was pressed.  Don't use this.</td></tr>
   * <tr><td>1</td><td>0</td><td>Left button is pressed.</td></tr>
   * <tr><td>2</td><td>2</td><td>Right button is pressed.</td></tr>
   * <tr><td>3</td><td>3</td><td>Left and right are both pressed.  Usage is not portable.</td></tr>
   * <tr><td>4</td><td>1</td><td>Middle button is pressed.</td></tr>
   * <tr><td>5</td><td>5</td><td>Left and middle are both pressed.  Usage is not portable.</td></tr>
   * <tr><td>6</td><td>6</td><td>Right and middle are both pressed.  Usage is not portable.</td></tr>
   * <tr><td>7</td><td>7</td><td>All three buttons are pressed.  Usage is not portable.</td></tr>
   * </tbody>
   * </table>
   * 
   * @param i The native code for the mouse button that was pressed.
   * @return value depends on how the mouse is configured.  For a right-handed
   * mouse, return 0, 1, or 2 for a left, middle, or right mouse click.  For
   * a left-handed mouse, return 0, 1, or 2 for a right, middle, or left
   * mouse click.
  */
  UEM.getButton =
    function(i) {
      switch(i) {
        // Left button
        case 1:
          return 0;
        // Middle button
        case 4:
          return 1;
        default:
          return i;
      }
    };
  
  // W3C -> IE
  UEM.getIEButton =
    function(i) {
    switch(i) {
      case 0:
        return 1;
      case 1:
        return 4;
      default:
        return i;
    }
  };
  
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
  
  // Event property lookup table
  // Reference is summary table in
  // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-EventTypes-complete
  UEM.eventTable =
    {
    // HTMLEvent
    abort:
      {
        cancels: false,
        bubbles: true,
        eventClass: 'Event'
      },
    activate:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'UIEvent'
      },
    blur:
      {
        cancels: false,
        bubbles: false,
        eventClass: 'UIEvent'
      },
    // HTMLEvent
    change:
      {
        cancels: false,
        bubbles: true,
        eventClass: 'Event'
      },
    click:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'MouseEvent'
      },
    contextmenu:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'MouseEvent'
      },
    dblclick:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'MouseEvent'
      },
    // HTMLEvent
    error:
      {
        cancels: false,
        bubbles: true,
        eventClass: 'Event'
      },
    focus:
      {
        cancels: false,
        bubbles: false,
        eventClass: 'UIEvent'
      },
    focusin:
      {
        cancels: false,
        bubbles: true,
        eventClass: 'UIEvent'
      },
    focusout:
      {
        cancels: false,
        bubbles: true,
        eventClass: 'UIEvent'
      },
    keydown:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'KeyboardEvent'
      },
    keypress:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'TextEvent'
      },
    keyup:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'KeyboardEvent'
      },
    // HTLMEvent
    load:
      {
        cancels: false,
        bubbles: false,
        eventClass: 'Event'
      },
    mousedown:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'MouseEvent'
      },
    mousemove:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'MouseEvent'
      },
    mouseover:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'MouseEvent'
      },
    mouseout:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'MouseEvent'
      },
    mousewheel:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'MouseEvent'
      },
    mouseup:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'MouseEvent'
      },
    // HTMLEvent
    reset:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'Event'
      },
    // HTMLEvent
    resize:
      {
        cancels: false,
        bubbles: true,
        eventClass: 'Event'
      },
    // HTMLEvent
    scroll:
      {
        cancels: false,
        bubbles: true,
        eventClass: 'Event'
      },
    // HTMLEvent
    select:
      {
        cancels: false,
        bubbles: true,
        eventClass: 'Event'
      },
    // HTMLEvent
    submit:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'Event'
      },
    textInput:
      {
        cancels: true,
        bubbles: true,
        eventClass: 'TextEvent'
      },
    // HTMLEvent
    unload:
      {
        cancels: false,
        bubbles: false,
        eventClass: 'Event'
      }
    };
  }

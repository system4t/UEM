// Copyright 2007 - 2008 The JSLab Team, Tavs Dokkedahl and Allan Jacobs
// Contact: http://www.jslab.dk/contact.php
//
// This file is part of the Element Prototype Extension (EPE) Program.
//
// EPE is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License, or
// any later version.
//
// EPE is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

//  Credits - Many thanks to
//  
//  Laus Jensen     - For spending countless hours reading the W3C specifications and
//                    co-developing the very first prototype of UEM.
//  David Flanagan  - For writing The Definitive Guide and for comments on this project.
//  Allan Jacobs    - For fixing numerous bugs and co-working on the project.

// Content
//  1. User configurable settings
//  2. W3C EventListener Interface
//  3. UEM EventListener utility methods
//  4. UEM Event Wrapper
//  5. Interaction with EPE
//  6. W3C Event Interface (DOM 2)
//  7. W3C UIEvent Interface (DOM 2)
//  8. W3C MouseEvent Interface (DOM 2)
//  9. W3C MutationEvent Interface (DOM 2)
// 10. W3C TextEvent Interface (DOM 3)
// 11. W3C KeyboardEvent Interface (DOM 3)
// 12. UEM Event propagation
// 13. UEM Event Interface utility methods

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
  UEM.version = '1.9.4';
  UEM.wVersion = '1.9.4w1';

  // Include support for assigning event handlers
  // through innerHTML or assigning as properties.
  // If you are only assigning event handlers using
  // element.addEventListener turn this feature off
  // for increased performance.
  // Default value is 1. Set to 0 to turn off
  UEM.WATCH_PROPERTIES = 1;
  
  // Enable support for the W3C DOM 3 Event methods
  // in DOM 2 Event interfaces for those event
  // interfaces which are enabled
  // Default value is 0. Set to 1 to turn on
  UEM.ENABLE_W3C_DOM3_FEATURES = 0;
  
  // Enable support for the W3C TextEvent interface.
  // This is a DOM 3 interface.
  // Default value is 0. Set to 1 to turn on
  UEM.ENABLE_W3C_TEXT_EVENT = 0;
  
  // Enable support for the W3C KeyboardEvent interface.
  // This is a DOM 3 interface.
  // Default value is 0. Set to 1 to turn on
  UEM.ENABLE_W3C_KEYBOARD_EVENT = 0;
  
  // Enable support for the W3C MutationEvent interface.
  // Default value is 0. Set to 1 to turn on
  UEM.ENABLE_W3C_MUTATION_EVENT = 0;

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
  UEM.addEventListener = 
    function(type, fnc, useCapture) {
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
    // Create object for storing function reference to event handler
    // and boolean for using capture or not
    this[eType][l] = {};
    // Remember whether we want to use the capture phase or not
    this[eType][l].useCapture = useCapture;
    // Save function reference
    this[eType][l].fnc = fnc;
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
   * @return an event object.
   */
  UEM.createEvent =
    // Define createEvent
  document.createEvent =
    function(type) {
    try {
      // We are holding back on MutationEvent and KeyboardEvent
      if (type == 'Events') {
        return new Event();
      }
      else if (type == 'HTMLEvents') {
        return new Event();
      }
      else if (type == 'UIEvents') {
        return new UIEvent();
      }
      else if (type == 'TextEvents') {
        return new TextEvent();
      }
      else if (type == 'MouseEvents') {
        return new MouseEvent();
      }
      else if (type == 'KeyboardEvents') {
        return new KeyboardEvent();
      }
      else if (type == 'MutationEvents') {
        return new MutationEvent();
      }
    }
    catch(e) {
      throw new Error('UEM: Event type not supported.');
    }
    return null;
  };

  /* Old function
    function(type) {
      type = UEM.getEventType(type);
      // Create an actual IE event object
      var e = document.createEventObject();
      // The type of event - either MouseEvent of UIEvent
      e.infType = type;
      // Functions for initializing the event
      e.initEvent = UEM.Event.prototype.initEvent;
      e.initUIEvent = UEM.Event.prototype.initUIEvent;
      e.initMouseEvent = UEM.Event.prototype.initMouseEvent;
      return e;
    };
   */
  
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
   */
  UEM.dispatchEvent =
      function(e) {
      var windowevent = document.createEventObject();
      var eventClass = UEM.Event.getEventClass(e.type);
      windowevent.type = e.type;
      windowevent.bubbles = e.bubbles;
      windowevent.cancelable = e.cancelable;
      if (eventClass == 'MouseEvents') {
        windowevent.screenX = e.screenX;
        windowevent.screenY = e.screenY;
        windowevent.clientX = e.clientX;
        windowevent.clientY = e.clientY;
        windowevent.shiftKey = e.shiftKey;
        windowevent.ctrlKey = e.ctrlKey;
        windowevent.altKey = e.altKey;
        if (e.type == 'mouseout') {
          windowevent.toElement = this;
          windowevent.fromElement = e.relatedTarget;
        }
        else if (e.type == 'mouseover') {
          windowevent.toElement = e.relatedTarget;
          windowevent.fromElement = this;
        }
        if (e.button) {
          windowevent.button = UEM.Event.getIEButton(e.button);
        }
      }
      else if (eventClass == 'TextEvents') {
        windowevent.keyCode = String.charCodeAt(e.data);
      }
      else if (eventClass == 'KeyboardEvents') {
        
      }
      else if (eventClass == 'MutationEvents') {
        
      }
      // Argument e is an actual IE event object (ie. window.event)
      this.fireEvent('on'+e.type,windowevent);
      // Even though UEM.prototype.preventDefault will set
      // the returnValue to false fireEvent still returns true
      // Check for return value
      return e.returnValue === false ? false : true;
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
        allTags: ['click', 'dblclick', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'],
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
        DOMActivate:'activate',
        DOMFocusIn:'focusin',
        DOMFocusOut:'focusout'
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
       */
      UEM.wrapper =
        function() {
        // Cancel bubbling - UEM takes care of this
        window.event.cancelBubble = true;
        
        var windowevent = window.event;
        
        // Determine the event class from the event type.
        var cType = UEM.Event.getEventClass(windowevent.type);
        
        // Create a proper W3C event object
        var e = UEM.createEvent(cType);
        // Save ref. to window event - we ned this to set returnValue.
        e.e = windowevent;
        // Get the target from the window event.
        e.target = windowevent.srcElement;
        
        var bubbles;
        var cancelable;
        if (windowevent.bubbles === true || windowevent.bubbles === false) {
          bubbles = windowevent.bubbles;
        }
        else {
          bubbles = UEM.Event.doesBubble(windowevent.type);
        }
        if (windowevent.cancelable === true || windowevent.cancelable === false) {
          cancelable = windowevent.cancelable;
        }
        else {
          cancelable = UEM.Event.isCancelable(windowevent.type);
        }
        
        if (cType == 'Events' || cType == 'HTMLEvents') {
          e.initEvent(windowevent.type, bubbles, cancelable);
        }
        else if (cType == 'UIEvents') {
          e.initUIEvent(windowevent.type, bubbles, cancelable, window, null);
        }
        else if (cType == 'MouseEvents') {
          var detail = null;
          var relatedTarget = null;
          var button = UEM.Event.getButton(windowevent.button);
          if (windowevent.type == 'dblclick') {
            detail = 2;
          }
          else if (windowevent.type == 'click' || windowevent.type == 'mouseup' || windowevent.type == 'mousedown' ) {
            detail = 1;
          }
          else if (windowevent.type == 'mouseout') {
            relatedTarget = windowevent.fromElement;
          }
          else if (windowevent.type == 'mouseover') {
            relatedTarget = windowevent.toElement;
          }
          e.initMouseEvent(windowevent.type, bubbles, cancelable, window, detail,
          windowevent.screenX,windowevent.screenY,windowevent.clientX,windowevent.clientY,
          windowevent.ctrlKey,windowevent.altKey,windowevent.shiftKey,null,
          button,relatedTarget);
        }
        else if (cType == 'TextEvents') {
          var data = String.fromCharCode(windowevent.keyCode)
          e.initUIEvent(windowevent.type, bubbles, cancelable, window, data);
        }
        else if (cType == 'KeyboardEvents') {
          var modifiersList = '';
          var keyIdentifier = UEM.Event.keyCodeNoShiftToKeyIdentifier(windowevent.keyCode);
          if (!keyIdentifier) {
            var hexCode = e.keyCode.toString(16);
            for (var i = 0; i < hexCode - 4; i++) hexCode = "0" + hexCode;
            keyIdentifier = "U+" + hexCode;
          }
          var keyLocation = 0;
          if (e.keyIdentifier == 'Control') {
            keyLocation = (e.ctrlLeft ? 1: 2);
          }
          else if (e.keyIdentifier == 'Shift') {
            keyLocation = (e.shiftLeft ? 1: 2);
          }
          else if (e.keyIdentifier == 'Alt') {
            keyLocation = (e.altLeft ? 1: 2);
          }
          else if (windowevent.keyCode == 91) { // Left Win
            keyLocation = 1;
          }
          else if (windowevent.keyCode == 92) { // Right Win
            keyLocation = 2;
          }
          else if (96 <= windowevent.keyCode && windowevent.keyCode <= 105) { // Number pad
            keyLocation = 3;
          }
          e.initKeyboardEvent(windowevent.type, bubbles, cancelable, window,
          keyIdentifier, keyLocation, modifiersList);
        }
        else if (cType == 'MutationEvents') {
          var relatedNode = null;
          var prevValue = null;
          var newValue = null;
          var attrName = null;
          var attrChange = null;
          e.initMutationEvent(windowevent.type, bubbles, cancelable, 
          relatedNode, prevValue, newValue, attrName, attrChange);
        }
        
        // Shortcut - the type of event. 'UEM' string added to minimize chance of property already existing.
        var eType = 'UEM'+e.type;
        // Temp. array for event functions higher up in the DOM structure - capture phase
        var aCap = new Array();
        // Temp. array for event functions higher up in the DOM structure - bubbling phase
        var aBub = new Array();
        var n = this;
        // Add all parent nodes which have an event function for this event type
        while((n = n.parentNode) != null) {
          if (n[eType])
            aCap.push(n);
        }
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
          for (var i2=0; i2<this[eType].length; i2++) {
            e.currentTarget = this;
            // Execute event handler
            this[eType][i2].fnc.call(this,e);
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
              i2--;
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
      window.dispatchEvent = UEM.dispatchEvent
      window.removeAllEventListeners = UEM.removeAllEventListeners;
      
      // Define Event interface for document
      document.addEventListener = UEM.addEventListener;
      document.removeEventListener = UEM.removeEventListener;
      document.dispatchEvent = UEM.dispatchEvent
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
       *  Section 6 - UEM Event Interface utility methods
       *
       *
       ***********************************************/
      
      // Storage for event object utility methods
      UEM.Event = {};
      
      /**
       * Look up whether an event of a given type is cancelable.
       * 
       * @param type {String} Event type.
       * @return true if the event is cancelable as defined by the W3C DOM event
       * specification.
       */
      UEM.Event.isCancelable =
        function(type) {
        var tmp = UEM.Event.cancelTable[type];
        if (tmp === undefined)
          throw new Error('UEM.Event: Event type not defined in cancelTable');
        else
          return tmp;
      };
      
      /**
       * Look up whether an event of a given type bubbles.
       * 
       * @param type {String} Event type.
       * @return true if the event can be capture or bubble propagated.  If
       * event propagation is surpressed, return false.
       */
      UEM.Event.doesBubble =
        function(type) {
        var tmp = UEM.Event.bubbleTable[type];
        if (tmp === undefined)
          throw new Error('UEM.Event: Event type not defined in bubbleTable');
        else
          return tmp;
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
      UEM.Event.getButton =
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
    UEM.Event.getIEButton =
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
     * @return one of 'Events', 'HTMLEvents', 'UIEvents', 'MouseEvents', 'TextEvents',
     * 'KeyboardEvents', or 'MutationEvents'.
     */
    UEM.Event.getEventClass =
      function(type) {
      var r = 'Event';
      try {
        r = UEM.Event.classTable[type];
      }
      catch (ex) {
        r = 'Event';
      }
      return r;
    };
    
    // Lookup table for whether event is cancelable
    UEM.Event.cancelTable =
      {
      activate: true,
      focus: false,
      focusin: false,
      focusout: false,
      blur: false,
      textInput: true,
      click: true,
      dblclick: true,
      mousedown: true,
      mouseup: true,
      mouseover: true,
      mousemove: true,
      mouseout: true,
      keydown: true,
      keyup: true,
      keypress: true,
      load: false,
      unload: false,
      abort: false,
      error: false,
      select: false,
      change: false,
      submit: true,
      reset: true,
      resize: false,
      scroll: false
    };
    
    // Lookup table for whether event bubbles
    UEM.Event.bubbleTable =
      {
      activate: true,
      focus: false,
      focusin: true,
      focusout: true,
      blur: false,
      textInput: true,
      click: true,
      dblclick: true,
      mousedown: true,
      mouseup: true,
      mouseover: true,
      mousemove: true,
      mouseout: true,
      keydown: true,
      keyup: true,
      keypress: true,
      load: false,
      unload: false,
      abort: true,
      error: true,
      select: true,
      change: true,
      submit: true,
      reset: true,
      resize: true,
      scroll: true
    };
    
    // Lookup table for event class
    UEM.Event.classTable =
      {
      activate: 'UIEvents',
      focus: 'UIEvents',
      focusin: 'UIEvents',
      focusout: 'UIEvents',
      blur: 'UIEvents',
      textInput: 'TextEvents',
      click: 'MouseEvents',
      dblclick: 'MouseEvents',
      mousedown: 'MouseEvents',
      mouseup: 'MouseEvents',
      mouseover: 'MouseEvents',
      mousemove: 'MouseEvents',
      mouseout: 'MouseEvents',
      keydown: 'KeyboardEvents',
      keyup: 'KeyboardEvents',
      keypress: 'TextEvents',
      load: 'HTMLEvents',
      unload: 'HTMLEvents',
      abort: 'HTMLEvents',
      error: 'HTMLEvents',
      select: 'HTMLEvents',
      change: 'HTMLEvents',
      submit: 'HTMLEvents',
      reset: 'HTMLEvents',
      resize: 'HTMLEvents',
      scroll: 'HTMLEvents'
    };
    
  }
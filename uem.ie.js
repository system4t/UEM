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
        if (type == 'Event' || type == 'UIEvent' || type == 'TextEvent' || type == 'MouseEvent' || type == 'MutationEvent' || type == 'KeyboardEvent') {
        
          return new window[type]
        }
      }
      catch(e) {
        throw new Error('UEM: Event type not supported.');
      }
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
      // Argument e is an actual IE event object (ie. window.event)
      this.fireEvent('on'+e.type,e);
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
      // Create a proper W3C event object
      var e = UEM.createEvent(window.event);

      // Shortcut - the type of event. 'UEM' string added to minimize chance of property already existing.
      var eType = 'UEM'+e.type;
      // Temp. array for event functions higher up in the DOM structure - capture phase
      var aCap = new Array();
      // Temp. array for event functions higher up in the DOM structure - bubbling phase
      var aBub = new Array();
      var n = this;
      // Add all parent nodes which have an event function for this event type
      while(n = n.parentNode) {
        if (n[eType])
          aCap.push(n);
      }
      // Reverse capture array to simulate capture phase
      aCap.reverse();
      // For all elements in capture chain. Return false if propagation was stopped
      if (!e.propagate(aCap,true))
        return false;
      // Event phase changes to AT_TARGET
      e.eventPhase = e.AT_TARGET;
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
      // Only do bubbling phase if event bubbles
      if (e.bubbles) {
        // We have to iterate again as handlers in the
        // capture or atTarget phases might have removed/added
        // other handlers
        n = this;
        while(n = n.parentNode) {
          if (n[eType])
            aBub.push(n);
        }
        // Event phase changes to BUBBLING_PHASE
        e.eventPhase = e.BUBBLING_PHASE;
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
  *  Section 6 - W3C Event Interface (DOM 2)
  *
  *
  ***********************************************/

  /**
  * Construct an Event object.
  * W3C Reference: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event  
  * 
  * @returns A new Event object
  * @type Event
  */
  function Event() {
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-canBubble
    this.bubbles = null
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-canCancel
    this.cancelable = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-currentTarget
    this.currentTarget = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-eventPhase
    this.eventPhase = Event.CAPTURING_PHASE;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-target
    this.target = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-timeStamp
    this.timeStamp = (new Date()).getTime();
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-type
    this.type = null;
  }
  // Constants
  Event.CAPTURING_PHASE = 1;
  Event.AT_TARGET = 2;
  Event.BUBBLING_PHASE = 3;
  
  // Methods
  /**
  * Initialize an Event object.  Keyword 'this' is an Event object.
  * W3C Reference: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-initEvent  
  * 
  * @param type {String} Event type.
  * @param canBubble Boolean that determines if the event buubles.
  * @param cancelable Boolean that determines if the event can be cancelled. 
  */
  Event.prototype.initEvent =
    function(type,canBubble,cancelable) {
      var e = window.event;
      this.type = type ? type : e.type;
      this.bubbles = canBubble;
      this.cancelable = cancelable;
    };
  
  /**
  * Stop any propagation - both capturing and bubbling. Conforms to DOM3.
  * The 'this' keyword for 'stopPropagation' is a reference to the Event object.
  * W3C Reference: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-stopPropagation
  */
  Event.prototype.stopPropagation =
    function() {
      this.propagationStopped = true;
    };
  /**
  * Prevent default action.  The default action is the semantics, often
  * visual, of the HTML element that fired the event.
  * The 'this' keyword for 'preventDefault' is a reference to the Event object.
  * W3C Reference: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-preventDefault  
  */
  Event.prototype.preventDefault =
    function() {
      if (this.cancelable) {
        this.defaultPrevented = true;
        this.e.returnValue = false;
      }
    };
  
  // DOM 3 Methods - Not supported yet
  if (UEM.ENABLE_W3C_DOM3_FEATURES) {
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-isCustom
    Event.prototype.isCustom =
      function() {
        return false;
      };
    
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-isDefaultPrevented
    Event.prototype.isDefaultPrevented =
      function() {
        return this.defaultPrevented;
      };
    
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-stopImmediatePropagation
    Event.prototype.stopImmediatePropagation =
      function() {
      };
  }

  /***********************************************
  *
  *
  *  Section 7 - W3C UIEvent Interface (DOM 2)
  *
  *
  ***********************************************/
  
  /**
  * Construct an UIEvent object.
  * W3C Reference: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-UIEvent  
  * 
  * @returns A new UIEvent object
  * @type UIEvent
  */
  function UIEvent() {
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-UIEvent-detail
    this.detail = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-UIEvent-view
    this.view = window;
  };
  
  // Inherit from Event
  UIEvent.prototype = new Event();
  // Reset constructor
  UIEvent.prototype.constructor = UIEvent;
  // We don't want to inherit initEvent
  UIEvent.prototype.initEvent = undefined;
  
  // Methods
  /**
  * Initialize an UIEvent object.  Keyword 'this' is an UIEvent object.
  * W3C Reference: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-initUIEvent  
  * 
  * @param type {String} Event type.
  * @param canBubble Boolean that determines if the event propagates.
  * @param cancelable Boolean that determines if the event can be cancelled. 
  * @param view AbstractView The view attribute identifies the AbstractView from which the event was generated (This is always the window object)
  * @param detail Mixed Specifies some detail information about the Event, depending on the type of event.
  */
  UIEvent.prototype.initUIEvent =
    function(type,canBubble,cancelable,view,detail) {
      this.type = type;
      this.bubbles = canBubble;
      this.cancelable = cancelable;
      this.view = view;
      this.detail = detail;
    };

  /***********************************************
  *
  *
  *  Section 8 - W3C MouseEvent Interface (DOM 2)
  *
  *
  ***********************************************/

  /**
  * Construct a MouseEvent object.
  * W3C Reference: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent  
  * 
  * @returns A new MouseEvent object
  * @type MouseEvent
  */
  function MouseEvent() {
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent-altKey
    this.altKey = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent-button
    this.button = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent-clientX
    this.clientX = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent-clientY
    this.clientY = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent-ctrlKey
    this.ctrlKey = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent-metaKey
    this.metaKey = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent-relatedTarget
    this.relatedTarget = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent-screenX
    this.screenX = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent-screenY
    this.screenY = null;
    // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent-shiftKey
    this.shiftKey = null;

  };
  // Inherit from Event
  MouseEvent.prototype = new UIEvent();
  // Reset constructor
  MouseEvent.prototype.constructor = MouseEvent;
  // We don't want to inherit initUIEvent
  MouseEvent.prototype.initUIEvent = undefined;
  
  // Methods
  /**
  * Initialize a MouseEvent object.  Keyword 'this' is a MouseEvent object.
  * 
  * @param type {String} Event type.
  * @param canBubble Boolean that determines if the event propagates.
  * @param cancelable Boolean that determines if the event can be cancelled. 
  */
  MouseEvent.prototype.initMouseEvent =
    function(type,canBubble,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget) {
      this.type = type;
      this.bubbles = canBubble;
      this.cancelable = cancelable;
      this.view = view;
      this.detail = detail;
      this.screenX = screenX; 
      this.screenY = screenY;
      this.clientX = clientX;
      this.clientY = clientY;
      this.ctrlKey = ctrlKey;
      this.altKey = altKey;
      this.shiftKey = shiftKey;
      this.metaKey = metaKey;
      this.button = button;
    };
  
  // DOM 3 Methods - Not supported yet
  // http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-MouseEvent-getModifierState
  if (UEM.ENABLE_W3C_DOM3_FEATURES) {
    MouseEvent.prototype.getModifierState =
      function(keyIdentifier) {
      };
  }

  /***********************************************
  *
  *
  *  Section 9 - W3C MutationEvent Interface (DOM 2)
  *
  *
  ***********************************************/
  
  // Not supported yet
  if(UEM.ENABLE_W3C_MUTATION_EVENT) {
    // Constructor
    function MutationEvent() {
      this.attrChange = null;
      this.attrName = null;
      this.newValue = null;
      this.prevValue = null;
      this.relatedNode = null;
    };
    
    // Inherit from Event
    MutationEvent.prototype = new Event();
    // Reset constructor
    MutationEvent.prototype.constructor = MutationEvent;
    // We don't want to inherit initEvent
    MutationEvent.prototype.initEvent = undefined;
    
    // Constants
    MutationEvent.MODIFICATION = 1;
    MutationEvent.ADDITION = 2;
    MutationEvent.REMOVAL = 2;
    
    // Methods
    /**
    * Initialize a MutationEvent object.  Keyword 'this' is an event object.
    * 
    * @param type {String} Event type.
    * @param canBubble Boolean that determines if the event propagates.
    * @param cancelable Boolean that determines if the event can be cancelled. 
    */
    MutationEvent.prototype.initMutationEvent =
      function(type,canBubble,cancelable,relatedNode,prevValue,newValue,attrName,attrChange) {
        this.type = type;
        this.bubbles = canBubble;
        this.cancelable = cancelable;
        this.relatedNode = relatedNode;
        this.prevValue = prevValue;
        this.newValue = newValue;
        this.attrName = attrName;
        this.attrChange = attrChange;
      };
  }
  
  /***********************************************
  *
  *
  *  Section 10 -  W3C TextEvent Interface (DOM 3)
  *
  *
  ***********************************************/
  
  // Not supported yet
  if(UEM.ENABLE_W3C_TEXT_EVENT) {
    // Constructor
    function TextEvent() {
      this.data = null;
    };
    // Inherit from Event
    TextEvent.prototype = new UIEvent();
    // Reset constructor
    TextEvent.prototype.constructor = TextEvent;
    // We don't want to inherit initUIEvent or the detail property
    TextEvent.prototype.initUIEvent = undefined;
    TextEvent.prototype.detail = undefined;
    
    // Methods
    /**
    * Initialize an event object.  Keyword 'this' is an event object.
    * 
    * @param type {String} Event type.
    * @param canBubble Boolean that determines if the event propagates.
    * @param cancelable Boolean that determines if the event can be cancelled. 
    */
    TextEvent.prototype.initTextEvent =
      function(type,canBubble,cancelable,view,data) {
        this.type = type;
        this.bubbles = canBubble;
        this.cancelable = cancelable;
        this.view = view;
        this.data = data;
      };
  }
  
  /***********************************************
  *
  *
  *  Section 11 -  W3C KeyboardEvent Interface (DOM 3)
  *
  *
  ***********************************************/
  
  // Not supported yet
  if (UEM.ENABLE_W3C_KEYBOARD_EVENT) {
    function KeyboardEvent() {
      this.altKey = null;
      this.ctrlKey = null;
      this.keyIdentifier = null;
      this.keyLocation = null;
      this.metaKey = null;
      this.shiftKey = null;
  
    };
    // Inherit from UIEvent
    KeyboardEvent.prototype = new UIEvent();
    // Reset constructor
    KeyboardEvent.prototype.constructor = KeyboardEvent;
    // We don't want to inherit initUIEvent or the detail property
    KeyboardEvent.prototype.initUIEvent = undefined;
    KeyboardEvent.prototype.detail = undefined;
    
    // Constants
    KeyboardEvent.DOM_KEY_LOCATION_STANDARD = 0;
    KeyboardEvent.DOM_KEY_LOCATION_LEFT = 1;
    KeyboardEvent.DOM_KEY_LOCATION_RIGHT = 2;
    KeyboardEvent.DOM_KEY_LOCATION_NUMPAD = 3;
    
    // Methods
    /**
    * Initialize an event object.  Keyword 'this' is an event object.
    * 
    * @param type {String} Event type.
    * @param canBubble Boolean that determines if the event propagates.
    * @param cancelable Boolean that determines if the event can be cancelled. 
    */
    KeyboardEvent.prototype.initKeyboardEvent =
      function(type,canBubble,cancelable,view,keyIdentifier,keyLocation,modifiersList) {
        this.type = type;
        this.bubbles = canBubble;
        this.cancelable = cancelable;
        this.view = view;
        this.keyIdentifier = keyIdentifier;
        this.keyLocation = keyLocation;
        // Don't know yet what to do with modifiersList
      };
    
    //DOM 3 Methods
    KeyboardEvent.prototype.getModifierState =
      function(keyIdentifier) {
      };
  }

  /***********************************************
  *
  *
  *  Section 12 - UEM Event propagation
  *
  *
  ***********************************************/

  /**
  * Execute functions in propagation chain.  The 'this' keyword for
  * 'propagate' is a reference to the event object.
  * 
  * @param chain An array of exception handlers.  The handlers must be listed
  *    in the correct propagation order.
  * @param useCapture {Boolean} True to invoke capture phase exception handlers
  *    and false to execute bubble phase exception handlers.
  * @return true if the propagation chain executes to completion.  False, if
  *    one of the handlers invoked by propagate calls stopPropagation.
  */
  Event.prototype.propagate =
    function(chain,useCapture) {
      // Shortcut - the type of event. 'UEM' string added to minimize chance of property already existing.
      var eType = 'UEM'+this.type;
      // For all elements in capture chain
      for (var i=0; i<chain.length; i++) {
        // Check whether any handler still exist as
        // they might have been removed by other
        // handlers
        if (chain[i][eType]) {
          // For each event of this type
          var l = chain[i][eType].length;
          // Execute event handlers registered with this useCapture (either true or false)
          for (var j=0; j<l; j++) {
            if (chain[i][eType][j].useCapture === useCapture) {
              // Update currentTarget to element whose event handlers are currently being processed
              this.currentTarget = chain[i];
              chain[i][eType][j].fnc.call(chain[i],this);
              // Check whether stopPropagation has been called
              if (this.propagationStopped)
                return false;
            }
          }
        }
      }
      return true;
    };
  
  /***********************************************
  *
  *
  *  Section 13 - UEM Event Interface utility methods
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
  // Document Object Model Events: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html
  // Event types: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Event-types
  // DOM 3 TextEvent Interface: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-TextEvent
  // Appendix A: Keyboard events and key identifiers: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/keyset.html#KeySet
  
  // keydown and keyup generates Unicode characters
  // textInput (keypress) generates human-readable text
/*  
  UEM.Event.MouseEvent
  
  UEM.TextEvent =
    function(type, )
  */
}
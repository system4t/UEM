if (document.createEventObject) {

  /**
   * Construct an Event object.
   * W3C Reference: http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event  
   * 
   * @returns A new Event object
   * @type Event
   */
  function Event() {
    this.bubbles = null
    this.cancelable = null;
    this.currentTarget = null;
    this.eventPhase = Event.CAPTURING_PHASE;
    this.target = null;
    this.timeStamp = (new Date()).getTime();
    this.type = null;
  }
  // Constants
  Event.CAPTURING_PHASE = 1;
  Event.AT_TARGET = 2;
  Event.BUBBLING_PHASE = 3;

  // Methods
  /**
   * Initialize an event object.  Keyword 'this' is an event object.
   * 
   * @param type {String} Event type.
   * @param canBubble Boolean that determines if the event propagates.
   * @param cancelable Boolean that determines if the event can be cancelled. 
   */
  Event.prototype.initEvent =
    function(type,canBubble,cancelable) {
    this.type = type;
    this.bubbles = canBubble;
    this.cancelable = cancelable;
  };

  /**
   * Stop any propagation - both capturing and bubbling. Conforms to DOM3.
   * The 'this' keyword for 'stopPropagation' is a reference to the event object.
   */
  Event.prototype.stopPropagation =
    function() {
    this.propagationStopped = true;
  };
  /**
   * Prevent default action.  The default action is the semantics, often
   * visual, of the HTML element that fired the event.
   * The 'this' keyword for 'preventDefault' is a reference to the event object.
   */
  Event.prototype.preventDefault =
    function() {
    if (this.cancelable) {
      this.defaultPrevented = true;
      this.e.returnValue = false;
    }
  };

  // DOM 3 Methods
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
}
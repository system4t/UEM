// KeyboardEvent for Mozilla and Forefox

// NEEDS CORRECTION. DETECT SCRIPT ENGINE - NOT VENDOR
if (navigator.product == "Gecko" && navigator.vendor != "Apple Computer, Inc.") {
  
  UEM = {};

  /**
   * Keypress handler that adds the data property to the event.  This is a
   * capture phase and unless the developer gets creative, the first such capture
   * phase handler for keypress events.  This means that this handler will make
   * the data property available to all other keypress event handlers.
  */
  document.addEventListener(
    "keypress",
    function(e) {
      if (e.charCode) {
        e.data = String.fromCharCode(e.charCode);
      }
      if (e.charCode == 0) {
        e.stopPropagation();
      }
    },
    true
  );
    
  /**
   * Keyup and keydown handler that adds the keyIdentifier and keyLocation
   * properties to the event.  This is a capture phase and unless the developer
   * gets creative, the first such capture phase handler for keyboard events.
   * This means that this handler will make the keyIdentifier property available
   * to all other keyboard event handlers in this document.
  */
  
  // Now declaring the same function twise in order to avoid declaring in global namespace
  // Although redundant it doesn't really matter as this code is only executed once when
  // the document loads
  document.addEventListener(
    "keyup",
    function(e) {
      if (UEM.getW3CKeyIdentifier) {
        if (e.keyCode == 59) {
          // Semicolon
          e.keyIdentifier = "U+003B";
        }
        else if (e.keyCode == 61) {
          // Equals
          e.keyIdentifier = "U+003D";
        }
        else if (e.keyCode == 109) {
          // Minus
          e.keyIdentifier = "U+002D";
        }
        else {
          e.keyIdentifier = UEM.getW3CKeyIdentifier(e.keyCode);
        }
      }
      e.keyLocation = 0;
    },
    true
  );
  
  document.addEventListener(
    "keydown",
    function(e) {
      if (UEM.getW3CKeyIdentifier) {
        if (e.keyCode == 59) {
          // Semicolon
          e.keyIdentifier = "U+003B";
        }
        else if (e.keyCode == 61) {
          // Equals
          e.keyIdentifier = "U+003D";
        }
        else if (e.keyCode == 109) {
          // Minus
          e.keyIdentifier = "U+002D";
        }
        else {
          e.keyIdentifier = UEM.getW3CKeyIdentifier(e.keyCode);
        }
      }
      e.keyLocation = 0;
    },
    true
  );
  function TextEvent() {
    this.data = null;
  }
  TextEvent.prototype = document.createEvent("UIEvents");

  /**
   * Initialize a TextEvent.   Keyword 'this' is a window.event object.
   * 
   * @param type {String} Event type.
   * @param canBubble Boolean that determines if the event propagates.
   * @param cancelable Boolean that determines if the event can be cancelled.
   * @param view Reference to the view (window).
   * @param data A string.
  */
  TextEvent.prototype.initTextEvent =
    function(type, canBubble, cancelable, view, data) {
    var charCode = data.charCodeAt(0);
    var keyCode = charCode;
    var iShift = (62 <= keyCode && keyCode <= 90 ||
      33 <= keyCode && keyCode <= 42 ||
      keyCode == 58 || keyCode == 60 ||
      94 <= keyCode && keyCode <= 95 ||
      123 <= keyCode && keyCode <= 126 ||
      data == "+" || data == ":" || data == "_");
    
    this.initKeyEvent(type,canBubble, cancelable, view,
      false,
      false,
      iShift,
      false, keyCode, charCode);
  };
    
    /**
     * Initialize a KeyboardEvent.   Keyword 'this' is a window.event object.
     * 
     * @param type {String} Event type.
     * @param canBubble Boolean that determines if the event propagates.
     * @param cancelable Boolean that determines if the event can be cancelled.
     * @param view Reference to the view (window).
     * @param keyIdentifier Key identifier.
     * @param keyLocation Key location. 0 for standard, 1 for left, 2 for right,
     *    and 3 for numpad.
     * @param modifierList String containing "Alt", "Control", "Meta", and/or "Shift".
     */
    TextEvent.prototype.initKeyboardEvent =
      function(type, canBubble, cancelable, view, keyIdentifier, keyLocation, modifierList) {
      var ishift = modifierList.contains(/Shift/);
      var keyCode;
      if (ishift)
        keyCode = UEM.keyIdentifierShiftToKeyCode(keyIdentifier); 
      else
        keyCode = UEM.keyIdentifierNoShiftToKeyCode(keyIdentifier);
      // semicolon or colon
      if (keyIdentifier == "U+003B" || keyIdentifier == "U+003A")
        keyCode = 59;
      // equals or plus
      else if (keyIdentifier == "U+003D" || keyIdentifier == "U+002B")
        keyCode = 61;
      // minus or underscore
      else if (keyIdentifier == "U+002D" || keyIdentifier == "U+005F")
        keyCode = 109;
      var charCode = 0;
      this.keyIdentifier = keyIdentifier;
      this.keyLocation = keyLocation;
      this.initKeyEvent(type,canBubble, cancelable, view,
        modifierList.contains(/Control/),
        modifierList.contains(/Alt/), 
        ishift,
        false, keyCode, charCode);
    };

}

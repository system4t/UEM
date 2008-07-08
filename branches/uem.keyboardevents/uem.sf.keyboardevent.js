// KeyboardEvent for Safari

if (navigator.product == "Safari" || navigator.product == "Gecko" && navigator.vendor == "Apple Computer, Inc.") {
  UEM = {};
  UEMKB = {};
  UEMKB.ix = {};
  /**
   * Keypress listener adds the data property to the event.  This is a
   * capture phase and unless the developer gets creative, the first such capture
   * phase handler for keypress events.  This means that this handler will make
   * the data property available to all other keypress event handlers.
   */
  document.addEventListener("keypress", 
  function(e) {
    if (e.charCode) e.data = String.fromCharCode(e.keyCode);
  }
  , true);
  /**
   * Keyup listener resets the keyIdentifier property to match the other
   * browsers.  Safari's native assignment is different and does not match
   * recommendations made in the W3C specification.
   */
  document.addEventListener("keyup", 
  function(e) {
      // Safari maps an acute grave accent (keycode=192) to U+00C0.
      // The rest of UEM maps this keycode to U+060, following recommendations
      // made in the W3C specification.
      // This is just one example among many.
    if (UEMKB.kctoi) {
      var keyIdentifier = UEMKB.kctoi(e.keyCode);
      var keyLocation = e.keyLocation;
      var modifiersList = "";
      if (e.ctrlKey)
        modifiersList += " Control";
      if (e.altKey)
        modifiersList += " Alt";
      if (e.shiftKey)
        modifiersList += " Shift";
      // Stop this keyup event
      e.stopPropagation();
      // Create new event
      var evt = document.createEvent('KeyboardEvent');
      // The keyCode is not set by the following line.  It's zero after UEMKB
      // finishes with the event.
      // evt.keyCode = e.keyCode;
      // Apparently Safari/Win uses e.bubbles (like IE) instead of e.canBubble
      evt.initKeyboardEvent('keyup', e.bubbles, e.cancelable, e.view,
        keyIdentifier, keyLocation, modifiersList);
      // If target is a textnode use parentnode as target
      var target = e.target.nodeType == 3 ? e.target.parentNode : e.target;
      // Remove this handler to avoid endless recursion
      this.removeEventListener('keyup', arguments.callee, true);
      // Dispatch event
      target.dispatchEvent(evt);
      // Add handler again
      this.addEventListener('keyup', arguments.callee, true);
    }
  }
  , true);
   /**
   * Keydown listener resets the keyIdentifier property to match the other
   * browsers.  Safari's native assignment is different and does not match
   * recommendations made in the W3C specification.
   */
  document.addEventListener("keydown", 
  function(e) {
      // Safari maps an acute grave accent (keycode=192) to U+00C0.
      // The rest of UEM maps this keycode to U+060, following recommendations
      // made in the W3C specification.
      // This is just one example among many.
    if (UEMKB.kctoi) {
      var keyIdentifier = UEMKB.kctoi(e.keyCode);
      var keyLocation = e.keyLocation;
      var modifiersList = "";
      if (e.ctrlKey)
        modifiersList += " Control";
      if (e.altKey)
        modifiersList += " Alt";
      if (e.shiftKey)
        modifiersList += " Shift";
      // Stop this keyup event
      e.stopPropagation();
      // Create new event
      var evt = document.createEvent('KeyboardEvent');
      // The keyCode is not set by the following line.  It's zero after UEMKB
      // finishes with the event.
      // evt.keyCode = e.keyCode;
      // Apparently Safari/Win uses e.bubbles (like IE) instead of e.canBubble
      evt.initKeyboardEvent('keydown', e.bubbles, e.cancelable, e.view,
        keyIdentifier, keyLocation, modifiersList);
      // If target is a textnode use parentnode as target
      var target = e.target.nodeType == 3 ? e.target.parentNode : e.target;
      // Remove this handler to avoid endless recursion
      this.removeEventListener('keydown', arguments.callee, true);
      // Dispatch event
      target.dispatchEvent(evt);
      // Add handler again
      this.addEventListener('keydown', arguments.callee, true);
    }
  }
  , true);
}

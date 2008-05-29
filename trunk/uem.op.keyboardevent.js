// KeyboardEvent for Opera

if (window.opera == "Opera") {
  
  UEM = {};

/**
 * Keypress handler that adds the data property to the event.  This is a
 * capture phase and unless the developer gets creative, the first such capture
 * phase handler for keypress events.  This means that this handler will make
 * the data property available to all other keypress event handlers.
 */
  var f1 = function(e) {
    if (e.charCode) e.data = String.fromCharCode(e.keyCode);
  };
  document.addEventListener("keypress", f1, true);
  
/**
 * Keyup and keydown handler that adds the keyIdentifier and keyLocation
 * properties to the event.  This is a capture phase and unless the developer
 * gets creative, the first such capture phase handler for keyboard events.
 * This means that this handler will make the keyIdentifier property available
 * to all other keyboard event handlers in this document.
 */
  var f2 = function(e) {
    e.keyLocation = 0;
    if (e.shiftKey) {
      e.keyIdentifier = UEM.keyCodeShiftToKeyIdentifier[e.keyCode];
      if (e.keyCode == 59) e.keyIdentifier = "U+003A"; // Colon
      else if (e.keyCode == 61) e.keyIdentifier = "U+002B"; // Plus
      else if (e.keyCode == 45) e.keyIdentifier = "U+005F"; // Underscore
      else if (e.keyCode == 44) e.keyIdentifier = "U+003C"; // Less than
      else if (e.keyCode == 46) e.keyIdentifier = "U+003E"; // Greater than
      else if (e.keyCode == 47) e.keyIdentifier = "U+003F"; // Question mark
      else if (e.keyCode == 126) e.keyIdentifier = "Tilde"; // Tilde
      else if (e.keyCode == 92) e.keyIdentifier = "U+007C"; // Vertical bar
      else if (e.keyCode == 39) e.keyIdentifier = "U+0022"; // Double quote
      else if (e.keyCode == 48) { e.keyIdentifier = "U+0030"; } // Zero
      else if (e.keyCode == 49) { e.keyIdentifier = "U+0031"; } // One
      else if (e.keyCode == 50) { e.keyIdentifier = "U+0032"; } // Two
      else if (e.keyCode == 51) { e.keyIdentifier = "U+0033"; } // Three
      else if (e.keyCode == 52) { e.keyIdentifier = "U+0034"; } // Four
      else if (e.keyCode == 53) { e.keyIdentifier = "U+0035"; } // Five
      else if (e.keyCode == 54) { e.keyIdentifier = "U+0036"; } // Six
      else if (e.keyCode == 55) { e.keyIdentifier = "U+0037"; } // Seven
      else if (e.keyCode == 56) { e.keyIdentifier = "U+0038"; } // Eight
      else if (e.keyCode == 57) { e.keyIdentifier = "U+0039"; } // Nine
    }
    else {
      e.keyIdentifier = UEM.keyCodeNoShiftToKeyIdentifier[e.keyCode];
      if (e.keyCode == 59) e.keyIdentifier = "U+003B"; // Semicolon
      else if (e.keyCode == 61) e.keyIdentifier = "U+003D"; // Equals
      else if (e.keyCode == 45) e.keyIdentifier = "U+002D"; // Minus
      else if (e.keyCode == 44) e.keyIdentifier = "U+002C"; // Comma
      else if (e.keyCode == 46) e.keyIdentifier = "U+002E"; // Period
      else if (e.keyCode == 47) e.keyIdentifier = "U+002F"; // Slash
      else if (e.keyCode == 126) e.keyIdentifier = "U+0060"; // Grave accent
      else if (e.keyCode == 92) e.keyIdentifier = "U+005C"; // Back slash
      else if (e.keyCode == 39) e.keyIdentifier = "U+0027"; // Single quote
    }
  };
  document.addEventListener("keyup", f2, true);
  document.addEventListener("keydown", f2, true);
 // The Opera home pages lead one to the conclusion that the best thing to do
 // about initKeyboardEvent and initTextEvent is to wait for an implementation.
 // When KeyboardEvents and TextEvents are properly supported, then the keypress,
 // keyup, and keydown handlers defined above will be obsolete. 
}

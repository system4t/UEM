// KeyboardEvent for Opera

if (window.opera == "Opera") {
  
  UEM = {};

/**
 * Keypress handler that adds the data property to the event.  This is a
 * capture phase and unless the developer gets creative, the first such capture
 * phase handler for keypress events.  This means that this handler will make
 * the data property available to all other keypress event handlers.
 */
  document.addEventListener("keypress", 
    function(e) {
      if (e.charCode) e.data = String.fromCharCode(e.keyCode);
    },
    true);
  
/**
 * Keyup and keydown handler that adds the keyIdentifier and keyLocation
 * properties to the event.  This is a capture phase and unless the developer
 * gets creative, the first such capture phase handler for keyboard events.
 * This means that this handler will make the keyIdentifier property available
 * to all other keyboard event handlers in this document.
 */
  document.addEventListener("keyup", 
    function(e) {
      e.keyLocation = 0;
      if (UEM.getW3CKeyIdentifier) {
        e.keyIdentifier = UEM.getW3CKeyIdentifier(e.keyCode);
        // Semicolon
        if (e.keyCode == 59) e.keyIdentifier = "U+003B";
        // Equals
        else if (e.keyCode == 61) e.keyIdentifier = "U+003D";
        // Minus
        else if (e.keyCode == 45) e.keyIdentifier = "U+002D";
        // Comma
        else if (e.keyCode == 44) e.keyIdentifier = "U+002C";
        // Period
        else if (e.keyCode == 46) e.keyIdentifier = "U+002E";
        // Slash
        else if (e.keyCode == 47) e.keyIdentifier = "U+002F";
        // Grave accent
        else if (e.keyCode == 126) e.keyIdentifier = "U+0060";
        // Back slash
        else if (e.keyCode == 92) e.keyIdentifier = "U+005C";
        // Single quote
        else if (e.keyCode == 39) e.keyIdentifier = "U+0027";
      }
    },
    true);
  document.addEventListener("keydown",
    function(e) {
      e.keyLocation = 0;
      if (UEM.getW3CKeyIdentifier) {
        e.keyIdentifier = UEM.getW3CKeyIdentifier(e.keyCode);
        // Semicolon
        if (e.keyCode == 59) e.keyIdentifier = "U+003B";
        // Equals
        else if (e.keyCode == 61) e.keyIdentifier = "U+003D";
        // Minus
        else if (e.keyCode == 45) e.keyIdentifier = "U+002D";
        // Comma
        else if (e.keyCode == 44) e.keyIdentifier = "U+002C";
        // Period
        else if (e.keyCode == 46) e.keyIdentifier = "U+002E";
        // Slash
        else if (e.keyCode == 47) e.keyIdentifier = "U+002F";
        // Grave accent
        else if (e.keyCode == 126) e.keyIdentifier = "U+0060";
        // Back slash
        else if (e.keyCode == 92) e.keyIdentifier = "U+005C";
        // Single quote
        else if (e.keyCode == 39) e.keyIdentifier = "U+0027";
      }
    },
    true);
 // The Opera home pages lead one to the conclusion that the best thing to do
 // about initKeyboardEvent and initTextEvent is to wait for an implementation.
 // When KeyboardEvents and TextEvents are properly supported, then the keypress,
 // keyup, and keydown handlers defined above will be obsolete. 
}

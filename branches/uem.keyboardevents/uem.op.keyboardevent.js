// KeyboardEvent for Opera

if (navigator.appName == "Opera") {
  
  UEM = {};
  UEMKB = {};
  UEMKB.ix = {};

/**
 * Keypress handler that adds the data property to the event.  This is a
 * capture phase and unless the developer gets creative, the first such capture
 * phase handler for keypress events.  This means that this handler will make
 * the data property available to all other keypress event handlers.
 */
  document.addEventListener("keypress", 
    function(e) {
      if (e.keyCode) e.data = String.fromCharCode(e.keyCode);
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
      // Semicolon
      if (UEMKB.kctoi) {
        e.keyIdentifier = UEMKB.kctoi(e.keyCode);
      }
      else if (e.keyCode == 59) e.keyIdentifier = "U+003B";
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
      else if (e.keyCode == 96) e.keyIdentifier = "U+0060";
      // Back slash
      else if (e.keyCode == 92) e.keyIdentifier = "U+005C";
      // Single quote
      else if (e.keyCode == 39) e.keyIdentifier = "U+0027";
      else {
        e.keyIdentifier = "";
      }
  },
  true);
  document.addEventListener("keydown",
    function(e) {
      e.keyLocation = 0;
        // Semicolon
        if (UEMKB.kctoi) {
          e.keyIdentifier = UEMKB.kctoi(e.keyCode);
        }
        else if (e.keyCode == 59) e.keyIdentifier = "U+003B";
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
        else if (e.keyCode == 96) e.keyIdentifier = "U+0060";
        // Back slash
        else if (e.keyCode == 92) e.keyIdentifier = "U+005C";
        // Single quote
        else if (e.keyCode == 39) e.keyIdentifier = "U+0027";
        else {
          e.keyIdentifer = "";
        }
    },
    true);

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
    if (UEMKB.itokc)
      keyCode = UEMKB.itokc(keyIdentifier);
    // semicolon or colon
    else if (keyIdentifier == "U+003B" || keyIdentifier == "U+003A")
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

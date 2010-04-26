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
   * Keyup listener adds the keyIdentifier and keyLocation
   * properties to the event.  This is a capture phase listener and unless the developer
   * gets creative, the first such capture phase handler for keyboard events.
   * This means that this handler will make the keyIdentifier property available
   * to all other keyboard event handlers in this document.
   */
  document.addEventListener("keyup", 
  function(e) {
    e.keyLocation = 0;
    if (UEMKB.kctoi) {
      e.keyIdentifier = UEMKB.kctoi(e.keyCode);
    }
  },
  true);
  /**
   * Keydown listener adds the keyIdentifier and keyLocation
   * properties to the event.  This is a capture phase listener and unless the developer
   * gets creative, the first such capture phase handler for keyboard events.
   * This means that this handler will make the keyIdentifier property available
   * to all other keyboard event handlers in this document.
   */
  document.addEventListener("keydown",
  function(e) {
    e.keyLocation = 0;
    if (UEMKB.kctoi) {
      e.keyIdentifier = UEMKB.kctoi(e.keyCode);
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
    var alt = false;
    this.initKeyEvent(type,canBubble, cancelable, view,
    false,
    alt,
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
    if (UEMKB.itokc) {
      var keyCode = UEMKB.itokc(keyIdentifier);
      var charCode = 0;
      this.keyIdentifier = keyIdentifier;
      this.keyLocation = keyLocation;
      this.initKeyEvent(type,canBubble, cancelable, view,
      modifierList.contains(/Control/),
      modifierList.contains(/Alt/),
      modifierList.contains(/Shift/),
      false, keyCode, charCode);
    }
  };
}

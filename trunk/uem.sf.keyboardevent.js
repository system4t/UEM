// KeyboardEvent for Safari

if (navigator.product == "Safari" || navigator.product == "Gecko" && navigator.vendor == "Apple Computer, Inc.") {
/**
 * Keypress handler that adds the data property to the event.  This is a
 * capture phase and unless the developer gets creative, the first such capture
 * phase handler for keypress events.  This means that this handler will make
 * the data property available to all other keypress event handlers.
 */
  document.addEventListener("keypress", 
    function(e) {
      if (e.charCode) e.data = String.fromCharCode(e.keyCode);
    }
    , true);
 // The JavaScript Madness page at http://unixpapa.com/js/key.html says that
 // Safari (miraculously) gets the keyup and keydown events right.  Documentation
 // about any initialization methods is nonexistent.
  document.addEventListener("keyup", 
    function(e) {
      if (UEM.getW3CKeyIdentifier) {
        e.keyIdentifier = UEM.getW3CKeyIdentifier(e.keyCode);
      }
      e.keyLocation = 0;
    }
    , true);
  document.addEventListener("keydown", 
    function(e) {
      if (UEM.getW3CKeyIdentifier) {
        e.keyIdentifier = UEM.getW3CKeyIdentifier(e.keyCode);
      }
      e.keyLocation = 0;
    }
    , true);
}

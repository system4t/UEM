// KeyboardEvent for Safari

if (navigator.product == "Safari" || navigator.product == "Gecko" && navigator.vendor == "Apple Computer, Inc.") {
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
      if (e.charCode) e.data = String.fromCharCode(e.keyCode);
    }
    , true);
 // The JavaScript Madness page at http://unixpapa.com/js/key.html says that
 // Safari (miraculously) gets the keyup and keydown events right.  Documentation
 // about any initialization methods is nonexistent.
 // 
 // The claim is incorrect.  The keyIdentifier assignments for punctuation
 // [`[]\,./;'{}|:"<>?~] are not correct.  Not only are they wrong, but they
 // cannot be overwritten with the correct assignments.
 // 
//  document.addEventListener("keyup", 
//    function(e) {
//      if (UEM.getW3CKeyIdentifier) {
//        var keyIdentifier = UEM.getW3CKeyIdentifier(e.keyCode);
//        e.keyIdentifier = keyIdentifier;
//      }
//      e.keyLocation = 0;
//    }
//    , true);
//  document.addEventListener("keydown", 
//    function(e) {
//      if (UEM.getW3CKeyIdentifier) {
//        var keyIdentifier = UEM.getW3CKeyIdentifier(e.keyCode);
//        e.keyIdentifier = keyIdentifier;
//      }
//      e.keyLocation = 0;
//    }
//    , true);
}

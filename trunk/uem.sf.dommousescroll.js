// MouseScroll correction for Safari/Win
if (/safari/i.test(navigator.userAgent)) {
  // Unfortunately we can't assign to e.detail so we have
  // to create a new event and dispatch that instead
  document.addEventListener('DOMMouseScroll',
    function(e) {
      // Stop this scroll event
      e.stopPropagation();
      // Get proper wheel detail
      var detail = e.wheelDelta / 40 * -1;
      // Create new event
      var evt = document.createEvent('MouseEvent');
      evt.initMouseEvent('DOMMouseScroll',e.canBubble,e.cancelable,e.view,detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget);
      // If target is a textnode use parentnode as target
      var target = e.target.nodeType == 3 ? e.target.parentNode : e.target;
      // Remove this handler to avoid endless recursion
      this.removeEventListener('DOMMouseScroll', arguments.callee, true);
      // Dispatch event
      target.dispatchEvent(evt);
      // Add handler again
      this.addEventListener('DOMMouseScroll', arguments.callee, true);
    }
    ,true);
}
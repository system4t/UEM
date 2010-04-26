/**
* Initialize an event object.  Keyword 'this' is an event object.
* 
* @param type {String} Event type.
* @param canBubble Boolean that determines if the event propagates.
* @param cancelable Boolean that determines if the event can be cancelled.
* @param view The view from which the event was generated.
* @param detail The mouse button that was pressed.
* @param screenX The horizontal coordinate at which the event occurred relative to the origin of the screen coordinate system.
* @param screenY The vertical coordinate at which the event occurred relative to the origin of the screen coordinate system.
* @param clientX The horizontal coordinate at which the event occurred relative to the viewport associated with the event.
* @param clientY The vertical coordinate at which the event occurred relative to the viewport associated with the event.
* @param ctrlKey true if the control (Ctrl) key modifier is activated.
* @param altKey true if the alternative (Alt) key modifier is activated.
* @param shiftKey true if the shift (Shift) key modifier is activated.
* @param metaKey true if the meta (Meta) key modifier is activated.
* @param button During mouse events caused by the depression or release of a
*   mouse button, button is used to indicate which mouse button changed state.
*   0 indicates the normal button of the mouse (in general on the left or the
*   one button on Macintosh mice, used to activate a button or select text).
*   2 indicates the contextual property (in general on the right, used to
*   display a context menu) button of the mouse if present.
*   1 indicates the extra (in general in the middle and often combined with
*   the mouse wheel) button. Some mice may provide or simulate more buttons,
*   and values higher than 2 can be used to represent such buttons.
* @param relatedTarget Used to identify a secondary EventTarget related to a
*   UI event, depending on the type of event.
*/
MouseEvent.prototype.initMouseEvent =
  function(type,canBubble,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget) {
  this.initUIEvent(type,canBubble,cancelable,view,detail);
  this.screenX = screenX; 
  this.screenY = screenY;
  this.clientX = clientX;
  this.clientY = clientY;
  this.ctrlKey = ctrlKey;
  this.altKey = altKey;
  this.shiftKey = shiftKey;
  this.metaKey = metaKey;
  this.button = button;
  this.relatedTarget = relatedTarget;
};

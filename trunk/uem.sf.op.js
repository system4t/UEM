// Event correction for Safari and Opera
// Access to prototype functions of UIEvent, MouseEvent and possibly others are only available
// once the event object is created.
// This file is primarily to correct types and currently only used for DOMMouseScroll
if (!window.MouseEvent) {
  
  // Namespace
  var UEM = {};
      
  // Wrapper for addEventlistener
  UEM.addEventListener =
    function(t,f,p) {
      t = UEM.eventTable[t] ? UEM.eventTable[t] : t;
      this._addEventListener(t,f,p);
      
    };
  // Wrapper for removeEventlistener
  UEM.removeEventListener =
    function(t,f,p) {
      t = UEM.eventTable[t] ? UEM.eventTable[t] : t;
      this._removeEventListener(t,f,p);
      
    };
  
  // Wrapper for createEvent
  UEM.createEvent =
    function(eventClass, e) {
      if (e)
        e.type = UEM.eventTable[e.type] ? UEM.eventTable[e.type] : e.type;
      e = document._createEvent(eventClass, e);
      e['_init' + eventClass] = e['init' + eventClass];
      e['init' + eventClass] = UEM['init' + eventClass]
      return e;
    };
  
  // Utility function
  UEM.argsAsArray =
    function(a) {
      var l = a.length;
      var args = [];
      for(var i=0; i<l; i++)
        args[i] = arguments[i]
      return args;
    };
  
  // Wrapper for initEvent
  // We don't really
  UEM.initEvent =
    function() {
      var a = arguments;
      a[0] = UEM.eventTable[a[0]] ? UEM.eventTable[a[0]] : a[0];
      // type,canBubble,cancelable
      this._initMouseEvent(a[0],a[1],a[2]);
    };
    
  // Wrapper for initUIEvent
  UEM.initUIEvent =
    function() {
      var a = arguments;
      a[0] = UEM.eventTable[a[0]] ? UEM.eventTable[a[0]] : a[0];
      // type,canBubble,cancelable,view,detail
      this._initMouseEvent(a[0],a[1],a[2],a[3],a[4]);
    };
  
  // Wrapper for initMouseEvent
  UEM.initMouseEvent =
    function() {
      var a = arguments;
      a[0] = UEM.eventTable[a[0]] ? UEM.eventTable[a[0]] : a[0];
      // type,canBubble,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget
      this._initMouseEvent(a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],a[14]);
    };
  
  UEM.eventTable =
    {
      DOMMouseScroll:'mousewheel'
    }
  
  // Fix window
  window._addEventListener = window.addEventListener;
  window.addEventListener = UEM.addEventListener;
  window._removeEventListener = window.removeEventListener;
  window.removeEventListener = UEM.removeEventListener;
  // Fix document
  document._addEventListener = document.addEventListener;
  document.addEventListener = UEM.addEventListener;
  document._removeEventListener = document.removeEventListener;
  document.removeEventListener = UEM.removeEventListener;
  // Fix elements
  HTMLElement.prototype._addEventListener = HTMLElement.prototype.addEventListener;
  HTMLElement.prototype.addEventListener = UEM.addEventListener;
  HTMLElement.prototype._removeEventListener = HTMLElement.prototype.removeEventListener;
  HTMLElement.prototype.removeEventListener = UEM.removeEventListener;
  // Fix Event
  document._createEvent = document.createEvent;
  document.createEvent = UEM.createEvent;
}
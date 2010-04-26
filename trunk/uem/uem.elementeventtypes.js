// Lookup table for possible event types
// W3C References: http://www.w3.org/2007/07/xhtml-basic-ref.html
// http://www.w3.org/TR/1999/REC-html401-19991224/sgml/dtd.html
UEM.elementEventTypes =
  {
    allTags: ['activate', 'click', 'dblclick', 'focusin', 'focusout', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mousewheel', 'mouseup'],
    a: ['blur','focus'],
    body: ['load','unload'],
    button: ['blur','focus'],
    form: ['reset','submit'],
    input: ['blur','change','focus','select'],
    label: ['blur','focus'],
    select: ['blur','change','focus'],
    textarea: ['blur','change','focus','select']
  };

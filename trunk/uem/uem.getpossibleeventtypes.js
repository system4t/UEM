/**
* Return an array with names of events that EPE supports.  This is a subset
* of the events that can actually be thrown natively, especially when the
* browser is Internet Explorer.  The names returned are the native names,
* not the W3C names.  The names returned are not prefixed with 'on'.  For
* instance, 'activate' might be a member;  not 'DOMActivate' or 'onactivate'.
* 
* @param tag {String} An HTML tag name.
* @return an array with names of allowed events.
*/
UEM.getPossibleEventTypes =
  function(tag) {
    return UEM.elementEventTypes.allTags.concat(UEM.elementEventTypes[tag]);
  };

/**
* If the specified tag is one that can have an event listener, return
* true.  Otherwise false.  Most tags can have event listeners.  An
* example of a tag that cannot have an event listener is 'br' or 'head'.
*
* @param tag {String} An HTML tag name.
* @return true if the tag can have event listeners; otherwise, false.
*/
UEM.canHaveEvents =
  function(tag) {
    var a = UEM.noEvents;
    var l = a.length;
    for(var i=0; i<l; i++) {
      if (a[i] == tag)
        return false;
    }
    return true;
  };

// List of tags which can not have event listeners
UEM.noEvents = ['br','style','script','head','meta','link','title'];

/**
* Execute functions in propagation chain.  The 'this' keyword for
* 'propagate' is a reference to the event object.
* 
* @param chain An array of event handlers.  The handlers must be listed
*    in the correct propagation order.
* @param useCapture {Boolean} True to invoke capture phase event handlers
*    and false to execute bubble phase event handlers.
* @return true if the propagation chain executes to completion.  False, if
*    one of the handlers invoked by propagate calls stopPropagation.
*/
Event.prototype.propagate =
  function(chain,useCapture) {
    var l = chain.length;
    // Shortcut - the type of event. 'UEM' string added to minimize chance of property already existing.
    var eType = 'UEM'+this.type;
    // For all elements in capture chain
    for (var i=0; i<chain.length; i++) {
      // Check whether any handler still exist as
      // they might have been removed by other
      // handlers
      if (chain[i][eType]) {
        // For each event of this type
        var l = chain[i][eType].length;
        // Copy array
        var a = [].concat(chain[i][eType]);
        // Execute event handlers registered with this useCapture (either true or false)
        for (var j=0; j<l; j++) {
          if (a[j].useCapture === useCapture) {
            // Update currentTarget to element whose event handlers are currently being processed
            this.currentTarget = chain[i];
            // Event handler may remove itself. Save length
            var l2 = l;
            a[j].fnc.call(chain[i],this);
            // Check whether stopPropagation has been called
            if (this.propagationStopped)
              return false;
            // Were all handlers for this type removed
            if (!chain[i][eType])
              break;
          }
        }
      }
    }
    return true;
  };

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
        // Execute event handlers registered with this useCapture (either true or false)
        for (var j=0; j<l; j++) {
          if (chain[i][eType][j].useCapture === useCapture) {
            // Update currentTarget to element whose event handlers are currently being processed
            this.currentTarget = chain[i];
            // Event handler may remove itself. Save length
            var l2 = l;
            chain[i][eType][j].fnc.call(chain[i],this);
            // Check whether stopPropagation has been called
            if (this.propagationStopped)
              return false;
            // Were all handlers for this type removed
            if (!chain[i][eType])
              break;
            // If length have changed (by removing or adding new handlers dynamically)
            if (l2 != chain[i][eType].length) {
              // If we are removing then l2 > l and j needs to be corrected
              if (l2 > l)
                j -= (l - l2);
              l = chain[i][eType].length;
            }
          }
        }
      }
    }
    return true;
  };

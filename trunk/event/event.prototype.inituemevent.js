/**
* Utility method for setting basic properties of event object
* Mainly used from subclasses of the Event class
* @param e { IE Event object } An actual IE event object. 
* @returns Undefined
* @type Event
*/   
Event.prototype.initUEMEvent =
  function(ie_event) {
    // Save ref. to window event - we need this to set returnValue.
    this.e = ie_event;
    // currentTarget is set by wrapper/propagate
    this.currentTarget = null;
    this.eventPhase = Event.CAPTURING_PHASE;
    this.target = ie_event.srcElement;
    this.timeStamp = (new Date()).getTime();
  };

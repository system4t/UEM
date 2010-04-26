// Make sure HTMLElement exist
if (!HTMLElement)
  throw new Error('JSL: UEM: HTMLElement is not defined. Confirm that EPE is loaded');

// Declare namespace
window.UEM = {};
  
// Execute event listeners for the target in the
// capture phase. This behavior is also implemented
// in Firefox, Opera and Safari although the W3C standard
// says the opposite.
// Default value is 1. Set to 0 to turn off
UEM.CAPTURE_ON_TARGET = 1;
  
// THERE ARE NO CONFIGURABLE SETTINGS BELOW THIS LINE
UEM.ADD_TO_WINDOW = false;

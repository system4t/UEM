// Define Event interface for window
window.addEventListener = UEM.addEventListener;
window.removeEventListener = UEM.removeEventListener;
window.dispatchEvent = UEM.dispatchEvent;
window.removeAllEventListeners = UEM.removeAllEventListeners;


// Define Event interface for document
document.addEventListener = UEM.addEventListener;
document.removeEventListener = UEM.removeEventListener;
document.dispatchEvent = UEM.dispatchEvent;
document.removeAllEventListeners = UEM.removeAllEventListeners;


// Define Event interface for elements
HTMLElement.prototype.addEventListener = UEM.addEventListener;
HTMLElement.prototype.removeEventListener = UEM.removeEventListener;
HTMLElement.prototype.dispatchEvent = UEM.dispatchEvent;
HTMLElement.prototype.removeAllEventListeners = UEM.removeAllEventListeners;

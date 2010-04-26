// Event property lookup table
// Reference is summary table in
// http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-EventTypes-complete
UEM.eventTable =
  {
  // HTMLEvent
  abort:
    {
      cancels: false,
      bubbles: true,
      eventClass: 'Event'
    },
  activate:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'UIEvent'
    },
  blur:
    {
      cancels: false,
      bubbles: false,
      eventClass: 'UIEvent'
    },
  // HTMLEvent
  change:
    {
      cancels: false,
      bubbles: true,
      eventClass: 'Event'
    },
  click:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'MouseEvent'
    },
  contextmenu:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'MouseEvent'
    },
  dblclick:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'MouseEvent'
    },
  // HTMLEvent
  error:
    {
      cancels: false,
      bubbles: true,
      eventClass: 'Event'
    },
  focus:
    {
      cancels: false,
      bubbles: false,
      eventClass: 'UIEvent'
    },
  focusin:
    {
      cancels: false,
      bubbles: true,
      eventClass: 'UIEvent'
    },
  focusout:
    {
      cancels: false,
      bubbles: true,
      eventClass: 'UIEvent'
    },
  keydown:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'KeyboardEvent'
    },
  keypress:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'TextEvent'
    },
  keyup:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'KeyboardEvent'
    },
  // HTLMEvent
  load:
    {
      cancels: false,
      bubbles: false,
      eventClass: 'Event'
    },
  mousedown:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'MouseEvent'
    },
  mousemove:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'MouseEvent'
    },
  mouseover:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'MouseEvent'
    },
  mouseout:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'MouseEvent'
    },
  mousewheel:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'MouseEvent'
    },
  mouseup:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'MouseEvent'
    },
  // HTMLEvent
  reset:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'Event'
    },
  // HTMLEvent
  resize:
    {
      cancels: false,
      bubbles: true,
      eventClass: 'Event'
    },
  // HTMLEvent
  scroll:
    {
      cancels: false,
      bubbles: true,
      eventClass: 'Event'
    },
  // HTMLEvent
  select:
    {
      cancels: false,
      bubbles: true,
      eventClass: 'Event'
    },
  // HTMLEvent
  submit:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'Event'
    },
  textInput:
    {
      cancels: true,
      bubbles: true,
      eventClass: 'TextEvent'
    },
  // HTMLEvent
  unload:
    {
      cancels: false,
      bubbles: false,
      eventClass: 'Event'
    }
  };

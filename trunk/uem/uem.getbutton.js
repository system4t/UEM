/**
* Get a W3C mouse button value for simple mouse events.  If two mouse
* buttons are pressed simultaneously then
* <table>
* <thead><tr><th>Input</th><th>Output</th><th>Meaning</th><tr></thead>
* <tbody>
* <tr><td>0</td><td>0</td><td>No button was pressed.  Don't use this.</td></tr>
* <tr><td>1</td><td>0</td><td>Left button is pressed.</td></tr>
* <tr><td>2</td><td>2</td><td>Right button is pressed.</td></tr>
* <tr><td>3</td><td>3</td><td>Left and right are both pressed.  Usage is not portable.</td></tr>
* <tr><td>4</td><td>1</td><td>Middle button is pressed.</td></tr>
* <tr><td>5</td><td>5</td><td>Left and middle are both pressed.  Usage is not portable.</td></tr>
* <tr><td>6</td><td>6</td><td>Right and middle are both pressed.  Usage is not portable.</td></tr>
* <tr><td>7</td><td>7</td><td>All three buttons are pressed.  Usage is not portable.</td></tr>
* </tbody>
* </table>
* 
* @param i The native code for the mouse button that was pressed.
* @return value depends on how the mouse is configured.  For a right-handed
* mouse, return 0, 1, or 2 for a left, middle, or right mouse click.  For
* a left-handed mouse, return 0, 1, or 2 for a right, middle, or left
* mouse click.
*/
UEM.getButton =
  function(i) {
    switch(i) {
      // Left button
      case 1:
        return 0;
      // Middle button
      case 4:
        return 1;
      default:
        return i;
    }
  };

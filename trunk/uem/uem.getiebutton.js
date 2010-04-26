// W3C -> IE
UEM.getIEButton =
  function(i) {
    switch(i) {
      case 0:
        return 1;
      case 1:
        return 4;
      default:
        return i;
    }
  };

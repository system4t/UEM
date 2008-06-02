// Key indentifier tables for KeyboardEvent interface

// TextEvents:  textInput, keypress
// MSHTML.  Returns keyCode
//    http://msdn.microsoft.com/library/default.asp?url=/workshop/author/dhtml/reference/events/onkeydown.asp
//    Letters: A-Z and a-z
//    Numerals: 0-9
//    Symbols: !@#$%^&*()_-+=<[]{},./?\|'`"~
//    System: ESC, SPACEBAR, ENTER
//    Behavior with respect to input methods (for Chinese, for instance) is
//    not specified at the MSHTML site.
// Mozilla.
//    http://www.mozilla.org/editor/key-event-spec.html
//    The event is triggered by more keys than it is with Internet Explorer.
//    If the key maps to a printable character, charCode is set and keyCode is
//    set to 0.  Otherwise, charCode is 0 and keyCode is returned.
//    ESC and ENTER are nonprintable and would not map to a keyCode.
// W3C specification
//    http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-TextEvent
//    One additional string attribute named data.  For the
//    keycodes that MSHTML supports, this is the string for
//    an ASCII letter, numeral, space, or symbol.  ESC and ENTER
//    do not map.
//

// KeyboardEvents:  keyup, keydown
// W3C specification
//    http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-TextEvent
//    string attribute keyIdentifier
//    int attribute keyLocation
// MSHTML.  Returns keyCode
//    http://msdn.microsoft.com/library/default.asp?url=/workshop/author/dhtml/reference/events/onkeydown.asp
//    Editing: DELETE, INSERT
//    Function: F1 - F12
//    Letters: A-Z and a-z
//    Navigation: HOME, END, LEFT ARROW, RIGHT ARROW, UP ARROW, DOWN ARROW
//                BACKSPACE, PAGE UP, PAGE DOWN, SHIFT+TAB
//    Numerals: 0-9
//    Symbols: !@#$%^&*()_-+=<[]{},./?\|'`"~
//    System: ESC, SPACEBAR, SHIFT, TAB
//    Behavior with respect to input methods (for Chinese, for instance) is
//    not specified at the MSHTML site.
// Mozilla.
//    http://www.mozilla.org/editor/key-event-spec.html
//    Returns keyCode.  Returns charCode of 0.
// W3C specification
//    http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-TextEvent
//    string attribute keyIdentifier. The string "U+0031" for the keycode 49.
//    int attribute keyLocation.  Neither IE nor Mozilla pass this information.
//
// A source of keycode definition is
//    http://msdn.microsoft.com/en-us/library/system.windows.forms.keys(VS.71).aspx

UEM.keyCodeNoShiftToKeyIdentifier = [
  "", "", "", "U+0018", "", "", "", "", "U+0008", "U+0009",
  "", "", "Clear", "Enter", "", "", "Shift", "Control", "Alt", "Pause",
  "CapsLock", "HangulMode", "", "", "FinalMode", "KanjiMode", "", "U+001B", "", "",
  "", "", "U+0020", "PageUp", "PageDown", "End", "Home", "Left", "Up", "Right",
  "Down", "Select", "", "Execute", "PrintScreen", "Insert", "U+007F", "Help", "U+0030", "U+0031",
  "U+0032", "U+0033", "U+0034", "U+0035", "U+0036", "U+0037", "U+0038", "U+0039", "", "U+003B",
  "", "U+003D", "", "", "", "U+0041", "U+0042", "U+0043", "U+0044", "U+0045",
  "U+0046", "U+0047", "U+0048", "U+0049", "U+004A", "U+004B", "U+004C", "U+004D", "U+004E", "U+004F",
  "U+0050", "U+0051", "U+0052", "U+0053", "U+0054", "U+0055", "U+0056", "U+0057", "U+0058", "U+0059",
  "U+005A", "Win", "", "Apps", "", "", "U+0030", "U+0031", "U+0032", "U+0033",
  "U+0034", "U+0035", "U+0036", "U+0037", "U+0038", "U+0039", "U+002A", "U+002B", "", "U+002D",
  "U+002E", "U+002F", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8",
  "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18",
  "F19", "F20", "F21", "F22", "F23", "F24", "", "", "", "",
  "", "", "", "", "NumLock", "Scroll", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "BrowserBack", "BrowserForward", "BrowserRefresh", "BrowserStop",
  "BrowserSearch", "BrowserFavorites", "BrowserHome", "VolumeMute", "VolumeDown", "VolumeUp", "MediaNextTrack", "MediaPreviousTrack", "MediaStop", "MediaPlayPause",
  "LaunchMail", "SelectMedia", "LaunchApplication1", "LaunchApplication2", "", "", "U+003B", "U+003D", "U+002C", "U+002D",
  "U+002E", "U+002F", "U+0060", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "U+005B",
  "U+005C", "U+005D", "U+0027", "", "Meta"];

UEM.keyIdentifierNoShiftToKeyCode =
  function(keyIdentifier) {
    if ("U+0030" <= keyIdentifier && keyIdentifier <= "U+0039")
        return UEM.uCodeToInt(keyIdentifier.substr(4, 2));
    if ("U+0041" <= keyIdentifier && keyIdentifier <= "U+005A")
        return UEM.uCodeToInt(keyIdentifier.substr(4, 2) - 32);
    if (keyIdentifier == "U+0018") return 3; // Cancel
    if (keyIdentifier == "U+0008") return 8; // Backspace
    if (keyIdentifier == "U+0009") return 9; // Horizontal tab
    if (keyIdentifier == "Clear") return 12;
    if (keyIdentifier == "Enter") return 13;
    if (keyIdentifier == "Shift") return 16;
    if (keyIdentifier == "Control") return 17;
    if (keyIdentifier == "Alt") return 18;
    if (keyIdentifier == "Pause") return 19;
    if (keyIdentifier == "CapsLock") return 20;
    if (keyIdentifier == "HangulMode") return 21;
    if (keyIdentifier == "FinalMode") return 24;
    if (keyIdentifier == "KanjiMode") return 25;
    if (keyIdentifier == "U+001B") return 27; // Escape
    if (keyIdentifier == "U+0020") return 32; // Space
    if (keyIdentifier == "PageUp") return 33;
    if (keyIdentifier == "PageDown") return 34;
    if (keyIdentifier == "End") return 35;
    if (keyIdentifier == "Home") return 36;
    if (keyIdentifier == "Left") return 37;
    if (keyIdentifier == "Up") return 38;
    if (keyIdentifier == "Right") return 39;
    if (keyIdentifier == "Down") return 40;
    if (keyIdentifier == "Select") return 41;
    if (keyIdentifier == "Execute") return 43;
    if (keyIdentifier == "PrintScreen") return 44;
    if (keyIdentifier == "Insert") return 45;
    if (keyIdentifier == "U+007F") return 46; // Delete
    if (keyIdentifier == "Help") return 47;
    if (keyIdentifier == "U+0021") return 49; // Exclamation
    if (keyIdentifier == "Win") return 91;
    if (keyIdentifier == "Apps") return 93;
    if (keyIdentifier == "U+002B") return 107; // Plus (keypad)
    if (keyIdentifier == "F1") return 112;
    if (keyIdentifier == "F2") return 113;
    if (keyIdentifier == "F3") return 114;
    if (keyIdentifier == "F4") return 115;
    if (keyIdentifier == "F5") return 116;
    if (keyIdentifier == "F6") return 117;
    if (keyIdentifier == "F7") return 118;
    if (keyIdentifier == "F8") return 119;
    if (keyIdentifier == "F9") return 120;
    if (keyIdentifier == "F10") return 121;
    if (keyIdentifier == "F11") return 122;
    if (keyIdentifier == "F12") return 123;
    if (keyIdentifier == "F13") return 124;
    if (keyIdentifier == "F14") return 125;
    if (keyIdentifier == "F15") return 126;
    if (keyIdentifier == "F16") return 127;
    if (keyIdentifier == "F17") return 128;
    if (keyIdentifier == "F18") return 129;
    if (keyIdentifier == "F19") return 130;
    if (keyIdentifier == "F20") return 131;
    if (keyIdentifier == "F21") return 132;
    if (keyIdentifier == "F22") return 133;
    if (keyIdentifier == "F23") return 134;
    if (keyIdentifier == "F24") return 135;
    if (keyIdentifier == "NumLock") return 144;
    if (keyIdentifier == "Scroll") return 145;
    if (keyIdentifier == "BrowserBack") return 166;
    if (keyIdentifier == "BrowserForward") return 167;
    if (keyIdentifier == "BrowserRefresh") return 168;
    if (keyIdentifier == "BrowserStop") return 169;
    if (keyIdentifier == "BrowserSearch") return 170;
    if (keyIdentifier == "BrowserFavorites") return 171;
    if (keyIdentifier == "BrowserHome") return 172;
    if (keyIdentifier == "VolumeMute") return 173;
    if (keyIdentifier == "VolumeDown") return 174;
    if (keyIdentifier == "VolumeUp") return 175;
    if (keyIdentifier == "MediaNextTrack") return 176;
    if (keyIdentifier == "MediaPreviousTrack") return 177;
    if (keyIdentifier == "MediaStop") return 178;
    if (keyIdentifier == "MediaPlayPause") return 179;
    if (keyIdentifier == "LaunchMail") return 180;
    if (keyIdentifier == "SelectMedia") return 181;
    if (keyIdentifier == "LaunchApplication1") return 182;
    if (keyIdentifier == "LaunchApplication2") return 183;
    if (keyIdentifier == "U+003B") return 186; // Semicolon
    if (keyIdentifier == "U+003D") return 187; // Equals
    if (keyIdentifier == "U+002C") return 188; // Comma
    if (keyIdentifier == "U+002D") return 189; // Minus
    if (keyIdentifier == "U+002E") return 190; // Period
    if (keyIdentifier == "U+002F") return 191; // Slash
    if (keyIdentifier == "U+0060") return 192; // Grave Accent
    if (keyIdentifier == "U+005B") return 219; // Left Bracket
    if (keyIdentifier == "U+005C") return 220; // Backslash
    if (keyIdentifier == "U+005D") return 221; // Right Bracket
    if (keyIdentifier == "U+0027") return 222; // Apostrophe
    if (keyIdentifier == "Meta") return 224;
    return 0;
  };

UEM.keyCodeShiftToKeyIdentifier = [
  "", "", "", "U+0018", "", "", "", "", "U+0008", "U+0009",
  "", "", "Clear", "Enter", "", "", "Shift", "Control", "Alt", "Pause",
  "CapsLock", "HangulMode", "", "", "FinalMode", "KanjiMode", "", "U+001B", "", "",
  "", "", "U+0020", "PageUp", "PageDown", "End", "Home", "Left", "Up", "Right",
  "Down", "Select", "", "Execute", "PrintScreen", "Insert", "U+007F", "Help", "U+0029", "U+0021",
  "U+0040", "U+0023", "U+0024", "U+0025", "U+005E", "U+0026", "U+002A", "U+0028", "", "U+003A",
  "", "U+002B", "", "", "", "U+0041", "U+0042", "U+0043", "U+0044", "U+0045",
  "U+0046", "U+0047", "U+0048", "U+0049", "U+004A", "U+004B", "U+004C", "U+004D", "U+004E", "U+004F",
  "U+0050", "U+0051", "U+0052", "U+0053", "U+0054", "U+0055", "U+0056", "U+0057", "U+0058", "U+0059",
  "U+005A", "Win", "", "Apps", "", "", "U+0030", "U+0031", "U+0032", "U+0033",
  "U+0034", "U+0035", "U+0036", "U+0037", "U+0038", "U+0039", "U+002A", "U+002B", "", "U+002D",
  "", "U+002F", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8",
  "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18",
  "F19", "F20", "F21", "F22", "F23", "F24", "", "", "", "",
  "", "", "", "", "NumLock", "Scroll", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "BrowserBack", "BrowserForward", "BrowserRefresh", "BrowserStop",
  "BrowserSearch", "BrowserFavorites", "BrowserHome", "VolumeMute", "VolumeDown", "VolumeUp", "MediaNextTrack", "MediaPreviousTrack", "MediaStop", "MediaPlayPause",
  "LaunchMail", "SelectMedia", "LaunchApplication1", "LaunchApplication2", "", "", "U+003A", "U+002B", "U+003C", "U+005F",
  "U+003E", "U+003F", "Tilde", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "U+007B",
  "U+007C", "U+007D", "U+0022", "", "Meta"];

UEM.keyIdentifierShiftToKeyCode =
  function(keyIdentifier) {
    if ("U+0030" <= keyIdentifier && keyIdentifier <= "U+0039")
        return UEM.uCodeToInt(keyIdentifier.substr(4, 2) + 48);
    if ("U+0041" <= keyIdentifier && keyIdentifier <= "U+005A")
      return UEM.uCodeToInt(keyIdentifier.substr(4, 2)); 
    if (keyIdentifier == "U+0018") return 3; // Cancel
    if (keyIdentifier == "U+0008") return 8; // Backspace
    if (keyIdentifier == "U+0009") return 9; // Horizontal tab
    if (keyIdentifier == "Clear") return 12;
    if (keyIdentifier == "Enter") return 13;
    if (keyIdentifier == "Shift") return 16;
    if (keyIdentifier == "Control") return 17;
    if (keyIdentifier == "Alt") return 18;
    if (keyIdentifier == "Pause") return 19;
    if (keyIdentifier == "CapsLock") return 20;
    if (keyIdentifier == "HangulMode") return 21;
    if (keyIdentifier == "FinalMode") return 24;
    if (keyIdentifier == "KanjiMode") return 25;
    if (keyIdentifier == "U+001B") return 27; // Escape
    if (keyIdentifier == "U+0020") return 32; // Space
    if (keyIdentifier == "PageUp") return 33;
    if (keyIdentifier == "PageDown") return 34;
    if (keyIdentifier == "End") return 35;
    if (keyIdentifier == "Home") return 36;
    if (keyIdentifier == "Left") return 37;
    if (keyIdentifier == "Up") return 38;
    if (keyIdentifier == "Right") return 39;
    if (keyIdentifier == "Down") return 40;
    if (keyIdentifier == "Select") return 41;
    if (keyIdentifier == "Execute") return 43;
    if (keyIdentifier == "PrintScreen") return 44;
    if (keyIdentifier == "Insert") return 45;
    if (keyIdentifier == "U+007F") return 46; // Delete
    if (keyIdentifier == "Help") return 47;
    if (keyIdentifier == "U+0029") return 48; // Right Parenthesis
    if (keyIdentifier == "U+0021") return 49; // Exclamation mark
    if (keyIdentifier == "U+0040") return 50; // Commercial At
    if (keyIdentifier == "U+0023") return 51; // Number Sign
    if (keyIdentifier == "U+0024") return 52; // Dollar Sign
    if (keyIdentifier == "U+0025") return 53; // Percent Sign
    if (keyIdentifier == "U+005E") return 54; // Circumflex
    if (keyIdentifier == "U+0026") return 55; // Ampersand
    if (keyIdentifier == "U+002A") return 56; // Asterix
    if (keyIdentifier == "U+0028") return 57; // Left Parenthesis
    if (keyIdentifier == "Win") return 91;
    if (keyIdentifier == "Apps") return 93;
    if (keyIdentifier == "U+002D") return 109; // Minus (keypad)
    if (keyIdentifier == "U+002F") return 111; // Slash (keypad)
    if (keyIdentifier == "F1") return 112;
    if (keyIdentifier == "F2") return 113;
    if (keyIdentifier == "F3") return 114;
    if (keyIdentifier == "F4") return 115;
    if (keyIdentifier == "F5") return 116;
    if (keyIdentifier == "F6") return 117;
    if (keyIdentifier == "F7") return 118;
    if (keyIdentifier == "F8") return 119;
    if (keyIdentifier == "F9") return 120;
    if (keyIdentifier == "F10") return 121;
    if (keyIdentifier == "F11") return 122;
    if (keyIdentifier == "F12") return 123;
    if (keyIdentifier == "F13") return 124;
    if (keyIdentifier == "F14") return 125;
    if (keyIdentifier == "F15") return 126;
    if (keyIdentifier == "F16") return 127;
    if (keyIdentifier == "F17") return 128;
    if (keyIdentifier == "F18") return 129;
    if (keyIdentifier == "F19") return 130;
    if (keyIdentifier == "F20") return 131;
    if (keyIdentifier == "F21") return 132;
    if (keyIdentifier == "F22") return 133;
    if (keyIdentifier == "F23") return 134;
    if (keyIdentifier == "F24") return 135;
    if (keyIdentifier == "NumLock") return 144;
    if (keyIdentifier == "Scroll") return 145;
    if (keyIdentifier == "BrowserBack") return 166;
    if (keyIdentifier == "BrowserForward") return 167;
    if (keyIdentifier == "BrowserRefresh") return 168;
    if (keyIdentifier == "BrowserStop") return 169;
    if (keyIdentifier == "BrowserSearch") return 170;
    if (keyIdentifier == "BrowserFavorites") return 171;
    if (keyIdentifier == "BrowserHome") return 172;
    if (keyIdentifier == "VolumeMute") return 173;
    if (keyIdentifier == "VolumeDown") return 174;
    if (keyIdentifier == "VolumeUp") return 175;
    if (keyIdentifier == "MediaNextTrack") return 176;
    if (keyIdentifier == "MediaPreviousTrack") return 177;
    if (keyIdentifier == "MediaStop") return 178;
    if (keyIdentifier == "MediaPlayPause") return 179;
    if (keyIdentifier == "LaunchMail") return 180;
    if (keyIdentifier == "SelectMedia") return 181;
    if (keyIdentifier == "LaunchApplication1") return 182;
    if (keyIdentifier == "LaunchApplication2") return 183;
    if (keyIdentifier == "U+003A") return 186; // Colon
    if (keyIdentifier == "U+002B") return 187; // Plus
    if (keyIdentifier == "U+003C") return 188; // Less Than
    if (keyIdentifier == "U+005F") return 189; // Underscore
    if (keyIdentifier == "U+003E") return 190; // Greater Than
    if (keyIdentifier == "U+003F") return 191; // Question Mark
    if (keyIdentifier == "Tilde") return 192;  // Not Unicode
    if (keyIdentifier == "U+007B") return 219; // Left Curly Bracket
    if (keyIdentifier == "U+007C") return 220; // Vertical Line
    if (keyIdentifier == "U+007D") return 221; // Right Curly Bracket
    if (keyIdentifier == "U+0022") return 222; // Quotation Mark
    if (keyIdentifier == "Meta") return 224;
    return 0;
  };

UEM.getW3CKeyIdentifier =
  function(keyCode) {
    // Prefer lower case
    var keyIdentifier = UEM.keyCodeNoShiftToKeyIdentifier[keyCode];
    // If lower case mapping is null or not Unicode, try the upper case mapping.
    if (!keyIdentifier) {
      keyIdentifier = UEM.keyCodeShiftToKeyIdentifier[keyCode];
    }
    else if (keyIdentifier.indexOf("U+") != 0) {
      var keyIdentifierHi = UEM.keyCodeShiftToKeyIdentifier[keyCode];
      if (keyIdentifierHi && keyIdentifierHi.indexOf("U+") == 0) {
        keyIdentifier = keyIdentifierHi;
      }
    }
    // If no mapping, return the Unicode sequence
    if (!keyIdentifier) {
      var hexCode = e.keyCode.toString(16);
      for (var i = 0; i < hexCode - 4; i++)
        hexCode = "0" + hexCode;
      keyIdentifier = "U+" + hexCode;
    }
    return keyIdentifier;
  };

// Utility methods
UEM.uCodeToInt =
  function(uCode) {
    var n = 0;
    for (var i = 0; i < 2; i++) {
       n *= 16;
       n += Number(uCode.charAt(i));
    }
    return n;
  };

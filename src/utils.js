var _ = require('lodash');
var widestLine = require('widest-line');
var strlen = widestLine;

function codeRegex(capture){
  return capture ? /\u001b\[((?:\d*;){0,5}\d*)m/g : /\u001b\[(?:\d*;){0,5}\d*m/g
}

function repeat(str,times){
  return Array(times + 1).join(str);
}

function pad(str, len, pad, dir) {
  var length = strlen(str);
  if (len + 1 >= length) {
    var padlen = len - length;
    switch (dir) {
      case 'right':
        str = repeat(pad, padlen) + str;
        break;

      case 'center':
        var right = Math.ceil((padlen) / 2);
        var left = padlen - right;
        str = repeat(pad, left) + str + repeat(pad, right);
        break;

      default :
        str = str + repeat(pad,padlen);
        break;
    }
  }
  return str;
}

var codeCache = {};

function addToCodeCache(name,on,off){
  on = '\u001b[' + on + 'm';
  off = '\u001b[' + off + 'm';
  codeCache[on] = {set:name,to:true};
  codeCache[off] = {set:name,to:false};
  codeCache[name] = {on:on,off:off};
}

//https://github.com/Marak/colors.js/blob/master/lib/styles.js
addToCodeCache('bold', 1, 22);
addToCodeCache('italics', 3, 23);
addToCodeCache('underline', 4, 24);
addToCodeCache('inverse', 7, 27);
addToCodeCache('strikethrough', 9, 29);


function updateState(state, controlChars){
  var controlCode = controlChars[1] ? parseInt(controlChars[1].split(';')[0]) : 0;
  if ( (controlCode >= 30 && controlCode <= 39)
     || (controlCode >= 90 && controlCode <= 97)
  ) {
    state.lastForegroundAdded = controlChars[0];
    return;
  }
  if ( (controlCode >= 40 && controlCode <= 49)
     || (controlCode >= 100 && controlCode <= 107)
  ) {
    state.lastBackgroundAdded = controlChars[0];
    return;
  }
  if (controlCode === 0) {
    for (var i in state) {
      /* istanbul ignore else */
      if (state.hasOwnProperty(i)) {
        delete state[i];
      }
    }
    return;
  }
  var info = codeCache[controlChars[0]];
  if (info) {
    state[info.set] = info.to;
  }
}

function readState(line){
  var code = codeRegex(true);
  var controlChars = code.exec(line);
  var state = {};
  while(controlChars !== null){
    updateState(state, controlChars);
    controlChars = code.exec(line);
  }
  return state;
}

function unwindState(state,ret){
  var lastBackgroundAdded = state.lastBackgroundAdded;
  var lastForegroundAdded = state.lastForegroundAdded;

  delete state.lastBackgroundAdded;
  delete state.lastForegroundAdded;

  _.forEach(state,function(value,key){
    if(value){
      ret += codeCache[key].off;
    }
  });

  if(lastBackgroundAdded && (lastBackgroundAdded != '\u001b[49m')){
    ret += '\u001b[49m';
  }
  if(lastForegroundAdded && (lastForegroundAdded != '\u001b[39m')){
    ret += '\u001b[39m';
  }

  return ret;
}

function rewindState(state,ret){
  var lastBackgroundAdded = state.lastBackgroundAdded;
  var lastForegroundAdded = state.lastForegroundAdded;

  delete state.lastBackgroundAdded;
  delete state.lastForegroundAdded;

  _.forEach(state,function(value,key){
    if(value){
      ret = codeCache[key].on + ret;
    }
  });

  if(lastBackgroundAdded && (lastBackgroundAdded != '\u001b[49m')){
    ret = lastBackgroundAdded + ret;
  }
  if(lastForegroundAdded && (lastForegroundAdded != '\u001b[39m')){
    ret = lastForegroundAdded + ret;
  }

  return ret;
}

function truncate(str, desiredLength, truncateChar){
  truncateChar = truncateChar || '…';
  var lengthOfStr = strlen(str);
  if(lengthOfStr <= desiredLength){
    return str;
  }
  desiredLength -= truncateChar.length;
  if(lengthOfStr === str.length){
    return str.substr(0, desiredLength) + truncateChar;
  }
  var code = codeRegex(true);
  var split = str.split(codeRegex());
  var splitIndex = 0;
  var retLen = 0;
  var ret = '';
  var myArray;
  var state = {};

  while(retLen < desiredLength){
    myArray = code.exec(str);
    var toAdd = split[splitIndex];
    splitIndex++;
    if (retLen + toAdd.length > desiredLength){
      toAdd = toAdd.substr(0, desiredLength - retLen);
    }
    ret += toAdd;
    retLen += toAdd.length;
    if(retLen < desiredLength){
      ret += myArray[0];
      updateState(state,myArray);
    }
  }

  ret = unwindState(state,ret);

  return ret + truncateChar;
}


function defaultOptions(){
  return{
    chars: {
      'top': '─'
      , 'top-mid': '┬'
      , 'top-left': '┌'
      , 'top-right': '┐'
      , 'bottom': '─'
      , 'bottom-mid': '┴'
      , 'bottom-left': '└'
      , 'bottom-right': '┘'
      , 'left': '│'
      , 'left-mid': '├'
      , 'mid': '─'
      , 'mid-mid': '┼'
      , 'right': '│'
      , 'right-mid': '┤'
      , 'middle': '│'
    }
    , truncate: '…'
    , colWidths: []
    , rowHeights: []
    , colAligns: []
    , rowAligns: []
    , style: {
      'padding-left': 1
      , 'padding-right': 1
      , head: ['red']
      , border: ['grey']
      , compact : false
    }
    , head: []
  };
}

function mergeOptions(options,defaults){
  options = options || {};
  defaults = defaults || defaultOptions();
  var ret = _.extend({}, defaults, options);
  ret.chars = _.extend({}, defaults.chars, options.chars);
  ret.style = _.extend({}, defaults.style, options.style);
  return ret;
}

function wordWrap(maxLength,input){
  var lines = [];
  var split = input.split(/(\s+)/g);
  var line = [];
  var lineLength = 0;
  var whitespace;
  for (var i = 0; i < split.length; i += 2) {
    var word = split[i];
    var newLength = lineLength + strlen(word);
    if (lineLength > 0 && whitespace) {
      newLength += whitespace.length;
    }
    if(newLength > maxLength){
      if(lineLength !== 0){
        lines.push(line.join(''));
      }
      line = [word];
      lineLength = strlen(word);
    } else {
      line.push(whitespace || '', word);
      lineLength = newLength;
    }
    whitespace = split[i+1];
  }
  if(lineLength){
    lines.push(line.join(''));
  }
  return lines;
}

function multiLineWordWrap(maxLength, input){
  var output = [];
  input = input.split('\n');
  for(var i = 0; i < input.length; i++){
    output.push.apply(output,wordWrap(maxLength,input[i]));
  }
  return output;
}

function colorizeLines(input){
  var state = {};
  var output = [];
  for(var i = 0; i < input.length; i++){
    var line = rewindState(state,input[i]) ;
    state = readState(line);
    var temp = _.extend({},state);
    output.push(unwindState(temp,line));
  }
  return output;
}

module.exports = {
  strlen:strlen,
  repeat:repeat,
  pad:pad,
  truncate:truncate,
  mergeOptions:mergeOptions,
  wordWrap:multiLineWordWrap,
  colorizeLines:colorizeLines
};

var utils = require('./utils');
var _ = require('lodash');

function DefaultRenderer(options){
  options = options || {};
  this.chars = copyChars(options.chars || {}, defaultChars);
}

DefaultRenderer.prototype.makeCellOptions = function(cellOptions){
  return copyChars((cellOptions && cellOptions.chars) || {},this.chars);
};

DefaultRenderer.prototype.topLeft = function(opts){
  return opts.topLeft;
};

DefaultRenderer.prototype.topRight = function(opts){
  return opts.topRight;
};

function copyChars(chars,defaults){
  var ret = {};
  CHAR_NAMES.forEach(function(name){
    utils.setOption(chars,defaults,name,ret);
  });
  return ret;
}

var defaultChars = {
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
};

var CHAR_NAMES = Object.keys(defaultChars);

module.exports = DefaultRenderer;


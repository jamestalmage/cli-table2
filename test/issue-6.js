var ansi256Colors = require('ansi-256-colors');
var colors = require('colors');
var Table = require('../');
var util = require('util');

function testTableCell(value)
{
  console.log(value);
  try
  {
    var table = new Table({ head: [util.format('%j', value)] });
    table.push([ value ]);
    console.log(table.toString());
  }
  catch(exc)
  {
    console.error("\nError rendering value %j: %s", value, exc.stack || exc.toString());
  }
}

testTableCell(colors.green('green'));
testTableCell('\x1b[90mgray (aixterm 16-color)\x1b[0m');
testTableCell(colors.gray('gray (aixterm 16-color, using "colors")'));
testTableCell('\x1b[38;5;8mgray (xterm-256color)\x1b[0m');
testTableCell(ansi256Colors.fg.bright[0] + 'gray (xterm-256color, using "ansi-256-colors")' + ansi256Colors.reset);
testTableCell('\x1b[38;2;255;136;0ma bright orange (konsole 24-bit)\x1b[0m');
describe('@api Table ',function(){
  var chai = require('chai');
  var expect = chai.expect;
  var Table = require('..');
  var colors = require('colors/safe');

  it('wordWrap with colored text',function(){
    var table = new Table({style:{border:[],head:[]},wordWrap:true,colWidths:[7,9]});

    table.push([colors.red('Hello how are you?'),colors.blue('I am fine thanks!')]);

    var expected = [
        '┌───────┬─────────┐'
      , '│ ' + colors.red('Hello') + ' │ ' + colors.blue('I am') + '    │'
      , '│ ' + colors.red('how') + '   │ ' + colors.blue('fine') + '    │'
      , '│ ' + colors.red('are') + '   │ ' + colors.blue('thanks!') + ' │'
      , '│ ' + colors.red('you?') + '  │         │'
      , '└───────┴─────────┘'
    ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('allows numbers as `content` property of cells defined using object notation', function() {
    var table = new Table({style:{border:[],head:[]}});

    table.push([{content: 12}]);

     var expected = [
       '┌────┐'
     , '│ 12 │'
     , '└────┘'
     ];

    expect(table.toString()).to.equal(expected.join('\n'));
  });

  it('throws if content is not a string or number', function() {
    var table = new Table({style:{border:[],head:[]}});

    expect(function() {
      table.push([{content: {a:'b'}}]);
      table.toString();
    }).to.throw();

  });

  it('works with CJK values', function () {
    var table = new Table({
      head: ['Rel', 'Change', 'By', 'When']
      , style: {border:[],head:[]}
      , colWidths: [6, 21, 25, 17]
    });

    table.push(
      ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago']
      , ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
      , ['v0.1', '中文测试', 'rauchg@gmail.com', '9 minutes ago']
      , ['v0.1', '日本語テスト', 'rauchg@gmail.com', '10 minutes ago']
      , ['v0.1', '한국어테스트', 'rauchg@gmail.com', '11 minutes ago']
    );

    var expected = [
      '┌──────┬─────────────────────┬─────────────────────────┬─────────────────┐'
      , '│ Rel  │ Change              │ By                      │ When            │'
      , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
      , '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 7 minutes ago   │'
      , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
      , '│ v0.1 │ Testing something … │ rauchg@gmail.com        │ 8 minutes ago   │'
      , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
      , '│ v0.1 │ 中文测试            │ rauchg@gmail.com        │ 9 minutes ago   │'
      , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
      , '│ v0.1 │ 日本語テスト        │ rauchg@gmail.com        │ 10 minutes ago  │'
      , '├──────┼─────────────────────┼─────────────────────────┼─────────────────┤'
      , '│ v0.1 │ 한국어테스트        │ rauchg@gmail.com        │ 11 minutes ago  │'
      , '└──────┴─────────────────────┴─────────────────────────┴─────────────────┘'
    ];

    expect(table.toString()).to.equal(expected.join("\n"));
  });
});


/*

 var expected = [
   '┌──┬───┬──┬──┐'
 , '│  │   │  │  │'
 , '├──┼───┼──┼──┤'
 , '│  │ … │  │  │'
 , '├──┼───┼──┼──┤'
 , '│  │ … │  │  │'
 , '└──┴───┴──┴──┘'
 ];

 */
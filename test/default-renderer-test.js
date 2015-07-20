describe('default renderer',function(){
  var chai = require('chai');
  var expect = chai.expect;

  var DefaultRenderer = require('../src/default-renderer');

  it('will render top left length 5',function(){
    var renderer = new DefaultRenderer({style:{border:[],head:[]}});
    var opts = renderer.makeCellOptions();
    var result = renderer.topLeft(5,opts);

    expect(result).to.equal('┌─────')
  });

  it('will render top left length 6',function(){
    var renderer = new DefaultRenderer({style:{border:[],head:[]}});
    var opts = renderer.makeCellOptions();
    var result = renderer.topLeft(6,opts);

    expect(result).to.equal('┌──────')
  });

  it('will render top left length 6 - custom chars on table options',function(){
    var renderer = new DefaultRenderer({
      chars:{
        'top-left':'L',
        'top':'='
      },
      style:{border:[],head:[]}
    });
    var opts = renderer.makeCellOptions();

    var result = renderer.topLeft(6,opts);

    expect(result).to.equal('L======')
  });

  it('will render top left length 6 - custom chars on cell options',function(){
    var renderer = new DefaultRenderer({ style:{border:[],head:[]}  });
    var opts = renderer.makeCellOptions({chars:{
      'top-left': 'L',
      'top': '='
    }});

    var result = renderer.topLeft(6,opts);

    expect(result).to.equal('L======')
  });

  it('will render top right',function(){
    var renderer = new DefaultRenderer({ style:{border:[],head:[]}  });
    var opts = renderer.makeCellOptions();
    expect(renderer.topRight(opts)).to.equal('┐');
  });

  it('will render top right - custom chars on table options',function(){
    var renderer = new DefaultRenderer({
      chars:{
        'top-right':'R',
        'top':'='
      },
      style:{border:[],head:[]}
    });

    var opts = renderer.makeCellOptions();

    expect(renderer.topRight(opts)).to.equal('R');
  });

  it('will render top left length 6 - custom chars on table options',function(){
    var renderer = new DefaultRenderer({ style:{border:[],head:[]}  });
    var opts = renderer.makeCellOptions({chars:{
      'top-right': 'R'
    }});
    expect(renderer.topRight(opts)).to.equal('R');
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
var tokensSource = [
  'Acura', 'Audi', 'BMW', 'Cadillac',
  'Chrysler', 'Dodge', 'Ferrari', 'Ford',
  'GMC', 'Honda', 'Hyundai', 'Infiniti',
  'Jeep', 'Kia', 'Lexus', 'Mini',
  'Nissan', 'Porsche', 'Subaru', 'Toyota',
  'Volkswagon', 'Volvo'
];

function cleanMess(){
  $('#fixture').empty().html('<input type="text" id="tokens-example"/>');
  $('div.tokens-suggestion-selector').remove();
}

suite('tokens', function() {
  var tokens, tokensFidel, el, list, input;

  setup(function(){
    cleanMess();
    el = $('#tokens-example');
    tokens = el.tokens({source : tokensSource});
    tokensFidel = tokens.data('tokens');
    input = $('input.' + tokensFidel.cssClasses['input-text']);
    list = $('ul.' + tokensFidel.cssClasses['token-list']);
  });

  suite('init',function(){
    test('tokens should exists in jQuery\'s namespace', function(){
      assert.equal(typeof $().tokens, 'function');
    });
    test('tokens should hide the original element', function(){
      assert.ok(el.is(':hidden'));
    });
    test('tokens should create a list to hold tokens', function(){
      assert.equal(list.length,1);
    });
    test('tokens should create a list element to hold input', function(){
      assert.equal(list.find('li.' + tokensFidel.cssClasses['list-input-holder']).length,1);
    });
    test('tokens should create an input', function(){
      assert.equal(input.length,1);
    });
    test('tokens should establish autocomplete disabled on input', function(){
      assert.equal(input.attr('autocomplete'),'off');
    });
    test('tokens should establish autocapitalize disabled on input', function(){
      assert.equal(input.attr('autocapitalize'),'off');
    });
    test('tokens should create a dummy element to ease input resizing', function(){
      assert.equal(input.next()[0].nodeName,'TESTER');
    });
    test('tokens should create a div to hold suggestions', function(){
      assert.equal($('div.' + tokensFidel.cssClasses['suggestion-selector']).length,1);
    });
    test('tokens should add elements stated on initValues parameter', function(){
      cleanMess();
      el = $('#tokens-example');
      tokens = el.tokens({source : tokensSource, initValue : ['Acura','Cadillac']});
      tokensFidel = tokens.data('tokens');
      input = $('input.' + tokensFidel.cssClasses['input-text']);
      list = $('ul.' + tokensFidel.cssClasses['token-list']);
      assert.equal(tokensFidel.getValue().length,2);
    });
  });
  suite('tokens',function(){
    suite('add',function(){
      setup(function(){
        cleanMess();
        el = $('#tokens-example');
        tokens = el.tokens({source : tokensSource});
        tokensFidel = tokens.data('tokens');
        list = $('ul.' + tokensFidel.cssClasses['token-list']);
        tokensFidel.addValue('Acura');
      });
      test('should have one token in the DOM', function(){
        assert.equal(list.find('.' + tokensFidel.cssClasses['list-token-holder']).length,1);
      });
      test('should have one value in the internal list', function(){
        assert.equal(tokensFidel.getValue().length,1);
      });
      test('should have updated the original element', function(){
        assert.equal(tokensFidel.el.val(),'Acura');
      });
      test('should fire event passing value as parameter', function(){
        var car = 'Volkswagon';

        tokens.on('add', function(e,value){
          assert.equal(value,car);
        });

        tokensFidel.addValue(car);
      });
      suite('max',function(){
        setup(function(){
          cleanMess();
          el = $('#tokens-example');
          tokens = el.tokens({source : tokensSource, maxSelected : 1});
          tokensFidel = tokens.data('tokens');
        });
        test('only should allow to add one element', function(){
          tokensFidel.addValue('Acura');
          tokensFidel.addValue('Cadillac');
          assert.notEqual(tokensFidel.getValue().length,2);
        });
        test('should fire an event on cap',function(done){
          tokens.on('max',function(){
            done();
          });
          tokensFidel.addValue('Acura');
        });
      });
    });
    suite('remove',function(){
      setup(function(){
        cleanMess();
        el = $('#tokens-example');
        tokens = el.tokens({source : tokensSource, maxSelected : 1});
        tokensFidel.addValue('Acura');
        tokensFidel.removeValue('Acura');
      });
      test('should remove DOM element on remove',function(){
        assert.equal(list.find('.' + tokensFidel.cssClasses['list-token-holder']).length,0);
      });
      test('shouldn\'t have any valyes in the internal list', function(){
        assert.equal(tokensFidel.getValue().length,0);
      });
      test('should have updated the original element', function(){
        assert.equal(tokensFidel.el.val(),'');
      });
    });
  });
});

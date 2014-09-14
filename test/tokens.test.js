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

function writeValue (tokens, value) {
  tokens.val(value);
  tokens.trigger('keyup');
}

function pressKey (input, key){
  var ev = $.Event('keydown');
  ev.ctrlKey = false;
  ev.keyCode = key;
  input.trigger(ev);
}

suite('tokens', function() {
  var tokens, tokensFidel, el, list, input, dummyValue;

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
        tokensFidel = tokens.data('tokens');
        tokensFidel.addValue('Acura');
      });
      test('should remove DOM element on remove',function(){
        tokensFidel.removeValue('Acura');
        assert.equal(list.find('.' + tokensFidel.cssClasses['list-token-holder']).length,0);
      });
      test('shouldn\'t have any valyes in the internal list', function(){
        tokensFidel.removeValue('Acura');
        assert.equal(tokensFidel.getValue().length,0);
      });
      test('should have updated the original element', function(){
        tokensFidel.removeValue('Acura');
        assert.equal(tokensFidel.el.val(),'');
      });
      test('should fire event passing removed value as parameter', function(){
        var car = 'Acura';

        tokens.on('remove', function(e,value){
          assert.equal(value,car);
        });

        tokensFidel.removeValue(car);
        assert.equal(tokensFidel.el.val(),'');
      });
      test('should remove on clicking delete anchor', function(){
        tokensFidel.list.find('.' + tokensFidel.cssClasses['delete-anchor']).click();
        assert.equal(tokensFidel.el.val(),'');
      });
      test('should remove on pressing backspace', function(){
        pressKey(tokensFidel.inputText,tokensFidel.keyCode.BACKSPACE);
        assert.equal(tokensFidel.el.val(),'');
      });
    });
    suite('features',function(){
      suite('list clicking',function(){
        setup(function(){
          cleanMess();
          el = $('#tokens-example');
          tokens = el.tokens({source : tokensSource });
          tokensFidel = tokens.data('tokens');
        });
        test.skip('it should focus on clicking list',function(done){
          tokensFidel.list.click();

          setTimeout(function(){
            assert.ok(tokensFidel.inputText.is(':focus'));
            done();
          },30);
        });
      });
      suite('not suggested values',function(){
        setup(function(){
          cleanMess();
          dummyValue = 'Test';
          el = $('#tokens-example');
          tokens = el.tokens({source : tokensSource });
          tokensFidel = tokens.data('tokens');
        });
        test('it should add values which aren\'t in suggestions',function(){
          writeValue(tokensFidel.inputText,dummyValue);
          pressKey(tokensFidel.inputText,tokensFidel.keyCode.ENTER);

          assert.equal(tokensFidel.getValue(),dummyValue);
        });
        test('it should add values if a comma is pressed',function(){
          writeValue(tokensFidel.inputText,dummyValue);
          pressKey(tokensFidel.inputText,tokensFidel.keyCode.COMMA);

          assert.equal(tokensFidel.getValue(),dummyValue);
        });
        test('it should add values if spacebar is pressed',function(){
          writeValue(tokensFidel.inputText,dummyValue);
          pressKey(tokensFidel.inputText,tokensFidel.keyCode.SPACE);

          assert.equal(tokensFidel.getValue(),dummyValue);
        });
        test('it shouldn\'t add empty values',function(){
          writeValue(tokensFidel.inputText,' ');
          pressKey(tokensFidel.inputText,tokensFidel.keyCode.ENTER);

          assert.equal(tokensFidel.getValue().length,0);
        });
        test('it shouldn\'t add values which aren\'t in suggestions if allowAddingNoSuggestion is false',function(){
          cleanMess();
          tokens = el.tokens({source : tokensSource, allowAddingNoSuggestion : false });
          tokensFidel = tokens.data('tokens');

          writeValue(tokensFidel.inputText,dummyValue);
          pressKey(tokensFidel.inputText,tokensFidel.keyCode.ENTER);

          assert.notEqual(tokensFidel.getValue(),dummyValue);
        });
        test('it should add new value on click', function(){
          writeValue(tokensFidel.inputText,dummyValue);
          $('.' + tokensFidel.cssClasses['add-new-result']).trigger('mousedown');

          assert.equal(tokensFidel.getValue(),dummyValue);
        });
      });
      suite('hide on blur', function(){
        setup(function(){
          cleanMess();
          el = $('#tokens-example');
          tokens = el.tokens({source : tokensSource });
          tokensFidel = tokens.data('tokens');
          dummyValue = 'Test';
        });
        test('it should hide suggestions on blur',function(done){
          tokensFidel.list.click();

          setTimeout(function(){
            tokensFidel.inputText.blur();
            assert.ok(tokensFidel.suggestionsHolder.is(':hidden'));
            done();
          },10);
        });
        test('it should clean input on blur',function(done){
          tokensFidel.list.click();

          setTimeout(function(){
            writeValue(tokensFidel.inputText,dummyValue);
            tokensFidel.inputText.blur();
            assert.notEqual(tokensFidel.inputText.val(),dummyValue);
            done();
          },10);
        });
        test('it shouldn\'t clean input on hiding if cleanInputOnHide is false',function(done){
          cleanMess();
          tokens = el.tokens({source : tokensSource, cleanInputOnHide : false });
          tokensFidel = tokens.data('tokens');
          tokensFidel.list.click();

          setTimeout(function(){
            writeValue(tokensFidel.inputText,dummyValue);
            tokensFidel.inputText.blur();
            assert.equal(tokensFidel.inputText.val(),dummyValue);
            done();
          },10);
        });
      });
      suite('hints', function(){
        setup(function(){
          cleanMess();
          dummyValue = 'Not in list';
        });
        test('it should show a hint on focusing',function(){
          tokens = el.tokens({source : tokensSource });
          tokensFidel = tokens.data('tokens');
          tokensFidel.list.click();

          assert.equal(
              tokensFidel.suggestionsHolder.find('p').text(),
              tokensFidel.texts['type-suggestions']
          );
        });
        test('it shouldn\'t show a hint on focusing if showSuggestionOnFocus is false',function(){
          tokens = el.tokens({source : tokensSource, showSuggestionOnFocus : false });
          tokensFidel = tokens.data('tokens');
          tokensFidel.list.click();

          assert.ok(!tokensFidel.suggestionsHolder.is(':visible'));
        });
        test('it should show add suggestion hint if no suggestions are available', function(){
          tokens = el.tokens({source : tokensSource});
          tokensFidel = tokens.data('tokens');
          writeValue(tokensFidel.inputText,dummyValue);

          assert.equal(
            tokensFidel.suggestionsHolder.find('p').text(),
            tokensFidel.texts['add-result'].replace('%s',dummyValue)
          );
        });
        test('it shouldn\'t show add suggestion hint if no suggestions are available and showMessageOnNoResults is false', function(){
          tokens = el.tokens({source : tokensSource, showMessageOnNoResults : false });
          tokensFidel = tokens.data('tokens');

          writeValue(tokensFidel.inputText,dummyValue);
          assert.ok(!tokensFidel.suggestionsHolder.is(':visible'));
        });
        test('it should show no results hint if no suggestions are available and allowAddingNoSuggestion is false', function(){
          tokens = el.tokens({source : tokensSource, allowAddingNoSuggestion : false });
          tokensFidel = tokens.data('tokens');

          writeValue(tokensFidel.inputText,dummyValue);
          assert.equal(
            tokensFidel.suggestionsHolder.find('p').text(),
            tokensFidel.texts['no-results']
          );
        });
        test('it shouldn\'t show hintst if no suggestions are available, source is empty and allowAddingNoSuggestion is false', function(){
          tokens = el.tokens({source : [], allowAddingNoSuggestion : false });
          tokensFidel = tokens.data('tokens');

          writeValue(tokensFidel.inputText,dummyValue);
          assert.ok(!tokensFidel.suggestionsHolder.is(':visible'));
        });
      });
      suite('validation', function(){
        setup(function(){
          cleanMess();
        });
        test('only valid input should be allowed', function() {
          tokens = el.tokens({
            source: [],
            validate: function(query) {
              return (query.indexOf('example.com') > -1);
            },
            cleanInputOnHide: false
          });
          tokensFidel = tokens.data('tokens');

          writeValue(tokensFidel.inputText, 'example<>');

          assert.equal(
            tokensFidel.suggestionsHolder.find('p').text(),
            tokensFidel.texts['add-result'].replace('%s','example<>')
          );

          pressKey(tokensFidel.inputText,tokensFidel.keyCode.ENTER);

          assert.equal(
            tokensFidel.suggestionsHolder.find('p').text(),
            tokensFidel.texts['invalid-format'].replace('%s','example<>')
          );
        });

        test('allow valid to modify input', function() {
          tokens = el.tokens({
            source: [],
            validate: function(query) {
              return query.split('').reverse().join('');
            },
            cleanInputOnHide: false
          });
          tokensFidel = tokens.data('tokens');

          writeValue(tokensFidel.inputText, 'example');

          pressKey(tokensFidel.inputText,tokensFidel.keyCode.ENTER);

          assert.equal(tokensFidel.getValue()[0], 'elpmaxe');
        });
      });

      suite.skip('allowMultiplePaste',function(){
        setup(function(){
          cleanMess();
          el = $('#tokens-example');
          tokens = el.tokens({source : tokensSource, allowMultiplePaste: true});
          tokensFidel = tokens.data('tokens');
          list = $('ul.' + tokensFidel.cssClasses['token-list']);
          tokensFidel.el.val('Acura,Nissan').trigger('paste');
        });
        test('should have one token in the DOM', function(){
          assert.equal(list.find('.' + tokensFidel.cssClasses['list-token-holder']).length,2);
        });
        test('should have one value in the internal list', function(){
          assert.equal(tokensFidel.getValue().length,2);
        });
        test('should have updated the original element', function(){
          assert.equal(tokensFidel.el.val(),'Acura, Nissan');
        });
      });
    });
  });
});

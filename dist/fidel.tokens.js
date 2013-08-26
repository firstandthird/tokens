/*!
 * tokens - jQuery plugin that turns a text field into a tokenized autocomplete
 * v0.1.1
 * https://github.com/jgallen23/tokens/
 * copyright Greg Allen 2013
 * MIT License
*/
(function($){
  function escapeString (value) {
    return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  $.declare('tokens',{
    defaults : {
      formatSuggestion : function(suggestion, value){
        var pattern = '(' + escapeString(value) + ')';
        return suggestion.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
      },
      search : function(suggestion, queryOriginal, queryLowerCase){
        return suggestion.toLowerCase().indexOf(queryLowerCase.toLowerCase()) !== -1;
      },
      query : function(query, callback){
        var queryLower = query.toLowerCase(), self = this;

        var suggestions = $.grep(this.source, function(suggestion){
          return self.search(suggestion, query, queryLower);
        });

        callback.apply(this,[suggestions]);
      },
      keyCode : {
        UP : 38,
        DOWN : 40,
        TAB: 9,
        ENTER : 13,
        ESC : 27
      },
      texts : {
        'close-text' : '×',
        'type-suggestions' : 'Type to search values',
        'no-results' : 'There are no results matching'
      },
      cssClasses : {
        'token-list' : 'tokens-token-list',
        'list-input-holder' : 'tokens-list-input-holder',
        'list-token-holder' : 'tokens-list-token-holder',
        'input-text' : 'tokens-input-text',
        'delete-anchor' : 'tokens-delete-token',
        'suggestion-selector' : 'tokens-suggestion-selector',
        'suggestions-list-element' : 'tokens-suggestions-list-element',
        'highlighted-suggestion' : 'tokens-highlighted-suggestion'
      },
      maxSelected : 0,
      showSuggestionOnFocus : true,
      showMessageOnNoResults : true,
      cleanInputOnHide : true,
      suggestionsZindex : 999,
      sources : [],
      initValue : [],
      minChars : 0
    },
    _getTarget : function(e){
      return $(e.currentTarget || e.toElement);
    },
    _setAttributes: function () {
      this.el.hide();
    },
    _createStructure: function () {
      this.list = $('<ul>').addClass(this.cssClasses['token-list']);

      this.listInputHolder = $('<li>')
          .addClass(this.cssClasses['list-input-holder'])
          .appendTo(this.list);

      this.inputText = $('<input type="text">')
          .attr('autocomplete','off')
          .attr('autocapitalize', 'off')
          .addClass(this.cssClasses['input-text'])
          .appendTo(this.listInputHolder);

      this.list.insertBefore(this.el);
      this._createTester();
      this._createSuggestionsStructure();
    },
    _createSuggestionsStructure : function(){
      this.suggestionsHolder = $('<div>')
          .addClass(this.cssClasses['suggestion-selector'])
          .css({
            position : 'absolute',
            'z-index' : this.suggestionsZindex
          })
          .hide()
          .appendTo($('body'));
    },
    _createTester : function(){
      this.inputResizer = $('<tester>').css({
        position: 'absolute',
        top : -9999,
        left : -9999,
        width : 'auto',
        'font-size' : this.inputText.css('font-size'),
        'font-family' : this.inputText.css('font-family'),
        'font-weight' : this.inputText.css('font-weight'),
        'letter-spacing' : this.inputText.css('letter-spacing'),
        whitespace : 'nowrap'
      }).insertAfter(this.inputText);
    },
    _focusInput: function () {
      var self = this;
      setTimeout(function(){ self.inputText.focus(); },10);
    },
    _onDeleteClick: function (e) {
      e.stopImmediatePropagation();
      this._removeNode(this._getTarget(e).parent());
    },
    _onListClick : function(){
      this._focusInput();
      this._showTypeSuggestion();
    },
    _onKeyDown : function(event){
      switch(event.keyCode){
        case this.keyCode.UP :
          this._prevSuggestion();
          break;
        case this.keyCode.DOWN :
          this._nextSuggestion();
          break;
        case this.keyCode.ESC :
          this.el.val(this.currentValue);
          this._hideSuggestions();
          break;
        case this.keyCode.TAB:
        case this.keyCode.ENTER:
          this._selectSuggestion();
          break;
        default:
          return;
      }

      event.stopImmediatePropagation();
      event.preventDefault();
    },
    _onKeyUp : function(event){
      switch(event.keyCode){
        case this.keyCode.UP :
        case this.keyCode.DOWN :
          return;
      }
      this._suggestionChanged();
    },
    _onMouseOver : function (event) {
      var target = this._getTarget(event);
      this._activateSuggestion(target.data('index'));
    },
    _suggestionChanged : function(){
      var value = $.trim(this.inputText.val());

      if (value !== this.suggestionValue){
        this.inputText.val(value);
        this.suggestionValue = value;
        this.selectedSuggestion = -1;

        if (value.length > this.minChars){
          this._updateSuggestions();
        }
      }
    },
    _nextSuggestion : function(){
      if (this.selectedSuggestion !== (this.suggestions.length -1)){
        this._adjustPosition(this.selectedSuggestion + 1);
      }
    },
    _prevSuggestion : function(){
      if (this.selectedSuggestion !== -1){
        this._adjustPosition(this.selectedSuggestion -1);
      }
    },
    _updateSuggestions : function(){
      var self = this;

      this.query.call(self, self.suggestionValue, function(suggestions){
        var len = suggestions.length;

        if (suggestions && $.isArray(suggestions) && len){
          var html = $('<ul>');
          this.suggestions = suggestions;

          for (var i = 0; i < len; i++){
            html.append(
              $('<li>').
              addClass(this.cssClasses['suggestions-list-element']).
              data('index',i).
              html(this.formatSuggestion(suggestions[i], this.suggestionValue))
            );
          }

          this.suggestionsHolder.empty().append(html);
          this._showSuggestions();
        }
        else {
          this._addTextToSuggestions(this.texts['no-results']);
        }
      });
    },
    _adjustPosition : function(index){
      var selectedSuggestion = this._activateSuggestion(index),
          selTop, upperLimit, lowerLimit, elementHeight;

      if (selectedSuggestion){
        selTop = selectedSuggestion.offset().top;
        upperLimit = this.suggestionsHolder.scrollTop();
        elementHeight = selectedSuggestion.outerHeight();
        lowerLimit = upperLimit - elementHeight;

        if (selTop < upperLimit){
          this.suggestionsHolder.scrollTop(selTop);
        }
        else if (selTop > lowerLimit) {
          this.suggestionsHolder.scrollTop(selTop - elementHeight);
        }

        this.inputText.val(this.suggestions[index]);
      }
    },
    _deactivateSuggestion : function(event){
      this._getTarget(event).removeClass(this.cssClasses['']);
      this.selectedSuggestion = -1;
    },
    _selectSuggestion : function(){
      this.addValue(this.suggestions[this.selectedSuggestion]);
      this._hideSuggestions();
    },
    _activateSuggestion : function(index){
      var cssClass = this.cssClasses['highlighted-suggestion'],
          list = this.suggestionsHolder.find('ul'),
          element = null;

      list.children('.' + cssClass).removeClass(cssClass);
      this.selectedSuggestion = index;

      if (index !== -1 && list.children().length > index){
        element =  $(list.children().get(index)).addClass(cssClass);
      }

      return element;
    },
    _resizeInput : function() {
      if (this.inputResizer.text() !== this.inputText.val()){
        this.inputResizer.html(escapeString(this.inputText.val()));
        this.inputText.width(this.inputResizer.width() + 30);
      }
    },
    _bindEvents: function () {
      this.list.on('click',this.proxy(this._onListClick,this));
      this.list.on('click', '.' + this.cssClasses['delete-anchor'], this.proxy(this._onDeleteClick,this));

      this.inputText.on('blur', this.proxy(this._hideSuggestions,this));
      this.inputText.on('keydown', this.proxy(this._onKeyDown,this));
      this.inputText.on('keyup', this.proxy(this._onKeyUp,this));
      this.inputText.on('blur keyup keydown', this.proxy(this._resizeInput,this));

      var listClass = '.' + this.cssClasses['suggestions-list-element'];

      this.suggestionsHolder.on('mouseover', listClass, this.proxy(this._onMouseOver,this));
      this.suggestionsHolder.on('mouseout', listClass, this.proxy(this._deactivateSuggestion,this));
      this.suggestionsHolder.on('click', listClass, this.proxy(this._selectSuggestion,this));
    },
    _getCloseAnchor: function () {
      return $('<span>').text(this.texts['close-text']).addClass(this.cssClasses['delete-anchor']);
    },
    _updateValue : function() {
      this.el.val(this.currentValue.join(', '));
    },
    _getTextFromNode : function($node){
      return $node.find('p').text();
    },
    _getNodeFromText : function(text){
      var $node = null,
          self = this;

      this.list.find('.' + this.cssClasses['list-token-holder']).each(function(){
        if (self._getTextFromNode($(this)) === text){
          $node = $(this);
        }

        return $node === null;
      });

      return $node;
    },
    _removeNode : function($node, text){
      text = text || this._getTextFromNode($node);
      var index = this.currentValue.indexOf(text);
      if (index !== -1){
        $node.remove();
        this.currentValue.splice(index,1);
        this._updateValue();

        this.emit('remove', text);
      }
    },
    _addInitialValues : function(){
      for (var i = 0, len = this.initValue.length; i < len; i++) {
        this.addValue(this.initValue[i]);
      }
    },
    _isWithinMax : function(){
      return this.maxSelected === 0 || (this.currentValue.length < this.maxSelected);
    },
    _hasReachedMax : function() {
      return this.maxSelected !== 0 || (this.currentValue.length === this.maxSelected);
    },
    _getSuggestionPosition : function(){
      return {
        top : this.list.offset().top + this.list.outerHeight(),
        left : this.list.offset().left,
        width : this.list.width()
      };
    },
    _showTypeSuggestion : function(){
      if (this.showSuggestionOnFocus && ! this.suggestions.length){
        this._addTextToSuggestions(this.texts['type-suggestions']);
      }
    },
    _addTextToSuggestions : function(text){
      this.suggestionsHolder.html('<p>' + text + '</p>');
      this._showSuggestions();
    },
    _showSuggestions : function(){
      if (!this.visibleSuggestions){
        this.visibleSuggestions = true;
        this.suggestionsHolder.css(this._getSuggestionPosition()).show();
      }
    },
    _hideSuggestions : function() {
      this.visibleSuggestions = false;
      this.suggestionValue = '';
      this.suggestions = [];
      this.suggestionsHolder.hide();

      if (this.cleanInputOnHide){
        this.inputText.val('');
      }
    },
    getValue : function() {
      return this.currentValue;
    },
    addValue: function (value) {
      if (this.currentValue.indexOf(value) === -1 && this._isWithinMax()){
        this.currentValue.push(value);
        var list = $('<li>').addClass(this.cssClasses['list-token-holder']),
            paragraph = $('<p>').text(value);

        paragraph.appendTo(list);
        this._getCloseAnchor().appendTo(list);
        list.insertBefore(this.listInputHolder);
        this._updateValue();

        this.emit('add', value);

        if (this._hasReachedMax()){
          this.emit('max', value);
        }
      }
     },
    removeValue: function (value) {
      this._removeNode(this._getNodeFromText(value),value);

      return this.el;
    },
    init : function(){
      this.visibleSuggestions = false;
      this.currentValue = [];
      this.suggestions = [];
      this.suggestionValue = '';
      this.selectedSuggestion = -1;

      this._setAttributes();
      this._createStructure();
      this._bindEvents();
      this._addInitialValues();
    }
  });
})(jQuery);

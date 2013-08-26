#tokens

jQuery plugin that turns a text field into a tokenized autocomplete

##Installation

###Bower

`bower install tokens`

###Manual Download

- [Development]()
- [Production]()

##Usage

Usage is fairly simple. Just target a text input and call tokens on top of it:

````js
$('#test').tokens();
````

You can either provide a `source` parameter or pass a `query` function which retrieves data from server and return an
 array of suggestions.

### Optional parameters

#### `search`

The function against which are evaluated the suggestions. Have to return either `true` or `false`.

#### `texts`

All appearing texts can be replaced by passing parameters within this object:

* `close-text` : '×'
* `type-suggestions` : 'Type to search values'
* `no-results` : 'There are no results matching'

#### `cssClasses`

All css classes can be replaced by passing parameters within this object:

* `token-list` : Used in the list of tokens
* `list-input-holder` : Used to style the list element in which is contained the input
* `list-token-holder` : Used to style the list element in which are contained tokens
* `input-text` : Used to style the input element
* `delete-anchor` : Used to style the delete anchor which is meant to delete a token from the list
* `suggestion-selector` : Used to style the div which holds suggestions and hints
* `suggestions-list-element` : Used to style the list elements for suggestions
* `highlighted-suggestion` : Used to highlight suggestions within the list when navigating or hovering

#### `minChars`

Minimum chars you need to write for the suggestions to appear.

#### `maxSelected`

Option to cap the ammount of tokens you can add.

#### `showSuggestionOnFocus`

Option to show type suggestion when focus on the element.

#### `showMessageOnNoResults`

Option to show a message if no suggestions are available.

#### `cleanInputOnHide`

Option to clean the input when suggestions are hidden.

#### `initValue`

Array of initial values you want to see added when plugin inits

#### `allowAddingNoSuggestion`

Option that allows you to add a value on enter even if it's not on the suggestions.

#### `suggestionsZindex`

`z-index` value for suggestion's div.

#### `formatSuggestion`

A function that is used to format a suggestion while typing. Function receives two parameters:

* `suggestion` : The value of the full suggestion
* `value` : The value typed on the input.

#### `query`

A function that is used to retreive suggestions. By default, it will use the internal sources, however you can write your
own function to query a database and return an array of suggestions. This function receives two parameters

* `query` : The value entered by the user
* `callback` : The function that you should call, passing the suggestions as an array, once you finished getting your results

** Note ** : `this` will be the widget object, is your responsability to mantain the scope within the callback!

## Events

Some events are fired:

### `add`

When an element is added this event is fired. Receives the value added as a parameter.

### `remove`

When an element is removed, this event is fired. Receives the value removed as a parameter.

### `max`

If you specify the `maxSelected` option to a value greater than `0', this event will be fired whenever you reach that
 ammount of tokens added.

##Development

###Requirements

- node and npm
- bower `npm install -g bower`
- grunt `npm install -g grunt-cli`

###Setup

- `npm install`
- `bower install`

###Run

`grunt dev`

or for just running tests on file changes:

`grunt ci`

###Tests

`grunt mocha`

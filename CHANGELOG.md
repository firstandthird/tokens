
0.6.0 / 2014-09-14
==================

 * Merge pull request #28 from firstandthird/feature/paste-multiple-emails
 * Switched to use paste event.
 * Adds in basic support to paste a comma separated list of items all at once.

0.5.3 / 2014-08-29 
==================

  * Check if theres input before throwing error

0.5.2 / 2014-08-22
==================

 * Small fix for html being rendered in tester element

0.5.1 / 2014-08-22
==================

 * Merge pull request #26 from firstandthird/feature/tweaks
 * Fixed issue where message would not move when input dropped lines

0.5.0 / 2014-08-08
==================

 * validate method can optionally return a modified string that will override the val.

0.4.2 / 2014-01-23 
==================

  * Fixes issue where item could be added multiple times.
  * Adds error message when existing item is added.
  * Fixes an issue where input isn't cleared when an item is added.

0.4.1 / 2014-01-18 
==================

  * Allows click to add with invalid message.
  * Added invalid class when validations fails. Defaults to red.
  * Changed validation to only run when text is about to be added.
  * Added ability to click new suggestion and have it added.
  * added example showing off validation

0.4.0 / 2014-01-06 
==================

  * Added overflow: auto to tokens-token-list
  * Removed font-family and allows font-size to be passed in.
  * Added optional validation.

0.3.0 / 2013-11-26 
==================

 * Spacebar adds token

0.2.6 / 2013-11-08 
==================

  * Avoiding trimming spaces accidentally
  * Several improvements

0.2.5 / 2013-11-07 
==================

  * moved less to less folder and added back less tasks

0.2.4 / 2013-11-07 
==================

  * Fixing bugs
  * fixed passing tests. #1
  * updated build scripts

0.2.0 / 2013-08-26
==================

  * Added new option, `allowAddingNoSuggestion`, to allow to add a token even if no suggestions match the input.
  * Now if you press backspace and there is no value on the input, it will delete the last token.

0.1.1 / 2013-08-26
==================

  * updated main file in bower.json

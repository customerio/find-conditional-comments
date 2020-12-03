# find-conditional-comments

> Finds all conditional comments in a string

[![codecov](https://codecov.io/gh/useparcel/find-conditional-comments/branch/main/graph/badge.svg?token=J5OFD5Z4GF)](https://codecov.io/gh/useparcel/find-conditional-comments)
[![npm package](https://img.shields.io/npm/v/find-conditional-comments.svg)](https://www.npmjs.com/package/find-conditional-comments)
[![Twitter Follow](https://img.shields.io/twitter/follow/useparcel.svg?style=social)](https://twitter.com/useparcel)

## Install 

```
$ npm install find-conditional-comments
```

## Usage

```js
const findConditionalComments = require('find-conditional-comments');

const html = `
<!--[if mso]>
Hello, Microsoft Outlook!
<![endif]-->
`

findConditionalComments(html);
//=> [ { open: "<!--[if mso]>", close: "<![endif]-->", range: [1, 63], downlevel: "hidden" } ]
```

## API

### findConditionalComments(html)

Returns an Array of Objects for each comment with the following properties:

#### open
> `String` 

Opening portion of the conditional comment.

#### close
> `String`

Closing portion of the conditional comment.

#### downlevel
> `String`

Either `hidden` or `revealed`. [Learn more](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/ms537512(v%3dvs.85)#downlevel-hidden-conditional-comments).

#### range
> `Array`

A [range](https://codsen.com/ranges/) array containing the start and end indices of the comment.

## Related

* [regex-empty-conditional-comments](https://www.npmjs.com/package/regex-empty-conditional-comments)
* [posthtml-mso](https://www.npmjs.com/package/posthtml-mso)
* [html-comment-regex](https://www.npmjs.com/package/html-comment-regex)

const CONDITIONAL_COMMENT_REGEX = /(<!(--)?\[if\s[()\w\s|&!]+\]>(?:<!--+>)?)(.*?)(<!\[endif\]\2>)/gi;
const extract = require("./utils/extract-condition");
const tokenize = require("./utils/tokenize-condition");
const parse = require("./utils/parse-condition");

module.exports = function findConditionalComments(str) {
  let comments = [];

  let result;
  while ((result = CONDITIONAL_COMMENT_REGEX.exec(str)) !== null) {
    const [match, start, commentDashes, content, end] = result;

    comments.push({
      start,
      end,
      range: [
        CONDITIONAL_COMMENT_REGEX.lastIndex - match.length,
        CONDITIONAL_COMMENT_REGEX.lastIndex,
      ],
    });
  }

  for (let comment of comments) {
    comment.conditions = parse(tokenize(extract(comment.start)));
  }

  return comments;
};

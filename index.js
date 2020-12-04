const CONDITIONAL_COMMENT_REGEX = /(<!(--)?\[if\s[()\w\s|&!]+\]>(?:<!--+>)?)((?:.|\n)*?)((?:<!--)?<!\[endif\]\2>)/gi;

module.exports = function findConditionalComments(str) {
  let comments = [];

  let result;
  while ((result = CONDITIONAL_COMMENT_REGEX.exec(str)) !== null) {
    const [match, open, commentDashes, content, close] = result;

    comments.push({
      open,
      close,
      downlevel: commentDashes == "--" ? "hidden" : "revealed",
      range: [
        CONDITIONAL_COMMENT_REGEX.lastIndex - match.length,
        CONDITIONAL_COMMENT_REGEX.lastIndex,
      ],
    });
  }

  return comments;
};

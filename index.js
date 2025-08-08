// Token regexes to support nested conditional comments
const OPEN_REGEX = /<!(--)?\[if\s[()\w\s|&!]+\]>(?:<!--+>)?/gi;
// Capture whether the close carries trailing dashes ("--") before '>' to enforce symmetry
const CLOSE_REGEX = /(?:<!--)?<!\[endif\](--)?>/gi;

module.exports = function findConditionalComments(str) {
  const comments = [];

  // Use a stack to handle nested conditional comments
  const stack = [];
  let position = 0;

  while (position < str.length) {
    // Find next open and next close from current position
    OPEN_REGEX.lastIndex = position;
    CLOSE_REGEX.lastIndex = position;

    const openMatch = OPEN_REGEX.exec(str);
    const closeMatch = CLOSE_REGEX.exec(str);

    // If neither token is found, we're done
    if (!openMatch && !closeMatch) {
      break;
    }

    // Choose the earliest token occurrence
    const nextOpenIndex = openMatch ? openMatch.index : Infinity;
    const nextCloseIndex = closeMatch ? closeMatch.index : Infinity;

    if (nextOpenIndex < nextCloseIndex) {
      // Process opening token
      const openText = openMatch[0];
      const openStart = openMatch.index;
      const openEnd = OPEN_REGEX.lastIndex;

      const isComment = openText.startsWith("<!--");
      const bubble = openText.endsWith("-->");

      stack.push({
        open: openText,
        start: openStart,
        end: openEnd,
        isComment,
        bubble,
      });

      position = openEnd;
      continue;
    }

    // Process closing token
    const closeText = closeMatch[0];
    const closeStart = closeMatch.index;
    const closeEnd = CLOSE_REGEX.lastIndex;

    if (stack.length > 0) {
      const openState = stack[stack.length - 1];
      const closeHasDashes = Boolean(closeMatch[1]);
      const openRequiresDashes = openState.isComment; // HTML comment style requires '-->'

      if (closeHasDashes === openRequiresDashes) {
        // Valid matching close for the most recent open
        stack.pop();
        comments.push({
          isComment: openState.isComment,
          open: openState.open,
          close: closeText,
          bubble: openState.bubble,
          downlevel:
            openState.bubble || !openState.isComment ? "revealed" : "hidden",
          range: [openState.start, closeEnd],
        });
      }
    }

    position = closeEnd;
  }

  return comments;
};

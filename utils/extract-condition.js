/**
 * Strips the start of the comment to just include the condition
 *
 * `<!--[if (mso 12)|(mso 16)]>` becomes `(mso 12)|(mso 16)`
 * `<!--[if !mso]>` becomes `!mso`
 */
module.exports = function extractCondition(start) {
  return start
    .replace(/^<!--\[if/, "")
    .replace(/\]>(<!--+>)?$/, "")
    .trim();
};

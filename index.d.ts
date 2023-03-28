/**
 * Finds the conditional comments in HTML.
 */
export default function findConditionalComments(
  html: string
): {
  /**
   * Whether the item is a comment
   */
  isComment: boolean;

  /**
   * Opening portion of the conditional comment.
   */
  open: string;

  /**
   * Closing portion of the conditional comment.
   */
  close: string;

  /**
   * Whether the comment "bubbles" around the value.
   */
  bubble: boolean;

  /**
   * Either "revealed" or "hidden".
   */
  downlevel: "revealed" | "hidden";

  /**
   * A range array containing the start and end indices of the comment.
   */
  range: [number, number];
}[];

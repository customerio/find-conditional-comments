/**
 * Finds the conditional comments in HTML.
 */
export default function findConditionalComments(html: string): {
  /**
   * Opening portion of the conditional comment.
   */
  open: string;
  /**
   * Closing portion of the conditional comment.
   */
  close: string;
  bubble: boolean;
  /**
   * Either "revealed" or "hidden".
   * 
   * https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/ms537512(v%3dvs.85)#downlevel-hidden-conditional-comments
   */
  downlevel: "revealed" | "hidden";

  /**
   * A range array containing the start and end indices of the comment.
   */
  range: [number, number];
}[];
const TokenStream = require("./token-stream");
const tokenize = require("./tokenize");

const operatorMap = {
  lt: "lessThan",
  lte: "lessThanInclusive",
  gt: "greaterThan",
  gte: "greaterThanInclusive",
  "!": "notEqual",
};

const booleanExpressionMap = {
  "|": "any",
  "&": "all",
};

module.exports = function parse(start) {
  /**
   * Strips the start of the condition to just include the expression
   *
   * `<!--[if (mso 12)|(mso 16)]>` becomes `(mso 12)|(mso 16)`
   * `<!--[if !mso]>` becomes `!mso`
   */
  const stringCondition = start
    .replace(/^<!--\[if/, "")
    .replace(/\]>(<!--+>)?$/, "")
    .trim();
  const tokens = tokenize(stringCondition);
  const stream = new TokenStream(tokens);
  const state = { parenthesisCount: 0 };

  return {
    all: [parseExpression(stream, state)],
  };
};

function parseExpression(stream, state) {
  let left, right, operator;

  skipOpenGroup(stream, state);
  left = parseAtom(stream, state);

  if (
    !stream.isEOF() &&
    (stream.peek().value === "|" || stream.peek().value === "&")
  ) {
    operator = booleanExpressionMap[stream.advance().value];

    right = parseExpression(stream, state);
  }

  skipCloseGroup(stream, state);

  if (state.parenthesisCount !== 0) {
    throw new Error(
      `Mismatched parenthesis: ${state.parenthesisCount} extra ${
        state.parenthesisCount > 0 ? "opening" : "close"
      }`
    );
  }

  return operator ? { [operator]: [left, right] } : left;
}

function skipOpenGroup(stream, state) {
  while (stream.peek().value === "(" && stream.peek().type === "punctuation") {
    stream.advance();
    state.parenthesisCount++;
  }
}

function skipCloseGroup(stream, state) {
  while (
    !stream.isEOF() &&
    stream.peek().value === ")" &&
    stream.peek().type === "punctuation"
  ) {
    stream.advance();
    state.parenthesisCount--;
  }
}

function parseAtom(stream, state) {
  const condition = {
    operator: "equal",
    value: true,
  };

  skipOpenGroup(stream, state);

  while (
    !stream.isEOF() &&
    stream.peek().value !== ")" &&
    !booleanExpressionMap.hasOwnProperty(stream.peek().value)
  ) {
    const token = stream.advance();
    if (token.type === "feature") {
      condition.fact = token.value;
    } else if (token.type === "version") {
      condition.value = token.value;
    } else if (
      token.type === "operator" &&
      operatorMap.hasOwnProperty(token.value)
    ) {
      condition.operator = operatorMap[token.value];
    } else {
      throw new Error(`Unexpected token: ${JSON.stringify(token, null)}`);
    }
  }

  skipCloseGroup(stream, state);

  return condition;
}

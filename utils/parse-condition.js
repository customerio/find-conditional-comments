const TokenStream = require("./token-stream");

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

module.exports = function parseCondition(tokens) {
  const stream = new TokenStream(tokens);

  /**
   * Force a conditional wrapper
   */
  return {
    all: [parseExpression(stream)],
  };
};

function parseExpression(stream) {
  let left, right, operator;

  if (stream.peek().value === "(") {
    stream.advance();
    left = parseExpression(stream);
    if (stream.peek().value === ")") {
      stream.advance();
    } else {
      throw new Error(`Mismatched parenthesis`);
    }
  } else {
    left = parseAtom(stream);
  }

  if (
    !stream.isEOF() &&
    (stream.peek().value === "|" || stream.peek().value === "&")
  ) {
    operator = booleanExpressionMap[stream.advance().value];

    right = parseExpression(stream);
  }

  return operator ? { [operator]: [left, right] } : left;
}

function parseAtom(stream) {
  const condition = {
    operator: "equal",
    value: true,
  };

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

  return condition;
}

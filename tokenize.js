/**
 * Take a string and tokenize it to an array of Token objects
 *
 * Token: {
 *   type: Enum(punctuation|operators|feature|version),
 *   value: String
 * }
 */
module.exports = function tokenize(string) {
  let tokens = [];
  let token = "";

  function pushToken() {
    if (token.length === 0) {
      // do nothing on empty tokens
    }
    // version
    else if (isVersion(token)) {
      tokens.push({ type: "version", value: token });
    }
    // feature
    else if (isFeature(token)) {
      tokens.push({ type: "feature", value: token });
    } else {
      throw new Error(`Unable to parse token: \`${token}\``);
    }

    token = "";
  }

  for (let char of string) {
    // punctuation
    if (["(", ")", " "].includes(char)) {
      pushToken();
      tokens.push({ type: "punctuation", value: char });
      continue;
    }

    // operators
    if (["|", "&", "!", "gt", "gte", "lt", "lte"].includes(char)) {
      pushToken();
      tokens.push({ type: "operator", value: char });
      continue;
    }

    token += char;
  }

  pushToken();

  return tokens.filter(({ value }) => value !== " ");
};

function isVersion(token) {
  return /[0-9][A-Za-z0-9.]*/.test(token);
}

function isFeature(token) {
  return /[A-Za-z][A-Za-z0-9]*/.test(token);
}

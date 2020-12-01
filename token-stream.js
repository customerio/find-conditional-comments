module.exports = class TokenStream {
  constructor(tokens) {
    this.tokens = tokens;
  }

  isEOF() {
    return this.tokens.length === 0;
  }

  lookahead(index) {
    if (this.tokens.length <= index) {
      throw new Error("Cannot read past the end of a stream");
    }
    return this.tokens[index];
  }

  peek() {
    return this.lookahead(0);
  }

  advance() {
    if (this.tokens.length === 0) {
      throw new Error("Cannot read past the end of a stream");
    }

    return this.tokens.shift();
  }

  defer(token) {
    this.tokens.unshift(token);
  }
};

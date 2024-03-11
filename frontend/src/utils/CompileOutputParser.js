/**
 * Parses compile output to get line numbers of errors
 * @param input compile output
 * @returns {number[]} all line numbers with errors in code
 */
export function parseErrorLines(input) {
  const regex = /.java:(\d+)/g;
  const numbers = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    const lineNumber = parseInt(match[1]);
    numbers.push(lineNumber);
  }

  return numbers;
}

/**
 * Return the index of the first non whitespace character in a string
 * @param str string to search
 * @returns {number} index of first non whitespace character
 */
export function findFirstNonWhitespaceIndex(str) {
  const nonWhitespaceRegex = /\S/;
  return str.search(nonWhitespaceRegex);
}

/**
 * Return the index of the last non whitespace character in a string
 * @param str string to search
 * @returns {number} index of last non whitespace character
 */
export function findLastNonWhitespaceIndex(str) {
  const nonWhitespaceRegex = /\S/;
  let lastIndex = -1;

  for (let i = 0; i < str.length; i++) {
    if (str[i].match(nonWhitespaceRegex)) {
      lastIndex = i;
    }
  }

  return lastIndex;
}
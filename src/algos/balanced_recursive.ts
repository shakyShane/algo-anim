const mapping = {
  "(": ")",
  "[": "]",
  "{": "}",
};

export interface Result {
  input: string;
  result?: boolean;
  values: Value[];
}

export interface Value {
  char: string | null;
  charIndex: number;
  search?: string | null;
  child?: Result;
}

/**
 * @param {string} slice
 * @returns {boolean}
 */
export function balanced_recursive(slice: string): Result {
  const child: Result = { values: [], input: slice };
  const result = expect(null, slice.split(""), 0, child.values);
  child.result = result;
  return child;
}

/**
 * @param {string|null} end
 * @param {string[]} chars
 * @param charIndex
 * @param {Value[]} values
 * @returns {boolean}
 */
function expect(end, chars, charIndex: number, values: Value[]): boolean {
  let index = charIndex;
  while (true) {
    let c = chars.shift();
    let pushed = false;
    if (c === undefined) c = null; // just here to allow JSON
    index += 1;
    console.log(index, c);
    let v: Value = { char: c ? c : null, charIndex: index };
    let good;
    switch (c) {
      case "(":
      case "{":
      case "[": {
        let child: Result = { values: [], input: chars.join("") };
        v.child = child;
        good = expect(mapping[c], chars, index, v.child.values);
        index += v.child.values.length;
        v.child.result = good;
        break;
      }
      case null:
      case ")":
      case "}":
      case "]": {
        good = end === c;
        values.push(v);
        return good;
      }
      default: {
        good = true; // any other char
      }
    }
    values.push(v);
    if (!good) {
      return false;
    }
  }
}

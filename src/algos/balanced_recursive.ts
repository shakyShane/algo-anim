const mapping = {
  "(": ")",
  "[": "]",
  "{": "}",
};

type Result = { result?: boolean; values: Value[]; color: string };
type Value = {
  char: string | null;
  search?: string | null;
  child?: Result;
};

/**
 * @param {string} slice
 * @returns {boolean}
 */
export function balanced_recursive(slice): Result {
  const child: Result = { values: [], color: "green" };
  const result = expect(null, slice.split(""), child.values);
  console.log("result, ", result);
  child.result = result;
  return child;
}

/**
 * @param {string|null} end
 * @param {string[]} chars
 * @param {Value[]} values
 * @returns {boolean}
 */
function expect(end, chars, values: Value[]): boolean {
  while (true) {
    let c = chars.shift();
    if (c === undefined) c = null; // just here to allow JSON
    let v: Value = { char: c ? c : null };
    let good;
    switch (c) {
      case "(":
      case "{":
      case "[": {
        let child: Result = { values: [], color: "orange" };
        v.child = child;
        good = expect(mapping[c], chars, v.child.values);
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

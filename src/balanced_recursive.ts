import { gsap } from "gsap";
import "./algo-stack.lit";
import Stack from "./algo-stack.lit";
import { name } from "./controls.lit";
import { name as pointerName, Pointer } from "./pointer.lit";
import { name as pointerRowName, PointerRow } from "./pointer-row.lit";
import { name as resultName, Result } from "./result.lit";
import { Action } from "./cell.lit";
import { bounceInputIn, fadeInPointer, showPointer, times } from "./common-animations";
import { balanced_recursive } from "./algos/balanced_recursive";

console.log("register %O", name);
console.log("register %O", pointerName);
console.log("register %O", pointerRowName);
console.log("register %O", resultName);

type PointerId = string;
type XIndex = number;

enum Color {
  white = "white",
  red = "red",
  orange = "orange",
  yellow = "yellow",
  pink = "pink",
  lightgreen = "lightgreen",
}

type ResultOps = {
  input: string;
  ops: Op[];
};

type Op =
  | { kind: "create"; color: Color; id: PointerId; left: XIndex; right: XIndex }
  | { kind: "move"; id: PointerId; left: XIndex; right: XIndex }
  | { kind: "match"; left: PointerId; right: PointerId }
  | { kind: "none-match"; left: PointerId; right: PointerId }
  | { kind: "remove"; id: PointerId }
  | { kind: "remove-many"; ids: PointerId[] }
  | { kind: "result"; result: boolean };

const results: Record<string, ResultOps> = {
  "3()[]": {
    input: "3()[]",
    ops: [
      { kind: "create", id: "a", left: 0, right: 0, color: Color.white },
      { kind: "move", id: "a", left: 1, right: 1 },
      { kind: "create", id: "b", left: 2, right: 2, color: Color.pink },
      { kind: "match", left: "a", right: "b" },
      { kind: "remove", id: "b" },
      { kind: "move", id: "a", left: 3, right: 3 },
      { kind: "create", id: "c", left: 4, right: 4, color: Color.yellow },
      { kind: "match", left: "a", right: "c" },
      { kind: "remove", id: "c" },
      { kind: "remove", id: "a" },
    ],
  },
  "3(000)[]": {
    input: "3(000)[]",
    ops: [
      { kind: "create", id: "a", left: 0, right: 0, color: Color.white },
      { kind: "move", id: "a", left: 1, right: 1 },
      { kind: "create", id: "b", left: 2, right: 2, color: Color.pink },
      { kind: "move", id: "b", left: 3, right: 3 },
      { kind: "move", id: "b", left: 4, right: 4 },
      { kind: "move", id: "b", left: 5, right: 5 },
      { kind: "match", left: "a", right: "b" },
      { kind: "remove", id: "b" },
      { kind: "move", id: "a", left: 6, right: 6 },
      { kind: "create", id: "c", left: 7, right: 7, color: Color.orange },
      { kind: "match", left: "a", right: "c" },
      { kind: "remove-many", ids: ["a", "c"] },
      { kind: "result", result: true },
    ],
  },
  "(1+2)": {
    input: "(1+2)",
    ops: [
      { kind: "create", id: "a", left: 0, right: 0, color: Color.white },
      { kind: "create", id: "b", left: 0, right: 0, color: Color.orange },
      { kind: "move", id: "b", left: 1, right: 1 },
      { kind: "move", id: "b", left: 2, right: 2 },
      { kind: "move", id: "b", left: 3, right: 3 },
      { kind: "move", id: "b", left: 4, right: 4 },
      { kind: "match", left: "a", right: "b" },
      { kind: "remove-many", ids: ["a", "b"] },
      { kind: "result", result: true },
    ],
  },
  "12(1+2": {
    input: "12(1+2",
    ops: [
      { kind: "create", id: "a", left: 0, right: 0, color: Color.white },
      { kind: "move", id: "a", left: 1, right: 1 },
      { kind: "move", id: "a", left: 2, right: 2 },
      { kind: "create", id: "b", left: 3, right: 3, color: Color.pink },
      { kind: "move", id: "b", left: 4, right: 4 },
      { kind: "move", id: "b", left: 5, right: 5 },
      { kind: "none-match", left: "a", right: "b" },
      { kind: "remove-many", ids: ["a", "b"] },
      { kind: "result", result: false },
    ],
  },
  "~([{}])~": {
    input: "~([{}])~",
    ops: [
      { kind: "create", id: "a", left: 0, right: 0, color: Color.white },
      { kind: "move", id: "a", left: 1, right: 1 },
      { kind: "create", id: "b", left: 2, right: 2, color: Color.pink },
      { kind: "create", id: "c", left: 3, right: 3, color: Color.orange },
      { kind: "create", id: "d", left: 4, right: 4, color: Color.lightgreen },
      { kind: "match", left: "c", right: "d" },
      { kind: "remove", id: "d" },
      { kind: "move", id: "c", left: 5, right: 5 },
      { kind: "match", left: "b", right: "c" },
      { kind: "remove", id: "c" },
      { kind: "move", id: "b", left: 6, right: 6 },
      { kind: "match", left: "a", right: "b" },
      { kind: "remove", id: "b" },
      { kind: "move", id: "a", left: 7, right: 7 },
      { kind: "remove", id: "a" },
      { kind: "result", result: true },
    ],
  },
  "([{123}])": {
    input: "([{123}])",
    ops: [
      { kind: "create", id: "a", left: 0, right: 0, color: Color.white },
      { kind: "create", id: "b", left: 1, right: 1, color: Color.pink },
      { kind: "create", id: "c", left: 2, right: 2, color: Color.orange },
      { kind: "create", id: "d", left: 3, right: 3, color: Color.lightgreen },
      { kind: "move", id: "d", left: 4, right: 4 },
      { kind: "move", id: "d", left: 5, right: 5 },
      { kind: "move", id: "d", left: 6, right: 6 },
      { kind: "match", left: "c", right: "d" },
      { kind: "remove", id: "d" },
      { kind: "move", id: "c", left: 7, right: 7 },
      { kind: "match", left: "b", right: "c" },
      { kind: "remove", id: "c" },
      { kind: "move", id: "b", left: 8, right: 8 },
      { kind: "match", left: "a", right: "b" },
      { kind: "remove-many", ids: ["a", "b"] },
      { kind: "result", result: true },
    ],
  },
};

function process(op: Op, params: BalancedStack) {
  const { main } = params.timelines;
  switch (op.kind) {
    case "create": {
      const { left, right } = params.pointers(op.id);
      main.set(left, { translateX: op.left * 40, duration: 0 });
      main.set(right, { translateX: op.right * 40, duration: 0 });
      fadeInPointer(main, left, op.color);
      showPointer(main, right, op.color);
      break;
    }
    case "move": {
      const { left, right } = params.pointers(op.id);
      if (op.left === op.right) {
        main.to([left, right], { translateX: op.left * 40 });
      } else {
        main.to(left, { translateX: op.left * 40 });
        main.to(right, { translateX: op.right * 40 });
      }
      break;
    }
    case "match": {
      const { left, right } = params.pointers(op.left);
      const { left: rleft, right: rright } = params.pointers(op.right);
      main.to([left, right, rleft, rright], { scale: 1.5 });
      main.to([left, right, rleft, rright], { scale: 1 });
      break;
    }
    case "none-match": {
      const { left, right } = params.pointers(op.left);
      const { left: rleft, right: rright } = params.pointers(op.right);
      main.to([left, right, rleft, rright], { scale: 1.5, color: Color.red });
      main.to([left, right, rleft, rright], { scale: 1 });
      break;
    }
    case "remove": {
      const { left, right } = params.pointers(op.id);
      main.to([left, right], { opacity: 0, visibility: "visible" });
      break;
    }
    case "remove-many": {
      const elems: any[] = [];
      op.ids.forEach((id) => {
        const { left, right } = params.pointers(id);
        elems.push(left);
        elems.push(right!);
      });
      main.to(elems, { opacity: 0, visibility: "visible" });
      break;
    }
    case "result": {
      main.to(params.elems.RESULT, { opacity: 1, visibility: "visible" });
      break;
    }
    default:
      throw new Error(`didn't expect to get here ${JSON.stringify(op)}`);
  }
}

export function init(input: string) {
  const res = results[input];
  if (!res) throw new Error("input not found");
  const algoAction = document.getElementById("algo-action") as Action;
  const algoRow = document.querySelector("algo-pointer-row") as PointerRow;
  const algoInput = document.querySelector("algo-stack") as Stack;
  const algoResult = document.querySelector("algo-result") as Result;
  const master = gsap.timeline();

  const res1 = balanced_recursive(input);

  algoResult.prefix = "Balanced";
  algoResult.result = res1;
  algoInput.stack = input.split("");

  res.ops.forEach((op) => {
    switch (op.kind) {
      case "create": {
        algoRow.addRow({ id: `${op.id}-left` });
        algoRow.addRow({ id: `${op.id}-right` });
      }
    }
  });

  setTimeout(() => {
    const params: BalancedStack = {
      elems: {
        INPUT: algoInput,
        ACTION: algoAction,
        POINTER_ROW: algoRow,
        RESULT: algoResult,
      },
      pointers: (id) => {
        return {
          left: algoRow.byId(`${id}-left`)!,
          right: algoRow.byId(`${id}-right`)!,
        };
      },
      timelines: { main: gsap.timeline({ defaults: { duration: times.DURATION * 2 } }) },
    };
    master.add(timeline(res.ops, params));
  }, 0);
}

interface BalancedStack {
  elems: {
    INPUT: Stack;
    ACTION: Action;
    POINTER_ROW: PointerRow;
    RESULT: Result;
  };
  pointers: (id: string) => { left: Pointer; right: Pointer };
  timelines: {
    main: gsap.core.Timeline;
  };
}

function timeline(ops: Op[], params: BalancedStack) {
  const { main } = params.timelines;
  // console.log(ops);
  bounceInputIn(main, params.elems.INPUT.cells());
  ops.forEach((op) => {
    process(op, params);
  });
  // pointer(res, params);
  return main;
}

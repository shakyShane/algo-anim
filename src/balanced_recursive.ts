import { gsap } from "gsap";
import "./algo-stack.lit";
import Stack from "./algo-stack.lit";
import { name } from "./controls.lit";
import { name as pointerName } from "./pointer.lit";
import { name as pointerRowName, PointerRow } from "./pointer-row.lit";
import { Action } from "./cell.lit";
import { bounceInputIn, fadeInPointer, showPointer } from "./common-animations";
import { balanced_recursive } from "./algos/balanced_recursive";

console.log("register %O", name);
console.log("register %O", pointerName);
console.log("register %O", pointerRowName);

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

type Result = {
  input: string;
  ops: Op[];
};

// prettier-ignore
type Op =
  | { kind: 'create', color: Color, id: PointerId, left: XIndex, right: XIndex }
  | { kind: 'move', id: PointerId, left: XIndex, right: XIndex }
  | { kind: 'match', left: PointerId, right: PointerId }
  | { kind: 'remove', id: PointerId }

const results: Record<string, Result> = {
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
  "(1+2)": {
    input: "(1+2)",
    ops: [
      { kind: "create", id: "a", left: 0, right: 0, color: Color.white },
      { kind: "move", id: "a", left: 0, right: 1 },
      { kind: "move", id: "a", left: 0, right: 2 },
      { kind: "move", id: "a", left: 0, right: 3 },
      { kind: "move", id: "a", left: 0, right: 4 },
      { kind: "match", left: "a", right: "a" },
      { kind: "remove", id: "a" },
    ],
  },
};

function process(op: Op, params: BalancedStack) {
  const { main } = params.timelines;
  console.log(op);
  switch (op.kind) {
    case "create": {
      main
        .call(() => {
          params.elems.POINTER_ROW.addRow({ id: `${op.id}-left` });
          params.elems.POINTER_ROW.addRow({ id: `${op.id}-right` });
        })
        .call(
          () => {
            let new_pointer_left = params.elems.POINTER_ROW.byId(`${op.id}-left`)!;
            let new_pointer_right = params.elems.POINTER_ROW.byId(`${op.id}-right`)!;
            main.set(new_pointer_left, { translateX: op.left * 40, duration: 0 });
            main.set(new_pointer_right, { translateX: op.right * 40, duration: 0 });
            fadeInPointer(main, new_pointer_left, op.color);
            showPointer(main, new_pointer_right, op.color);
            // showPointer(main, new_pointer_right, op.color);
          },
          [],
          "+=0.1"
        );
      break;
    }
    case "move": {
      main.call(
        () => {
          const l = params.elems.POINTER_ROW.byId(`${op.id}-left`)!;
          const r = params.elems.POINTER_ROW.byId(`${op.id}-right`)!;
          if (op.left === op.right) {
            main.to([l, r], { translateX: op.left * 40 });
          } else {
            main.to(l, { translateX: op.left * 40 });
            main.to(r, { translateX: op.right * 40 });
          }
          // console.log(op.right * 40, r);
        },
        [],
        "+=0.1"
      );
      break;
    }
    case "match": {
      main.call(
        () => {
          const ll = params.elems.POINTER_ROW.byId(`${op.left}-left`)!;
          const lr = params.elems.POINTER_ROW.byId(`${op.left}-right`)!;
          const rl = params.elems.POINTER_ROW.byId(`${op.right}-left`)!;
          const rr = params.elems.POINTER_ROW.byId(`${op.right}-right`)!;
          main.to([ll, lr, rl, rr], { scale: 1.5 });
          main.to([ll, lr, rl, rr], { scale: 1 });
        },
        [],
        "+=0.1"
      );
      break;
    }
    case "remove": {
      main.call(
        () => {
          const l = params.elems.POINTER_ROW.byId(`${op.id}-left`)!;
          const r = params.elems.POINTER_ROW.byId(`${op.id}-right`)!;
          main.to([l, r], { opacity: 0, visibility: "visible" });
        },
        [],
        "+=0.1"
      );
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
  const master = gsap.timeline();

  // const res = balanced_recursive(input);

  algoInput.stack = input.split("");

  setTimeout(() => {
    const params: BalancedStack = {
      elems: {
        INPUT: algoInput,
        ACTION: algoAction,
        POINTER_ROW: algoRow,
      },
      timelines: { main: gsap.timeline() },
    };
    master.add(timeline(res.ops, params));
  }, 0);
}

interface BalancedStack {
  elems: {
    INPUT: Stack;
    ACTION: Action;
    POINTER_ROW: PointerRow;
  };
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

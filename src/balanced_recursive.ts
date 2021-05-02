import { gsap } from "gsap";
import "./algo-stack.lit";
import Stack from "./algo-stack.lit";
import { name } from "./controls.lit";
import { name as pointerName } from "./pointer.lit";
import { Action } from "./cell.lit";
import { balanced_stack, Res } from "./algos/balanced_stack";
import { bounceInputIn, fadeInPointer } from "./common-animations";

console.log("register %O", name);
console.log("register %O", pointerName);

const colors = {
  SELECTED: "#aed049",
  DEFAULT: "#ffffff",
};

const times = {
  DURATION: 0.3,
};

export function init(input: string) {
  const algoInput = document.getElementById("algo-input") as Stack;
  const algoAction = document.getElementById("algo-action") as Action;

  const master = gsap.timeline();

  const elems = {
    POINTER: `algo-pointer[data-index="0"]`,
    POINTER_1: `algo-pointer[data-index="1"]`,
    POINTER_2: `algo-pointer[data-index="2"]`,
    INPUT: algoInput,
    ACTION: algoAction,
  };

  const res = balanced_stack(input);

  algoInput.stack = input.split("");

  const params: BalancedStack = {
    elems,
  };

  setTimeout(() => {
    master.add(pointer(res, params));
  }, 0);
}

interface BalancedStack {
  elems: {
    INPUT: Stack;
    ACTION: Action;
    POINTER: string;
    POINTER_1: string;
    POINTER_2: string;
  };
}

function pointer(res: Res, stack: BalancedStack) {
  const values = res.values;
  const inputCells = stack.elems.INPUT.cells();
  const timeline = gsap.timeline();
  bounceInputIn(timeline, inputCells);
  fadeInPointer(timeline, stack.elems.POINTER, times.DURATION);
  // fadeInPointer(timeline, stack.elems.POINTER_1, times.DURATION);
  // fadeInPointer(timeline, stack.elems.POINTER_2, times.DURATION);

  values.forEach((val, index) => {
    let pointer = (() => {
      // prettier-ignore
      switch (index) {
        case 0: return stack.elems.POINTER;
        case 1: return stack.elems.POINTER;
        case 2: return stack.elems.POINTER_1;
        case 3: return stack.elems.POINTER_1;
        case 4: return stack.elems.POINTER_1;
        case 5: return stack.elems.POINTER_1;
        // case 6: return stack.elems.POINTER_1;
        default: return null;
      }
    })();
    if (index === 2) {
      timeline.set(stack.elems.POINTER_1, {
        translateX: (val.index - 1) * 40,
        opacity: 1,
        visibility: "visible",
      });
    }
    if (pointer) {
      timeline.to(pointer, {
        translateX: val.index * 40,
        duration: times.DURATION,
        delay: index > 0 ? times.DURATION : 0,
        ease: "release",
      });
    }
    timeline.to(inputCells[index], {
      color: colors.SELECTED,
      scale: 1.5,
      duration: times.DURATION,
    });
    timeline.to(inputCells[index], {
      color: colors.DEFAULT,
      scale: 1,
      duration: times.DURATION,
    });
  });

  timeline
    .call(() => {
      stack.elems.ACTION.action = `balanced: ${res.result}`;
    })
    .to(stack.elems.ACTION, {
      opacity: 1,
      translateY: 0,
      duration: times.DURATION,
    });

  return timeline;
}

// window.__pause = function () {
//   master.pause()
// }
// window.__play = function () {
//   master.play()
// }
// window.__restart = function () {
//   master.restart()
// }

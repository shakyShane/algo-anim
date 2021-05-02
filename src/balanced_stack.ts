import { gsap } from "gsap";
import "./algo-stack.lit";
import Stack from "./algo-stack.lit";
import { name } from "./controls.lit";
import { Action } from "./cell.lit";
import { balanced, Res } from "./algos";

console.log("register %O", name);

const colors = {
  SELECTED: "#aed049",
  DEFAULT: "#ffffff",
};

const times = {
  DURATION: 0.3,
};

export function init(input: string) {
  const algoInput = document.getElementById("algo-input") as Stack;
  const algoStack = document.getElementById("algo-stack") as Stack;
  const algoAction = document.getElementById("algo-action") as Action;

  const master = gsap.timeline();

  const elems = {
    POINTER: "[data-pointer]",
    INPUT: algoInput,
    STACK: algoStack,
    ACTION: algoAction,
  };

  const res = balanced(input);

  algoInput.stack = input.split("");

  const params: BalancedStack = {
    elems,
  };

  setTimeout(() => {
    master.add(pointer(res, params));
  }, 0);
}

interface BalancedStack {
  elems: { STACK: Stack; INPUT: Stack; ACTION: Action; POINTER: string };
}

function pointer(res: Res, stack: BalancedStack) {
  const values = res.values;
  const stackTimeline = gsap.timeline();
  const inputCells = stack.elems.INPUT.cells();
  const timeline = gsap.timeline();
  timeline
    .set(inputCells, { visibility: "visible" })
    .fromTo(
      inputCells,
      { opacity: 0, translateY: 10 },
      {
        duration: 1,
        opacity: 1,
        translateY: 0,
        stagger: 0.1,
        ease: "elastic(1, 0.3)",
      }
    )
    .set(stack.elems.POINTER, { opacity: 1, visibility: "visible" })
    .fromTo(
      stack.elems.POINTER,
      { scale: 0, duration: times.DURATION },
      { scale: 1, duration: times.DURATION }
    );

  values.forEach((val, index) => {
    const op = val.ops[0];
    timeline
      .to(stack.elems.POINTER, {
        translateX: val.index * 40,
        duration: times.DURATION,
        delay: index > 0 ? times.DURATION : 0,
        ease: "release",
      })
      .to(inputCells[index], {
        color: colors.SELECTED,
        scale: 1.5,
        duration: times.DURATION,
      });

    if (op && op.name) {
      timeline
        .call(() => {
          const strings = val.ops
            .map((op) => {
              switch (op.name) {
                case "push":
                  return `push("${op.value}")`;
                case "pop":
                  return `pop()`;
                case "cmp":
                  return `${op.values.lhs} === ${op.values.rhs}`;
                default:
                  return "";
              }
            })
            .join(", ");
          stack.elems.ACTION.action = strings;
        })
        .fromTo(
          stack.elems.ACTION,
          {
            scale: 0.8,
            translateY: -20,
            opacity: 0,
            duration: times.DURATION,
          },
          {
            scale: 1,
            translateY: 0,
            opacity: 1,
            duration: times.DURATION,
          }
        )
        .addLabel("action-in")
        .to(
          stack.elems.ACTION,
          {
            scale: 0.8,
            translateY: 20,
            opacity: 0,
            duration: times.DURATION,
          },
          "+=1"
        );
    }
    timeline.to(inputCells[index], {
      color: colors.DEFAULT,
      scale: 1,
      duration: times.DURATION,
    });

    timeline
      .call(
        () => {
          if (!op) return;
          if (op.name === "push") {
            stack.elems.STACK.setStack(val.stack);
          }
          if (op.name === "pop") {
            const lastCell = stack.elems.STACK.lastCell();
            // const last = algoStack.lastCellSpan();
            if (lastCell) {
              stackTimeline
                .to(lastCell!, {
                  opacity: 0,
                  scale: 0,
                  duration: times.DURATION,
                })
                .call(() => {
                  stack.elems.STACK.setStack(val.stack);
                });
            }
          }
        },
        [],
        "action-in+=0.2"
      )
      .addLabel("after-action-in");

    timeline.call(
      () => {
        const last = stack.elems.STACK.lastCell();
        if (last && op && op.name === "push") {
          stackTimeline.fromTo(
            last!,
            { opacity: 0, scale: 0, duration: times.DURATION },
            {
              opacity: 1,
              scale: 1,
              duration: times.DURATION,
            }
          );
        }
      },
      [],
      "after-action-in-=1"
    );
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

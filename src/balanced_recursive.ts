import { gsap } from "gsap";
import "./algo-stack.lit";
import Stack from "./algo-stack.lit";
import { name } from "./controls.lit";
import { name as pointerName, Pointer } from "./pointer.lit";
import { name as pointerRowName, PointerRow } from "./pointer-row.lit";
import { Action } from "./cell.lit";
import { bounceInputIn, fadeInPointer, colors, times } from "./common-animations";
import { balanced_recursive, Result } from "./algos/balanced_recursive";
import Timeline = gsap.core.Timeline;

console.log("register %O", name);
console.log("register %O", pointerName);
console.log("register %O", pointerRowName);

export function init(input: string) {
  const algoAction = document.getElementById("algo-action") as Action;
  const algoRow = document.querySelector("algo-pointer-row") as PointerRow;
  const algoInput = document.querySelector("algo-stack") as Stack;
  const master = gsap.timeline();

  const res = balanced_recursive(input);

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
    master.add(timeline(res, params));
  }, 0);
}

interface BalancedStack {
  elems: {
    INPUT: Stack;
    ACTION: Action;
    POINTER_ROW: PointerRow;
  };
  timelines: {
    main: Timeline;
  };
}

function pointer(res: Result, params: BalancedStack) {
  let { main } = params.timelines;
  res.values.forEach((val) => {
    const id = val.charIndex - 1;
    if (val.child) {
      main
        .call(() => {
          params.elems.POINTER_ROW.addRow({ id });
        })
        .call(
          () => {
            let new_pointer = params.elems.POINTER_ROW.byId(id)!;
            // console.log("main.set", id, (val.charIndex - 1) * 40);
            main.set(new_pointer, { translateX: (val.charIndex - 1) * 40, duration: 0 });
            fadeInPointer(main, new_pointer, "white");
          },
          [],
          "+=0.1"
        );
      pointer(val.child, params);
    }
  });
}

function timeline(res: Result, params: BalancedStack, index = 0, cellOffset: number | null | undefined = 0) {
  const { main } = params.timelines;
  bounceInputIn(main, params.elems.INPUT.cells());
  pointer(res, params);
  return main;

  // let depth = 0;
  //
  // function pointer() {}
  //
  // pointer();
  //
  // console.log(res);

  // values.forEach((val, index) => {
  //   console.log(val, index);
  //   fadeInPointer(timeline, stack.elems.POINTER, times.DURATION);
  //
  //   // timeline.to(pointer, {
  //   //   translateX: index * 40,
  //   //   duration: times.DURATION,
  //   //   delay: index > 0 ? times.DURATION : 0,
  //   //   ease: "release",
  //   // });
  //   timeline.to(inputCells[index], {
  //     color: colors.SELECTED,
  //     scale: 1.5,
  //     duration: times.DURATION,
  //   });
  //   timeline.to(inputCells[index], {
  //     color: colors.DEFAULT,
  //     scale: 1,
  //     duration: times.DURATION,
  //   });
  // });

  // timeline
  //   .call(() => {
  //     stack.elems.ACTION.action = `balanced: ${res.result}`;
  //   })
  //   .to(stack.elems.ACTION, {
  //     opacity: 1,
  //     translateY: 0,
  //     duration: times.DURATION,
  //   });
  // return timeline;
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

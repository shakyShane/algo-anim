import './style.css'
import {gsap} from "gsap"
import "./algo-stack.lit";
import Stack from "./algo-stack.lit";
import {Controls, name} from "./controls.lit";
import {Action} from "./cell.lit";

console.log('register %O', name);

const algoInput = document.getElementById('algo-input') as Stack;
const algoStack = document.getElementById('algo-stack') as Stack;
const algoAction = document.getElementById('algo-action') as Action;
const indexI = document.querySelector('[data-var-i]');
const elems = {
  POINTER: '[data-pointer]'
}
const colors = {
  SELECTED: '#aed049',
  DEFAULT: '#ffffff'
}

const master = gsap.timeline();
const stackTimeline = gsap.timeline();
const DURATION = 0.3;

type Op = { name: "push" | "pop", value?: string }
type Val = { index: number, ops: Op[], stack: string[] }
const values: Val[] = [
  {index: 0, stack: [')'], ops: [{name: 'push', value: ')'}]},
  {index: 1, stack: [')', ')'], ops: [{name: 'push', value: ')'}]},
  {index: 2, stack: [')'], ops: [{name: 'pop'}]},
  {index: 3, stack: [], ops: [{name: 'pop'}]},
];
const input = "(())";

function pointer(inputs: Val[]) {
  const cells = algoInput.cells();
  const timeline = gsap.timeline();
  timeline
    .set(cells, {visibility: 'visible'})
    .fromTo(
      cells,
      {opacity: 0, translateY: 10},
      {duration: 1, opacity: 1, translateY: 0, stagger: 0.1, ease: 'elastic(1, 0.3)'}
    )
    .set(elems.POINTER, {opacity: 1, visibility: 'visible'})
    .fromTo(elems.POINTER, {scale: 0, duration: DURATION}, {scale: 1, duration: DURATION})

  inputs.forEach((val, index) => {
    const op = val.ops[0] as Op;
    timeline
      .to(elems.POINTER, {
          translateX: val.index * 40,
          duration: DURATION,
          delay: index > 0 ? DURATION : 0,
          ease: 'release',
        },
      )
      .to(cells[index], {color: colors.SELECTED, scale: 1.5, duration: DURATION})
      .call(() => {
        const op = val.ops[0];
        if (!op) return;
        if (!algoAction) return;
        switch (op.name) {
          case "push": {
            algoAction.action = `stack.push("${op.value}")`
            break;
          }
          case "pop": {
            algoAction.action = `stack.pop()`
            break;
          }
        }
      })
      .fromTo(algoAction, {
        scale: 0.8,
        translateY: -20,
        opacity: 0,
        duration: DURATION
      }, {
        scale: 1,
        translateY: 0,
        opacity: 1,
        duration: DURATION,
      })
      .addLabel("action-in")
      .to(algoAction, {
        scale: 0.8,
        translateY: 20,
        opacity: 0,
        duration: DURATION
      }, "+=1")
      .to(cells[index], {color: colors.DEFAULT, scale: 1, duration: DURATION})

    timeline
      .call(() => {
        const stack = val.stack;
        if (op.name === "push") {
          algoStack.setStack(stack);
        }
        if (op.name === "pop") {
          const lastCell = algoStack.lastCell();
          // const last = algoStack.lastCellSpan();
          stackTimeline
            .to(lastCell!, {opacity: 0, scale: 0, duration: DURATION})
            .call(() => {
              algoStack.setStack(stack);
            })
        }
      }, [], "action-in+=0.2")
      .addLabel('after-action-in')

    timeline
      .call(() => {
        const last = algoStack.lastCell();
        if (last && op.name === "push") {
          stackTimeline.fromTo(last!, {opacity: 0, scale: 0, duration: DURATION}, {opacity: 1, scale: 1, duration: DURATION});
        }
      }, [], "after-action-in-=1")
  })

  return timeline;
}

function updateI(num: number | string) {
  if (indexI) {
    indexI.textContent = `i = ${String(num)}`
  }
}

algoInput.stack = input.split('');
setTimeout(() => {
  master
    .add(pointer(values))
}, 0);


window.__pause = function () {
  master.pause()
}
window.__play = function () {
  master.play()
}
window.__restart = function () {
  master.restart()
  // clearStack();
  updateI(0)
}
import './style.css'
import {gsap} from "gsap"
import "./algo-stack.lit";
import Stack from "./algo-stack.lit";
import {Controls, name} from "./controls.lit";
import {Action} from "./cell.lit";
import {balanced, Val} from "./algos";

console.log('register %O', name);

const algoInput = document.getElementById('algo-input') as Stack;
const algoStack = document.getElementById('algo-stack') as Stack;
const algoAction = document.getElementById('algo-action') as Action;

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

const input = "()[]{}";
const res = balanced(input);
res.values.forEach(v => console.log(v));

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
    const op = val.ops[0];
    timeline
      .to(elems.POINTER, {
          translateX: val.index * 40,
          duration: DURATION,
          delay: index > 0 ? DURATION : 0,
          ease: 'release',
        },
      )
      .to(cells[index], {color: colors.SELECTED, scale: 1.5, duration: DURATION});

      if (op && op.name) {

        timeline.call(() => {
          const strings = val.ops.map(op => {
            switch (op.name) {
              case "push": return `stack.push("${op.value}")`
              case "pop": return `stack.pop()`
              case "cmp": return `${op.values.lhs} === ${op.values.rhs}`
            }
          }).join(', ');
          algoAction.action = strings;
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
      }
    timeline.to(cells[index], {color: colors.DEFAULT, scale: 1, duration: DURATION})

    timeline
      .call(() => {
        const stack = val.stack;
        if (!op) return;
        if (op.name === "push") {
          algoStack.setStack(stack);
        }
        if (op.name === "pop") {
          const lastCell = algoStack.lastCell();
          // const last = algoStack.lastCellSpan();
          if (lastCell) {
            stackTimeline
              .to(lastCell!, {opacity: 0, scale: 0, duration: DURATION})
              .call(() => {
                algoStack.setStack(stack);
              })
          }
        }
      }, [], "action-in+=0.2")
      .addLabel('after-action-in')

    timeline
      .call(() => {
        const last = algoStack.lastCell();
        if (last && op && op.name === "push") {
          stackTimeline.fromTo(last!, {opacity: 0, scale: 0, duration: DURATION}, {opacity: 1, scale: 1, duration: DURATION});
        }
      }, [], "after-action-in-=1")
  })

  timeline.call(() => {
    algoAction.action = `result: ${res.result}`
  })
    .to(algoAction, {opacity: 1, translateY: 0, duration: DURATION})

  return timeline;
}

algoInput.stack = input.split('');

setTimeout(() => {
  master
    .add(pointer(res.values))
}, 0);
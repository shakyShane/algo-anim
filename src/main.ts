import './style.css'
import {gsap} from "gsap"
import "./algo-stack.lit";
import Stack from "./algo-stack.lit";
import {Controls, name} from "./controls.lit";
import {Action} from "./cell.lit";
console.log('register %O', name);

const algoStack = document.getElementById('algo-stack') as Stack;
const algoAction = document.getElementById('algo-action') as Action;
const stackRHSELem = document.querySelector('[data-stack-rhs]')!;
const stackElem = document.querySelector('.inline-array')!;
// if (!stackElem) throw new Error('missing container')
// if (!stackRHSELem) throw new Error('missing stack container')
const indexI = document.querySelector('[data-var-i]');
const elems = {
  POINTER: '[data-pointer]'
}
const colors = {
  SELECTED: '#aed049',
  DEFAULT: '#ffffff'
}

const master = gsap.timeline();
const stack = gsap.timeline();
const DURATION = 0.3;
const SCALE_IN = 0.8;

type Op = { name: "push" | "pop", value?: string }
type Val = { index: number, ops: Op[], stack: string[] }
const values: Val[] = [
  {index: 0, stack: [')'], ops: [{name: 'push', value: ')'}]},
  {index: 1, stack: [')', ')'], ops: [{name: 'push', value: ')'}]},
  {index: 2, stack: [')'], ops: [{name: 'pop'}]},
  {index: 3, stack: [], ops: [{name: 'pop'}]},
];

function pointer(inputs: Val[]) {
  const timeline = gsap.timeline();
  timeline
    .set('[data-cell]', {visibility: 'visible'})
    .fromTo(
      '[data-cell]',
      {opacity: 0, translateY: 10},
      {duration: 1, opacity: 1, translateY: 0, stagger: 0.1, ease: 'elastic(1, 0.3)'}
    )
    .set(elems.POINTER, {opacity: 1, visibility: 'visible'})
    .fromTo(elems.POINTER, {scale: 0, duration: DURATION}, {scale: 1, duration: DURATION})

  inputs.forEach((val, index) => {
    timeline
      .to(elems.POINTER, {
          translateX: val.index * 40,
          duration: DURATION,
          delay: index > 0 ? DURATION : 0,
          ease: 'release',
        },
      )
      .to(`[data-cell]:nth-child(${index + 1})`, {color: colors.SELECTED, scale: 1.5, duration: DURATION})
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
      .to(algoAction, {
        scale: 0.8,
        translateY: 20,
        opacity: 0,
        duration: DURATION
      }, "+=1")
      .to(`[data-cell]:nth-child(${index + 1})`, {color: colors.DEFAULT, scale: 1, duration: DURATION})
      .call(() => {
        const stack = val.stack;
        if (algoStack) {
          algoStack.setStack(stack);
        }
      }, [], "-=1")


      // .call(() => {
      //   algoStack.setStack(val.stack);
      // })

    // const op = val.ops[0];
    // const len = val.stack.length;
    // const nextX = val.stack.length === 0
    //   ? 30
    //   : len * 38;
    // console.log(nextX);
    // if (op.name === "push") {
    //   timeline.to(stackRHSELem, {
    //     translateX: nextX,
    //     duration: DURATION
    //   })
    //   timeline.call(updateStack(val));
    //   timeline.to('.pointer', {duration: DURATION}) // todo: how to prevent this pause?
    // }
    // if (op.name === "pop") {
    //   timeline.call(popStack(val));
    //   timeline.to('.pointer', {duration: DURATION}) // todo: how to prevent this pause?
    //   timeline.to(stackRHSELem, {
    //     translateX: nextX,
    //     duration: DURATION
    //   })
    // }
  })

  return timeline;
}

function updateI(num: number | string) {
  if (indexI) {
    indexI.textContent = `i = ${String(num)}`
  }
}

master
  .add(pointer(values))

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
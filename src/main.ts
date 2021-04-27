import './style.css'
import {gsap} from "gsap"

const stackRHSELem = document.querySelector('[data-stack-rhs]')!;
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

type Op = { name: string, value?: string }
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
    .fromTo(elems.POINTER, {scale: 0, duration: DURATION}, {scale:1, duration: DURATION})
  inputs.forEach((val, index) => {
    timeline
      .to(elems.POINTER, {
          translateX: val.index * 40,
          duration: DURATION,
          delay: index > 0 ? DURATION : 0,
          ease: 'release',
          onStart: updateIndex(val),
        },
      )
      .to(`[data-cell]:nth-child(${index+1})`, {color: colors.SELECTED, scale: 1.5, duration: DURATION*1.5})
      .to(`[data-cell]:nth-child(${index+1})`, {color: colors.DEFAULT, scale: 1, duration: DURATION*1.5})

    const op = val.ops[0];
    const len = val.stack.length;
    const nextX = val.stack.length === 0
      ? 30
      : len * 38;
    console.log(nextX);
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

  function updateStack(val: Val) {
    return () => {
      val.ops.forEach(op => {
        if (op.name === "push") {
          if (op.value) {
            const elem = appendStack(val, op);
            stack.fromTo(elem, {scale: SCALE_IN, duration: DURATION}, {
              scale: 1, onComplete: () => {
                console.log('fade-in, done');
              }
            })
          }
        }
      })
    }
  }

  return timeline;
}


function updateIndex(val: Val) {
  return function () {
    updateI(val.index);
  }
}

const stackElem = document.querySelector('.inline-array')!;
if (!stackElem) throw new Error('missing container')
if (!stackRHSELem) throw new Error('missing stack container')
const indexI = document.querySelector('[data-var-i]');

function appendStack(val: Val, op: Op) {
  const elem = document.createElement('span');
  elem.textContent = op.value || "n/a";
  elem.id = `input-${val.index}`;
  elem.classList.add('cell')
  elem.classList.add('cell-3d')
  elem.classList.add('char')
  stackElem!.appendChild(elem)
  return elem;
}

function popStack(val: Val) {
  return () => {
    val.ops.forEach((op) => {
      if (op.name === "pop") {
        const last = stackElem.lastElementChild;
        if (last) {
          stack.to(last, {scale: SCALE_IN, duration: DURATION, onComplete: () => {
            stackElem.removeChild(last);
          }})
        }
      }
    })
  }
}

function clearStack() {
  stackElem!.innerHTML = ''
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
  clearStack();
  updateI(0)
}
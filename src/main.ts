import './style.css'
import {gsap} from "gsap"

const stackRHSELem = document.querySelector('[data-stack-rhs]')!;

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
      {opacity: 0, translateY: -10},
      {duration: 1, opacity: 1, translateY: 0, stagger: 0.1, ease: 'elastic(1, 0.3)'}
    )
    .to('.pointer', {opacity: 1, visibility: 'visible', duration: DURATION})
    .addLabel('pointer-shown')
  inputs.forEach((val, index) => {
    timeline
      .to('.pointer', {
          translateX: val.index * 40 + val.index * 4,
          duration: DURATION,
          delay: index > 0 ? DURATION : 0,
          ease: 'release',
          onStart: updateIndex(val),
        },
      )
      .call(popStack(val))
      .addLabel(`index-${val.index}`)
    val.ops.forEach((op) => {
      timeline.to(stackRHSELem, {
        translateX: val.stack.length > 0 ? val.stack.length * 40 + val.stack.length * 4 + 35 : 0,
        delay: op.name === "pop" ? DURATION : 0,
        duration: DURATION,
        onComplete: () => {
          updateStack(val)
        }
      })
    })
  })
  return timeline;
}

function updateStack(val: Val) {
  val.ops.forEach(op => {
    if (op.name === "push") {
      if (op.value) {
        const elem = appendStack(op.value)
        stack.fromTo(elem, {scale: SCALE_IN}, {scale: 1})
      }
    }
  })
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

function appendStack(val: string) {
  const elem = document.createElement('span');
  elem.textContent = val;
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
// timeline.to('.marker', {translateY: 100}, 'index-2')


// function tick() {
//   ticked+
// }
// .to('.arrow', {
//   keyframes: [
//     { translateX: 10, ease: 'al' },
//     { translateX: -10,ease: Sine.easeInOut },
//   ]
// })
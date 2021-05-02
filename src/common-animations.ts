import Timeline = gsap.core.Timeline;
import TweenTarget = gsap.TweenTarget;

export function bounceInputIn<T extends HTMLElement>(timeline, cells: T[]) {
  timeline.set(cells, { visibility: "visible" }).fromTo(
    cells,
    { opacity: 0, translateY: 10 },
    {
      duration: 1,
      opacity: 1,
      translateY: 0,
      stagger: 0.1,
      ease: "elastic(1, 0.3)",
    }
  );
}

export function fadeInPointer(
  timeline: Timeline,
  elem: TweenTarget,
  duration: number
) {
  timeline.fromTo(
    elem,
    { visibility: "hidden", opacity: 0, scale: 0, duration },
    { visibility: "visible", opacity: 1, scale: 1, duration }
  );
}

// export function advancePointer(timeline: Timeline, target: TweenTarget, index: number, step: number) {
//   timeline.to(stack.elems.POINTER_1, {
//     translateX: (step + 1) * 40,
//     duration: times.DURATION,
//     delay: index > 0 ? times.DURATION : 0,
//     ease: "release",
//   });
// }

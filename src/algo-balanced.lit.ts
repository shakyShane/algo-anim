import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { css, html, LitElement } from "lit";
import invariant from "tiny-invariant";
import Stack from "./algo-stack.lit";
import { Result } from "./algo-result.lit";
import { init } from "./balanced_recursive";
import { PointerRow } from "./algo-pointer-row.lit";
import { gsap } from "gsap";
import { times } from "./common-animations";

@customElement("algo-balanced-recursive")
export class BalancedRecursive extends LitElement {
  static styles = css`
    :host {
    }
    .row {
      display: flex;
      align-items: center;
      position: relative;
    }
    .gap {
      margin-top: 20px;
    }
    .preview {
      line-height: 40px;
      font-size: 0.8em;
      font-family: monospace;
    }
    .row-height {
      display: block;
      height: 40px;
      position: relative;
    }
    .prefix {
      line-height: 40px;
      font-size: 0.8em;
      font-family: monospace;
    }
    algo-result {
      opacity: 0;
      visibility: hidden;
    }
  `;

  pointerRowRef = createRef<PointerRow>();
  inputRef = createRef<Stack>();
  resultRef = createRef<Result>();

  @property({ type: String })
  input: string = "";

  @state()
  timeline = gsap.timeline({ defaults: { duration: times.DURATION * 2 } });

  firstUpdated() {
    invariant(this.pointerRowRef.value, "this.pointerRowRef.value");
    invariant(this.inputRef.value, "this.inputRef.value");
    invariant(this.resultRef.value, "this.resultRef.value");
    init(
      this.input,
      {
        INPUT: this.inputRef.value,
        POINTER_ROW: this.pointerRowRef.value,
        RESULT: this.resultRef.value,
      },
      this.timeline
    );
  }

  pause = () => this.timeline.pause();
  play = () => this.timeline.play();
  restart = () => this.timeline.restart();

  /**
   * Output of this component
   */
  render() {
    return html`
      <algo-controls .pause=${this.pause} .play=${this.play} .restart=${this.restart}></algo-controls>
      <div class="row">
        <div>
          <span class="prefix">Input:</span>
          <div class="row-height">
            <algo-pointer-row ${ref(this.pointerRowRef)}></algo-pointer-row>
          </div>
          <algo-stack ${ref(this.inputRef)}></algo-stack>
        </div>
      </div>
      <div class="row gap">
        <algo-result ${ref(this.resultRef)}></algo-result>
      </div>
    `;
  }
}

export const name = "BalancedRecursive";

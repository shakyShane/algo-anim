import { customElement, property } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { classMap } from "lit/directives/class-map.js";

@customElement("algo-cell")
export class Cell extends LitElement {
  static styles = css`
    .cell {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .cell-inert {
      color: #747474;
      font-size: 0.8em;
    }
  `;

  /**
   * The stack to display
   */
  @property({ type: Number })
  index: number = -1;

  /**
   * The stack to display
   */
  @property({ type: String })
  variant: "normal" | "inert" = "normal";

  render() {
    const classes = {
      cell: true,
      "cell-inert": this.variant === "inert",
    };
    return html`<span
      class=${classMap(classes)}
      data-stack-cell="${String(this.index)}"
    >
      <span class="char"><slot></slot></span>
    </span>`;
  }
}

export const name = "Cell";

@customElement("algo-action")
export class Action extends LitElement {
  static styles = css`
    :host {
      //outline: 1px solid red;
    }
    .content {
      margin: 0 0;
      padding: 20px 0;
      font-size: 1rem;
    }
  `;

  /**
   * The stack to display
   */
  @property()
  action: string | null = null;

  render() {
    return html`<div id="inner">
      <p class="content"><code>${this.action || ""}</code></p>
    </div>`;
  }
}

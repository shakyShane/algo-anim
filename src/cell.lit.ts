import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement} from "lit";


@customElement('algo-cell')
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
  `;

  /**
   * The stack to display
   */
  @property({type: Number})
  index: number = -1;

  render() {
    return html`<span class="cell" data-stack-cell="${String(this.index)}">
        <span class="char"><slot></slot></span>
    </span>`
  }
}

export const name = "Cell";


@customElement('algo-action')
export class Action extends LitElement {
  static styles = css`
    p {
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
    return html`<p><code>${this.action || ""}</code></p>`
  }
}
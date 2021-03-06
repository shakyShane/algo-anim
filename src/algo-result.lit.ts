import { customElement, property } from "lit/decorators.js";
import { css, html, LitElement } from "lit";

@customElement("algo-result")
export class Result extends LitElement {
  static styles = css`
    :host {
      --size: 40px;
    }
    .result {
      margin: 0;
      font-family: monospace;
      font-size: 1rem;
    }
  `;

  @property({ type: String })
  prefix: string = "Result";

  @property()
  result: boolean | null = null;

  /**
   * Output of this component
   */
  render() {
    return html`<p class="result">${this.prefix}: ${this.result}</p>`;
  }
}

export const name = "Result";

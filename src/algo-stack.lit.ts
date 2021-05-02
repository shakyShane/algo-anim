import { customElement, property } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { name } from "./cell.lit";

console.log("register %O", name);

@customElement("algo-stack")
export class Stack extends LitElement {
  static styles = [
    css`
      .inline-array {
        display: flex;
      }
      algo-cell {
        opacity: 0;
      }
    `,
  ];

  /**
   * The stack to display
   */
  @property()
  stack: string[] = [];

  /**
   * The stack to display
   */
  @property({ type: Boolean })
  static: boolean = false;

  /**
   * Update the underlying stack
   * @param stack
   */
  setStack(stack: string[]) {
    this.stack = stack;
  }

  /**
   * Update the underlying cells
   */
  cells(): HTMLElement[] {
    return Array.from(this.shadowRoot?.querySelectorAll("algo-cell")!);
  }

  /**
   * Update the underlying cells
   */
  lastCell(): HTMLElement | Element | undefined {
    const cells = this.cells();
    if (cells.length > 0) {
      return cells[cells.length - 1];
    }
    return undefined;
  }

  /**
   * Output of this component
   */
  render() {
    if (this.static) {
      return html` <div class="inline-array" data-elem-stack>
        <slot></slot>
      </div>`;
    }
    return html` <div class="inline-array" data-elem-stack>
      ${this.stack.map((val, index) => {
        return html`<algo-cell index=${index}>${val}</algo-cell>`;
      })}
    </div>`;
  }
}

export default Stack;

import { customElement, property, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { Pointer } from "./pointer.lit";

type Row = { id: number };

@customElement("algo-pointer-row")
export class PointerRow extends LitElement {
  static styles = css`
    .wrap {
      position: relative;
    }
    algo-pointer {
      opacity: 0;
      visibility: hidden;
      display: block;
      width: 40px;
      position: absolute;
      top: 0;
      left: 0;
    }
  `;

  @state()
  rows: Row[] = [];

  addRow(row: Row) {
    this.rows = this.rows.concat(row);
  }

  pointers(): Pointer[] {
    let elems = this.shadowRoot?.querySelectorAll<Pointer>("algo-pointer");
    if (elems) {
      return Array.from(elems);
    }
    return [];
  }

  byId(id: number): Pointer | undefined {
    const index = this.rows.findIndex((x) => x.id === id);
    if (index !== undefined) {
      const cells = this.pointers();
      if (cells.length > 0) {
        return cells[index];
      }
    }
    return undefined;
  }

  /**
   * Output of this component
   */
  render() {
    return html`<div class="wrap">
      ${this.rows.map((row, index) => html`<algo-pointer direction="up" data-index=${index}></algo-pointer>`)}
    </div> `;
  }
}

export const name = "PointerRow";

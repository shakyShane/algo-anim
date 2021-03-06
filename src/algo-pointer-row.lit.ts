import { customElement, property, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { Pointer } from "./algo-pointer.lit";

type Row = { id: string };

@customElement("algo-pointer-row")
export class PointerRow extends LitElement {
  static styles = css`
    .wrap {
      position: relative;
      height: 40px;
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

  removeRow(id: Row["id"]) {
    this.rows = this.rows.filter((x) => x.id === id);
  }

  pointers(): Pointer[] {
    let elems = this.shadowRoot?.querySelectorAll<Pointer>("algo-pointer");
    if (elems) {
      return Array.from(elems);
    }
    return [];
  }

  byId(id: string): Pointer | undefined {
    const index = this.rows.findIndex((x) => x.id === id);
    if (index !== undefined) {
      const cells = this.pointers();
      if (cells.length > 0) {
        return cells[index];
      }
    }
    return undefined;
  }

  @property({ type: String })
  direction: "up" | "down" = "down";

  /**
   * Output of this component
   */
  render() {
    return html`<div class="wrap">
      ${this.rows.map((row, index) => {
        return html`<algo-pointer direction=${this.direction} data-id=${row.id} data-index=${index}></algo-pointer>`;
      })}
    </div> `;
  }
}

export const name = "PointerRow";

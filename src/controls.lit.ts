import {customElement} from "lit/decorators.js";
import {css, html, LitElement} from "lit";

@customElement('algo-controls')
export class Controls extends LitElement {

  static styles = css`
    :host {
      display: flex;
      justify-content: center;
    }
    button {
      outline: 1px solid green;
    }
  `;

  /**
   * Output of this component
   */
  render() {
    return html`
        <div>
            <button type="submit" onClick="__play()">Play</button>
            <button type="submit" onClick="__pause()">Pause</button>
            <button type="submit" onClick="__restart()">Restart</button>
        </div>`
  }
}

export const name = "Controls";
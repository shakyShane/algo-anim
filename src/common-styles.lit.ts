import { css } from "lit";

export const layout = css`
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

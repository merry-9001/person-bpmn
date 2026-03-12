import CustomPalette from "./CustomPalette";
import CustomRenderer from "./CustomRenderer";
import CustomContextPadProvider from "./CustomContextPadProvider";
export default {
  __init__: ['paletteProvider', 'customRenderer', 'customContextPad'],
  paletteProvider: ['type', CustomPalette],
  customRenderer: ['type', CustomRenderer],
  customContextPad: ['type', CustomContextPadProvider]
}
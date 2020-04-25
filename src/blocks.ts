const blocks = {
  1: { id: 1, name: "stone-white", groups: ["bio"] },
  2: { id: 2, name: "stone-lightgray", groups: ["resource"] },
  3: { id: 3, name: "stone-darkgray", groups: ["resource", "stone"] },
  4: { id: 4, name: "stone-black", groups: ["resource", "stone"] },
  5: { id: 5, name: "stone-red", groups: ["resource"] },
  6: { id: 6, name: "stone-lightred", groups: ["resource"] },
  7: { id: 7, name: "stone-darkred", groups: ["resource"] },
  8: { id: 8, name: "stone-green", groups: ["bio"] },
  9: { id: 9, name: "stone-lightgreen", groups: ["bio"] },
  10: { id: 10, name: "stone-darkgreen", groups: ["bio"] },
  11: { id: 11, name: "water-salty", groups: ["water"] },
  12: { id: 12, name: "water-fresh", groups: ["water"] },
  13: { id: 13, name: "stone-darkblue", groups: ["resource"] },
  14: { id: 14, name: "stone-pink", groups: ["resource"] },
  15: { id: 15, name: "stone-purple", groups: ["resource"] },
  16: { id: 16, name: "stone-yellow", groups: ["resource"] },
  17: { id: 17, name: "stone-orange", groups: ["resource"] },
  18: { id: 18, name: "stone-brown", groups: ["resource"] },
  19: { id: 19, name: "stone-lightbrown", groups: ["resource"] },
  20: { id: 20, name: "stone-darkbrown", groups: ["resource", "stone"] },
  21: { id: 21, name: "glow-white", groups: ["light"] },
  22: { id: 22, name: "glow-yellow", groups: ["crystal"] },
  23: { id: 23, name: "glow-red", groups: ["crystal"] },
  24: { id: 24, name: "glow-magenta", groups: ["crystal"] },
  25: { id: 25, name: "glow-cyan", groups: ["crystal"] },
  26: { id: 26, name: "glow-green", groups: ["crystal"] },
  27: { id: 27, name: "column-white", groups: ["processed"] },
  28: { id: 28, name: "fence", groups: ["processed"] },
  29: { id: 29, name: "shelf", groups: ["processed", "furniture"] },
  30: { id: 30, name: "oven", groups: ["processed", "furniture"] },
  31: { id: 31, name: "table", groups: ["processed", "furniture"] },
  32: { id: 32, name: "chair", groups: ["processed", "furniture"] },
  33: { id: 33, name: "cupboard", groups: ["processed", "furniture"] },
}

const blocksIds = Object.keys(blocks)
const blocksValues = Object.values(blocks)

export { blocksIds, blocksValues }
export default blocks

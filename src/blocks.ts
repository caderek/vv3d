const blocks = {
  1: { id: 1, name: "stone-white", rotatable: false, groups: ["bio"] },
  2: { id: 2, name: "stone-lightgray", rotatable: false, groups: ["resource"] },
  3: {
    id: 3,
    name: "stone-darkgray",
    rotatable: false,
    groups: ["resource", "stone"],
  },
  4: {
    id: 4,
    name: "stone-black",
    rotatable: false,
    groups: ["resource", "stone"],
  },
  5: { id: 5, name: "stone-red", rotatable: false, groups: ["resource"] },
  6: { id: 6, name: "stone-lightred", rotatable: false, groups: ["resource"] },
  7: { id: 7, name: "stone-darkred", rotatable: false, groups: ["resource"] },
  8: { id: 8, name: "stone-green", rotatable: false, groups: ["bio"] },
  9: { id: 9, name: "stone-lightgreen", rotatable: false, groups: ["bio"] },
  10: { id: 10, name: "stone-darkgreen", rotatable: false, groups: ["bio"] },
  11: { id: 11, name: "water-salty", rotatable: false, groups: ["water"] },
  12: { id: 12, name: "water-fresh", rotatable: false, groups: ["water"] },
  13: {
    id: 13,
    name: "stone-darkblue",
    rotatable: false,
    groups: ["resource"],
  },
  14: { id: 14, name: "stone-pink", rotatable: false, groups: ["resource"] },
  15: { id: 15, name: "stone-purple", rotatable: false, groups: ["resource"] },
  16: { id: 16, name: "stone-yellow", rotatable: false, groups: ["resource"] },
  17: { id: 17, name: "stone-orange", rotatable: false, groups: ["resource"] },
  18: { id: 18, name: "stone-brown", rotatable: false, groups: ["resource"] },
  19: {
    id: 19,
    name: "stone-lightbrown",
    rotatable: false,
    groups: ["resource"],
  },
  20: {
    id: 20,
    name: "stone-darkbrown",
    rotatable: false,
    groups: ["resource", "stone"],
  },
  21: { id: 21, name: "glow-white", rotatable: false, groups: ["light"] },
  22: { id: 22, name: "glow-yellow", rotatable: false, groups: ["crystal"] },
  23: { id: 23, name: "glow-red", rotatable: false, groups: ["crystal"] },
  24: { id: 24, name: "glow-magenta", rotatable: false, groups: ["crystal"] },
  25: { id: 25, name: "glow-cyan", rotatable: false, groups: ["crystal"] },
  26: { id: 26, name: "glow-green", rotatable: false, groups: ["crystal"] },
  27: { id: 27, name: "column-white", rotatable: false, groups: ["processed"] },
  28: { id: 28, name: "fence", rotatable: false, groups: ["processed"] },
  29: {
    id: 29,
    name: "shelf",
    rotatable: true,
    groups: ["processed", "furniture"],
  },
  30: {
    id: 30,
    name: "oven",
    rotatable: true,
    groups: ["processed", "furniture"],
  },
  31: {
    id: 31,
    name: "table",
    rotatable: false,
    groups: ["processed", "furniture"],
  },
  32: {
    id: 32,
    name: "chair",
    rotatable: true,
    groups: ["processed", "furniture"],
  },
  33: {
    id: 33,
    name: "cupboard",
    rotatable: true,
    groups: ["processed", "furniture"],
  },
  34: {
    id: 34,
    name: "stone-white-stairs",
    rotatable: true,
    groups: ["processed"],
  },
  35: {
    id: 35,
    name: "stone-white-stairs-2",
    rotatable: true,
    groups: ["processed"],
  },
  36: {
    id: 36,
    name: "stone-white-slant",
    rotatable: true,
    groups: ["processed"],
  },
}

const blocksIds = Object.keys(blocks)
const blocksValues = Object.values(blocks)

export { blocksIds, blocksValues }
export default blocks

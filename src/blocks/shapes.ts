const shapeEntries = [
  {
    id: 1,
    name: "cube",
    rotatable: false,
  },
  {
    id: 2,
    name: "pillar",
    rotatable: false,
  },
  {
    id: 3,
    name: "pole",
    rotatable: false,
  },
  {
    id: 4,
    name: "stairs",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 5,
    name: "stairs-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 6,
    name: "stairs-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 7,
    name: "stairs-tip",
    rotatable: false,
  },
  {
    id: 8,
    name: "stairs-reverse",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 9,
    name: "stairs-reverse-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 10,
    name: "stairs-reverse-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 11,
    name: "slope",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 12,
    name: "slope-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 13,
    name: "slope-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 14,
    name: "slope-tip",
    rotatable: false,
  },
  {
    id: 15,
    name: "slope-reverse",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 16,
    name: "slope-reverse-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 17,
    name: "slope-reverse-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 18,
    name: "hill",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 19,
    name: "hill-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 20,
    name: "hill-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 21,
    name: "cylinder-quarter",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 22,
    name: "hill-reverse",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 23,
    name: "hill-reverse-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 24,
    name: "hill-reverse-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 25,
    name: "table",
    rotatable: false,
  },
  {
    id: 26,
    name: "table2",
    rotatable: false,
  },
  {
    id: 27,
    name: "chair",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 28,
    name: "fence",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 29,
    name: "fence-corner",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 30,
    name: "fence-tee",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 31,
    name: "fence-cross",
    rotatable: false,
  },
  {
    id: 32,
    name: "pipe",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 33,
    name: "pipe-vertical",
    rotatable: false,
  },
  {
    id: 34,
    name: "pipe-cross",
    rotatable: false,
  },
  {
    id: 35,
    name: "pipe-cross-vertical",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 36,
    name: "pipe-cross-multi",
    rotatable: false,
  },
  {
    id: 37,
    name: "pipe-corner",
    rotatable: true,
    rotationType: "flip",
  },
  {
    id: 38,
    name: "pipe-corner-top",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 39,
    name: "pipe-corner-bottom",
    rotatable: true,
    rotationType: "side",
  },
]

const createShapes = (scene) =>
  Object.fromEntries(
    shapeEntries.map((entry) => {
      const mesh = scene.getMeshByName(entry.name)
      if (!mesh) {
        console.log({ entry })
      }
      mesh.isVisible = false
      mesh.setParent(null)

      return [
        entry.id,
        {
          ...entry,
          mesh,
        },
      ]
    }),
  )

export { shapeEntries }
export default createShapes

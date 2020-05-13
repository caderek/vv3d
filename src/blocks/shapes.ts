const shapeEntries = [
  {
    id: 1,
    name: "cube",
    rotatable: false,
  },
  {
    id: 2,
    name: "pole",
    rotatable: false,
  },
  {
    id: 3,
    name: "stairs",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 4,
    name: "stairs-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 5,
    name: "stairs-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 6,
    name: "slope",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 7,
    name: "slope-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 8,
    name: "slope-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 9,
    name: "table",
    rotatable: false,
  },
  {
    id: 10,
    name: "chair",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 11,
    name: "pipe",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 12,
    name: "pipe-vertical",
    rotatable: false,
  },
  {
    id: 13,
    name: "pipe-cross",
    rotatable: false,
  },
  {
    id: 14,
    name: "pipe-cross-vertical",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 15,
    name: "pipe-cross-multi",
    rotatable: false,
  },
  {
    id: 16,
    name: "pipe-corner",
    rotatable: true,
    rotationType: "flip",
  },
  {
    id: 17,
    name: "pipe-corner-top",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 18,
    name: "pipe-corner-bottom",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 19,
    name: "hill",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 20,
    name: "hill-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 21,
    name: "hill-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 22,
    name: "cylinder-quarter",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 23,
    name: "stairs-reverse",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 24,
    name: "stairs-reverse-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 25,
    name: "stairs-reverse-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 26,
    name: "stairs-tip",
    rotatable: false,
  },
  {
    id: 27,
    name: "slope-tip",
    rotatable: false,
  },
  {
    id: 28,
    name: "slope-reverse",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 29,
    name: "slope-reverse-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 30,
    name: "slope-reverse-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 31,
    name: "hill-reverse",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 32,
    name: "hill-reverse-inset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 33,
    name: "hill-reverse-outset",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 34,
    name: "pillar",
    rotatable: false,
  },
  {
    id: 35,
    name: "table2",
    rotatable: false,
  },
  {
    id: 36,
    name: "fence",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 37,
    name: "fence-corner",
    rotatable: true,
    rotationType: "corner",
  },
  {
    id: 38,
    name: "fence-tee",
    rotatable: true,
    rotationType: "side",
  },
  {
    id: 39,
    name: "fence-cross",
    rotatable: false,
  },

  // {
  //   id: 11,
  //   name: "wall",
  //   rotatable: true,
  // },
  // {
  //   id: 12,
  //   name: "wall-corner",
  //   rotatable: true,
  // },
  // {
  //   id: 13,
  //   name: "wall-corner2",
  //   rotatable: true,
  // },
  // {
  //   id: 11,
  //   name: "oven",
  //   rotatable: true,
  // },
  // {
  //   id: 12,
  //   name: "shelf",
  //   rotatable: true,
  // },
  // {
  //   id: 13,
  //   name: "cupboard",
  //   rotatable: true,
  // },
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

const shapeEntries = [
  {
    id: 1,
    name: "cube",
    rotatable: false,
    penetrable: false,
  },
  {
    id: 2,
    name: "pillar",
    rotatable: false,
    penetrable: false,
    box: {
      size: [1, 0.5, 0.5],
      offset: [0, 0, 0],
    },
  },
  {
    id: 3,
    name: "pole",
    rotatable: false,
    penetrable: false,
    box: {
      size: [1, 0.25, 0.25],
      offset: [0, 0, 0],
    },
  },
  {
    id: 4,
    name: "stairs",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
  },
  {
    id: 5,
    name: "stairs-inset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 6,
    name: "stairs-outset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 7,
    name: "stairs-tip",
    rotatable: false,
    penetrable: false,
    box: {
      size: [0.667, 1, 1],
      offset: [-0.166, 0, 0],
    },
  },
  {
    id: 8,
    name: "stairs-reverse",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
  },
  {
    id: 9,
    name: "stairs-reverse-inset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 10,
    name: "stairs-reverse-outset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 11,
    name: "slope",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
  },
  {
    id: 12,
    name: "slope-inset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 13,
    name: "slope-outset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 14,
    name: "slope-tip",
    rotatable: false,
    penetrable: false,
    box: {
      size: [0.5, 1, 1],
      offset: [-0.25, 0, 0],
    },
  },
  {
    id: 15,
    name: "slope-reverse",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
  },
  {
    id: 16,
    name: "slope-reverse-inset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 17,
    name: "slope-reverse-outset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 18,
    name: "hill",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
  },
  {
    id: 19,
    name: "hill-inset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 20,
    name: "hill-outset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 21,
    name: "cylinder-quarter",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 22,
    name: "hill-reverse",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
  },
  {
    id: 23,
    name: "hill-reverse-inset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 24,
    name: "hill-reverse-outset",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
  },
  {
    id: 25,
    name: "table",
    rotatable: false,
    penetrable: false,
  },
  {
    id: 26,
    name: "table2",
    rotatable: false,
    penetrable: false,
  },
  {
    id: 27,
    name: "chair",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
  },
  {
    id: 28,
    name: "fence",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
    box: {
      size: [1, 0.25, 1],
      offset: [0, 0, 0],
    },
  },
  {
    id: 29,
    name: "fence-corner",
    rotatable: true,
    rotationType: "corner",
    penetrable: false,
    box: {
      size: [1, 0.625, 0.625],
      offset: [0, -0.1857, -0.1875],
      pivot: [0, 0.1875, 0.1875],
    },
  },
  {
    id: 30,
    name: "fence-tee",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
    box: {
      size: [1, 0.625, 1],
      offset: [0, 0.1875, 0],
      pivot: [0, -0.1875, 0],
    },
  },
  {
    id: 31,
    name: "fence-cross",
    rotatable: false,
    penetrable: false,
  },
  {
    id: 32,
    name: "pipe",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
    box: {
      size: [0.5, 1, 0.5],
      offset: [0, 0, 0],
    },
  },
  {
    id: 33,
    name: "pipe-vertical",
    rotatable: false,
    penetrable: false,
    box: {
      size: [1, 0.5, 0.5],
      offset: [0, 0, 0],
    },
  },
  {
    id: 34,
    name: "pipe-cross",
    rotatable: false,
    penetrable: false,
    box: {
      size: [0.5, 1, 1],
      offset: [0, 0, 0],
    },
  },
  {
    id: 35,
    name: "pipe-cross-vertical",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
    box: {
      size: [1, 0.5, 1],
      offset: [0, 0, 0],
    },
  },
  {
    id: 36,
    name: "pipe-cross-multi",
    rotatable: false,
    penetrable: false,
  },
  {
    id: 37,
    name: "pipe-corner",
    rotatable: true,
    rotationType: "flip",
    penetrable: false,
    box: {
      size: [0.5, 0.75, 0.75],
      offset: [0, -0.125, 0.125],
      pivot: [0, 0.125, -0.125],
    },
  },
  {
    id: 38,
    name: "pipe-corner-top",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
    box: {
      size: [0.75, 0.75, 0.5],
      offset: [-0.125, 0.125, 0],
      pivot: [0, -0.125, 0],
    },
  },
  {
    id: 39,
    name: "pipe-corner-down",
    rotatable: true,
    rotationType: "side",
    penetrable: false,
    box: {
      size: [0.75, 0.75, 0.5],
      offset: [0.125, -0.125, 0],
      pivot: [0, 0.125, 0],
    },
  },
  {
    id: 40,
    name: "grass",
    rotatable: true,
    rotationType: "side",
    penetrable: true,
    box: {
      size: [0.3, 1, 1],
      offset: [-0.35, 0, 0],
    },
  },
  {
    id: 41,
    name: "flower",
    rotatable: true,
    rotationType: "side",
    children: [
      {
        name: "flower-petals",
      },
      {
        name: "flower-carpels",
      },
    ],
    penetrable: true,
    box: {
      size: [0.4, 0.3, 0.7],
      offset: [-0.3, 0, 0],
    },
  },
  {
    id: 42,
    name: "mushrooms",
    rotatable: true,
    rotationType: "side",
    children: [
      {
        name: "mushrooms-hats",
      },
    ],
    penetrable: true,
    box: {
      size: [0.3, 0.5, 0.5],
      offset: [-0.35, 0, 0],
    },
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

const shapesByID = Object.fromEntries(
  shapeEntries.map((entry) => [entry.id, entry]),
)

const penetrableShapes = shapeEntries
  .filter((shape) => shape.penetrable)
  .map((shape) => shape.id)

export { shapeEntries, shapesByID, penetrableShapes }
export default createShapes

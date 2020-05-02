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
  },
  {
    id: 4,
    name: "stairs-inset",
    rotatable: true,
  },
  {
    id: 5,
    name: "stairs-outset",
    rotatable: true,
  },
  {
    id: 6,
    name: "slope",
    rotatable: true,
  },
  {
    id: 7,
    name: "slope-inset",
    rotatable: true,
  },
  {
    id: 8,
    name: "slope-outset",
    rotatable: true,
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
  },
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

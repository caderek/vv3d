import * as BABYLON from "babylonjs"
//@ts-ignore
import * as textures from "babylonjs-procedural-textures"

type Materials = {
  id: number | string
  name: string
  color: [number, number, number]
  colorHex?: string
  roughness: number
  metallic: number
  alpha: number
  emission: number
  light?: any
  groups: string[]
  texture?: {
    src: string
    metallicSrc?: string
    emissiveSrc?: string
    bumpSrc?: string
    alpha: boolean
  }
}[]

const materialEntries: Materials = [
  {
    id: 1,
    name: "stone-white",
    color: [0.956, 0.956, 0.956],
    colorHex: "#FAFAFA",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["stone", "building"],
  },
  {
    id: 2,
    name: "stone-light-gray",
    color: [0.402, 0.402, 0.402],
    colorHex: "#AAAAAA",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["stone", "building"],
  },
  {
    id: 3,
    name: "stone-dark-gray",
    color: [0.025, 0.025, 0.025],
    colorHex: "#2C2C2C",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["stone", "building"],
  },
  {
    id: 4,
    name: "stone-black",
    color: [0, 0, 0],
    colorHex: "#000000",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["stone", "building"],
  },
  {
    id: 5,
    name: "stone-yellow",
    color: [1, 0.509, 0.12],
    colorHex: "#FFBD1D",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["stone", "building"],
  },
  {
    id: 6,
    name: "stone-orange",
    color: [1, 0.144, 0.021],
    colorHex: "#FF6A28",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["stone", "building"],
  },
  {
    id: 7,
    name: "wood",
    color: [1, 1, 1],
    // color: [0.178, 0.041, 0.013],
    // colorHex: "#75391E",
    texture: {
      src: "textures/wood-brown.png",
      alpha: false,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["wood", "building"],
  },
  {
    id: 8,
    name: "wood-light",
    color: [1, 1, 1],
    // color: [0.497, 0.184, 0.058],
    // colorHex: "#BB7744",
    texture: {
      src: "textures/wood-light-brown.png",
      alpha: false,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["wood", "building"],
  },
  {
    id: 9,
    name: "wood-dark",
    color: [1, 1, 1],
    // color: [0.077, 0.018, 0.014],
    // colorHex: "#4E251F",
    texture: {
      src: "textures/wood-dark-brown.png",
      alpha: false,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["wood", "building"],
  },
  {
    id: 10,
    name: "stone-red",
    color: [1, 0.016, 0.019],
    colorHex: "#FF2225",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["stone", "building"],
  },
  {
    id: 11,
    name: "stone-light-red",
    color: [1, 0.141, 0.141],
    colorHex: "#FF6969",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["stone", "building"],
  },
  {
    id: 12,
    name: "stone-dark-red",
    color: [0.162, 0.005, 0.005],
    colorHex: "#700F10",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["stone", "building"],
  },
  {
    id: 13,
    name: "stone-pink",
    color: [1, 0.014, 0.474],
    colorHex: "#FF1FB7",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["stone", "building"],
  },
  {
    id: 14,
    name: "stone-purple",
    color: [0.22, 0.003, 1],
    colorHex: "#810AFF",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["stone", "building"],
  },
  // {
  //   id: 15,
  //   name: "stone-blue",
  //   color: [, , ],
  //   roughness: 0.8,
  //   metallic: 0,
  //   alpha: 1,
  //   emission: 0,
  //   light: null,
  //   groups: ["stone"],
  // },
  // {
  //   id: 16,
  //   name: "stone-dark-blue",
  //   color: [, , ],
  //   roughness: 0.8,
  //   metallic: 0,
  //   alpha: 1,
  //   emission: 0,
  //   light: null,
  //   groups: ["stone"],
  // },
  {
    id: "15a",
    name: "leafs-green",
    color: [1, 1, 1],
    texture: {
      src: "textures/leafs-green.png",
      alpha: true,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["leafs", "building"],
  },
  {
    id: "15b",
    name: "leafs-light-green",
    color: [1, 1, 1],
    texture: {
      src: "textures/leafs-light-green.png",
      alpha: true,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["leafs", "building"],
  },
  {
    id: "15c",
    name: "leafs-dark-green",
    color: [1, 1, 1],
    texture: {
      src: "textures/leafs-dark-green.png",
      alpha: true,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["leafs", "building"],
  },
  {
    id: "15d",
    name: "leafs-yellow",
    color: [1, 1, 1],
    texture: {
      src: "textures/leafs-yellow.png",
      alpha: true,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["leafs", "building"],
  },
  {
    id: "15e",
    name: "leafs-red",
    color: [1, 1, 1],
    texture: {
      src: "textures/leafs-red.png",
      alpha: true,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["leafs", "building"],
  },
  {
    id: "15f",
    name: "leafs-pink",
    color: [1, 1, 1],
    texture: {
      src: "textures/leafs-pink.png",
      alpha: true,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["leafs", "building"],
  },
  {
    id: "15g",
    name: "leafs-purple",
    color: [1, 1, 1],
    texture: {
      src: "textures/leafs-purple.png",
      alpha: true,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["leafs", "building"],
  },
  {
    id: "15h",
    name: "leafs-blue",
    color: [1, 1, 1],
    texture: {
      src: "textures/leafs-blue.png",
      alpha: true,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["leafs", "building"],
  },
  {
    id: "16a",
    name: "grass-green",
    color: [1, 1, 1],
    texture: {
      src: "textures/grass-green.png",
      alpha: false,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "grass", "building"],
  },
  {
    id: "16b",
    name: "grass-light-green",
    color: [1, 1, 1],
    texture: {
      src: "textures/grass-light-green.png",
      alpha: false,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "grass", "building"],
  },
  {
    id: "16c",
    name: "grass-dark-green",
    color: [1, 1, 1],
    texture: {
      src: "textures/grass-dark-green.png",
      alpha: false,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "grass", "building"],
  },
  {
    id: "16d",
    name: "grass-yellow",
    color: [1, 1, 1],
    texture: {
      src: "textures/grass-yellow.png",
      alpha: false,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "grass", "building"],
  },
  {
    id: "16e",
    name: "grass-red",
    color: [1, 1, 1],
    texture: {
      src: "textures/grass-red.png",
      alpha: false,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "grass", "building"],
  },
  {
    id: "16f",
    name: "grass-pink",
    color: [1, 1, 1],
    texture: {
      src: "textures/grass-pink.png",
      alpha: false,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "grass", "building"],
  },
  {
    id: "16g",
    name: "grass-purple",
    color: [1, 1, 1],
    texture: {
      src: "textures/grass-purple.png",
      alpha: false,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "grass", "building"],
  },
  {
    id: "16h",
    name: "grass-blue",
    color: [1, 1, 1],
    texture: {
      src: "textures/grass-blue.png",
      alpha: false,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "grass", "building"],
  },
  // {
  //   id: "cube",
  //   name: "cube",
  //   color: [1, 1, 1],
  //   texture: {
  //     src: "textures/cube.png",
  //     bumpSrc: "textures/cube_n.png",
  //     metallicSrc: "textures/cube_m.png",
  //     alpha: true,
  //   },
  //   roughness: 0.8,
  //   metallic: 0.7,
  //   alpha: 1,
  //   emission: 0,
  //   light: null,
  //   groups: [],
  // },
  {
    id: "21a",
    name: "water-salty",
    color: [0.018, 0.122, 1],
    colorHex: "#2462FF",
    roughness: 0,
    metallic: 0,
    alpha: 0.8,
    emission: 0,
    light: null,
    groups: ["water", "liquid"],
  },
  {
    id: "21b",
    name: "water-fresh",
    color: [0, 0.266, 1],
    colorHex: "#008DFF",
    roughness: 0,
    metallic: 0,
    alpha: 0.8,
    emission: 0,
    light: null,
    groups: ["water", "liquid"],
  },
  {
    id: "21c",
    name: "water-dirty",
    color: [0, 1, 0.548],
    colorHex: "#00FFC3",
    roughness: 0,
    metallic: 0,
    alpha: 0.8,
    emission: 0,
    light: null,
    groups: ["water", "liquid"],
  },
  {
    id: "21d",
    name: "acid",
    color: [0.292, 0.509, 0],
    colorHex: "#93BD00",
    roughness: 0,
    metallic: 0,
    alpha: 0.8,
    emission: 0.05,
    light: null,
    groups: ["acid", "liquid"],
  },
  {
    id: "21e",
    name: "lava",
    color: [1, 0.1, 0],
    colorHex: "#FF5900",
    roughness: 0,
    metallic: 0,
    alpha: 0.95,
    emission: 0.05,
    light: null,
    groups: ["lava", "liquid"],
  },
  {
    id: 23,
    name: "ice",
    color: [0.578, 0.831, 1],
    colorHex: "#C8EBFF",
    roughness: 0.2,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "building"],
  },
  {
    id: 24,
    name: "crystal-yellow",
    color: [1, 0.468, 0],
    colorHex: "#FFB600",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 1,
    light: null,
    groups: ["crystal", "building"],
  },
  {
    id: 25,
    name: "crystal-magenta",
    color: [0.799, 0, 0.178],
    colorHex: "#E70075",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 1,
    light: null,
    groups: ["crystal", "building"],
  },
  {
    id: 26,
    name: "crystal-cyan",
    color: [0, 0.266, 0.799],
    colorHex: "#008DE7",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 1,
    light: null,
    groups: ["crystal", "building"],
  },
  {
    id: 27,
    name: "crystal-red",
    color: [1, 0.011, 0],
    colorHex: "#FF1B00",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 1,
    light: null,
    groups: ["crystal", "building"],
  },
  {
    id: 28,
    name: "crystal-green",
    color: [0.266, 1, 0],
    colorHex: "#8DFF00",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 1,
    light: null,
    groups: ["crystal", "building"],
  },
  {
    id: 29,
    name: "light-white",
    color: [1, 1, 1],
    colorHex: "#FFFFFF",
    roughness: 1,
    metallic: 0,
    alpha: 0.5,
    emission: 1,
    light: {
      intensity: 10,
      color: [1, 1, 1],
    },
    groups: ["light", "building"],
  },
  {
    id: 30,
    name: "light-red",
    color: [1, 0, 0],
    colorHex: "#FF0000",
    roughness: 1,
    metallic: 0,
    alpha: 0.7,
    emission: 1,
    light: {
      intensity: 10,
      color: [1, 0, 0],
    },
    groups: ["light", "building"],
  },
  {
    id: 31,
    name: "light-magenta",
    color: [0.799, 0, 0.178],
    colorHex: "#E70075",
    roughness: 1,
    metallic: 0,
    alpha: 0.7,
    emission: 1,
    light: {
      intensity: 10,
      color: [0.799, 0, 0.178],
    },
    groups: ["light", "building"],
  },
  {
    id: 32,
    name: "light-cyan",
    color: [0, 0.266, 0.799],
    colorHex: "#008DE7",
    roughness: 1,
    metallic: 0,
    alpha: 0.7,
    emission: 1,
    light: {
      intensity: 10,
      color: [0, 0.266, 0.799],
    },
    groups: ["light", "building"],
  },
  {
    id: 33,
    name: "light-green",
    color: [0, 1, 0],
    colorHex: "#00FF00",
    roughness: 1,
    metallic: 0,
    alpha: 0.7,
    emission: 1,
    light: {
      intensity: 10,
      color: [0, 1, 0],
    },
    groups: ["light", "building"],
  },
  {
    id: 34,
    name: "light-yellow",
    color: [1, 1, 0],
    colorHex: "#FFFF00",
    roughness: 1,
    metallic: 0,
    alpha: 0.7,
    emission: 1,
    light: {
      intensity: 10,
      color: [1, 1, 0],
    },
    groups: ["light", "building"],
  },
  {
    id: 35,
    name: "light-blue",
    color: [0, 0, 1],
    colorHex: "#00FF",
    roughness: 1,
    metallic: 0,
    alpha: 0.7,
    emission: 1,
    light: {
      intensity: 10,
      color: [0, 0, 1],
    },
    groups: ["light", "building"],
  },
  {
    id: 36,
    name: "chest",
    color: [1, 1, 1],
    texture: {
      src: "textures/chest.png",
      alpha: true,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["item"],
  },
  {
    id: 37,
    name: "chest-dark",
    color: [1, 1, 1],
    texture: {
      src: "textures/chest-dark.png",
      alpha: true,
    },
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["item"],
  },
  {
    id: 38,
    name: "cutv",
    color: [1, 1, 1],
    texture: {
      src: "textures/cutv.png",
      emissiveSrc: "textures/sweetv_e.png",
      alpha: true,
    },
    roughness: 0.5,
    metallic: 0,
    alpha: 1,
    emission: 0.5,
    light: null,
    groups: ["item"],
  },
  {
    id: 39,
    name: "sweetv",
    color: [1, 1, 1],
    texture: {
      src: "textures/sweetv.png",
      emissiveSrc: "textures/sweetv_e.png",
      alpha: true,
    },
    roughness: 0.5,
    metallic: 0,
    alpha: 1,
    emission: 0.5,
    light: null,
    groups: ["item"],
  },
]

// const preview = materialEntries.map(({ id, name, colorHex }) => ({
//   id,
//   name,
//   colorHex,
// }))

// console.log(preview)

const createMaterials = (scene) =>
  Object.fromEntries(
    materialEntries.map((entry) => {
      let material = new BABYLON.PBRMaterial(entry.name, scene)
      material.alpha = entry.alpha
      material.albedoColor = new BABYLON.Color3(...entry.color)
      material.roughness = entry.roughness
      material.metallic = entry.metallic
      material.maxSimultaneousLights = 12

      if (entry.alpha !== 1) {
        material.needDepthPrePass = true
        material.alphaMode = BABYLON.Engine.ALPHA_COMBINE
      }

      if (entry.emission !== 0) {
        material.emissiveColor = new BABYLON.Color3(...entry.color)
        material.emissiveIntensity = entry.emission
      }

      if (entry.groups.includes("liquid")) {
        material.bumpTexture = new BABYLON.Texture(
          "textures/water_n.jpg",
          scene,
        )
      }

      if (entry.texture) {
        material.albedoTexture = new BABYLON.Texture(
          entry.texture.src,
          scene,
          true,
          false,
          BABYLON.Texture.NEAREST_SAMPLINGMODE,
        )

        material.albedoTexture.hasAlpha = entry.texture.alpha

        if (entry.texture.alpha) {
          material.backFaceCulling = false
        }

        if (entry.texture.bumpSrc) {
          material.bumpTexture = new BABYLON.Texture(
            entry.texture.bumpSrc,
            scene,
            true,
            false,
            BABYLON.Texture.NEAREST_SAMPLINGMODE,
          )
        }

        if (entry.texture.metallicSrc) {
          material.metallicTexture = new BABYLON.Texture(
            entry.texture.metallicSrc,
            scene,
            true,
            false,
            BABYLON.Texture.NEAREST_SAMPLINGMODE,
          )
        }

        if (entry.texture.emissiveSrc) {
          material.emissiveTexture = new BABYLON.Texture(
            entry.texture.emissiveSrc,
            scene,
            true,
            false,
            BABYLON.Texture.NEAREST_SAMPLINGMODE,
          )
        }
      }

      return [entry.id, { ...entry, material }]
    }),
  )

const materialsByID = Object.fromEntries(
  materialEntries.map((entry) => [entry.id, entry]),
)
const leafsIds = materialEntries
  .filter((material) => material.groups.includes("leafs"))
  .map((material) => material.id)

const mushroomsIds = materialEntries
  .filter((material) => material.groups.includes("mushrooms"))
  .map((material) => material.id)

export { materialEntries, materialsByID, leafsIds }

export default createMaterials

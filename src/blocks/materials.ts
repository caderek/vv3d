import * as BABYLON from "babylonjs"
//@ts-ignore
import * as textures from "babylonjs-procedural-textures"

const materialEntries = [
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
    groups: ["resource"],
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
    groups: ["resource"],
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
    groups: ["resource"],
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
    groups: ["resource"],
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
    groups: ["resource"],
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
    groups: ["resource"],
  },
  {
    id: 7,
    name: "stone-brown",
    color: [0.178, 0.041, 0.013],
    colorHex: "#75391E",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["resource"],
  },
  {
    id: 8,
    name: "stone-light-brown",
    color: [0.497, 0.184, 0.058],
    colorHex: "#BB7744",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["resource"],
  },
  {
    id: 9,
    name: "stone-dark-brown",
    color: [0.077, 0.018, 0.014],
    colorHex: "#4E251F",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["resource"],
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
    groups: ["resource"],
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
    groups: ["resource"],
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
    groups: ["resource"],
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
    groups: ["resource"],
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
    groups: ["resource"],
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
  //   groups: ["resource"],
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
  //   groups: ["resource"],
  // },
  {
    id: 17,
    name: "leafs-green",
    color: [1, 1, 1],
    // color: [0.023, 0.296, 0.025],
    texture: {
      src: "textures/leafs2.png",
      alpha: true,
    },
    colorHex: "#1f512b",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["leafs"],
  },
  {
    id: 18,
    name: "plants-green",
    color: [1, 1, 1],
    texture: {
      src: "textures/grass2.png",
      alpha: false,
    },
    colorHex: "#2A942C",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "grass"],
  },
  {
    id: 19,
    name: "plants-light-green",
    color: [1, 1, 1],
    texture: {
      src: "textures/grass.png",
      alpha: false,
    },
    colorHex: "#7FC524",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "grass"],
  },
  {
    id: 20,
    name: "plants-dark-green",
    color: [1, 1, 1],
    texture: {
      src: "textures/grass3.png",
      alpha: false,
    },
    colorHex: "#1D5A1D",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    groups: ["bio", "grass"],
  },
  {
    id: 21,
    name: "water-salty",
    color: [0.018, 0.122, 1],
    colorHex: "#2462FF",
    roughness: 0,
    metallic: 0,
    alpha: 0.9,
    emission: 0,
    light: null,
    groups: ["water"],
  },
  {
    id: 22,
    name: "water-fresh",
    color: [0, 0.266, 1],
    colorHex: "#008DFF",
    roughness: 0,
    metallic: 0,
    alpha: 0.9,
    emission: 0,
    light: null,
    groups: ["water"],
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
    groups: ["bio"],
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
    groups: ["crystal"],
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
    groups: ["crystal"],
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
    groups: ["crystal"],
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
    groups: ["crystal"],
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
    groups: ["crystal"],
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
    groups: ["light"],
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
    groups: ["light"],
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
    groups: ["light"],
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
    groups: ["light"],
  },
]

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

      if (entry.groups.includes("water")) {
        // material.bumpTexture = new BABYLON.Texture("textures/bump.jpg", scene)
      }

      if (entry.texture) {
        material.albedoTexture = new BABYLON.Texture(
          entry.texture.src,
          scene,
          true,
          true,
          BABYLON.Texture.NEAREST_SAMPLINGMODE,
        )
        material.albedoTexture.hasAlpha = entry.texture.alpha
        if (entry.texture.alpha) {
          material.backFaceCulling = false
        }
      }

      return [entry.id, { ...entry, material }]
    }),
  )

const materialsByID = Object.fromEntries(
  materialEntries.map((entry) => [entry.id, entry]),
)

export { materialEntries, materialsByID }

export default createMaterials

import * as BABYLON from "babylonjs"

const materialEntries = [
  {
    id: 1,
    name: "stone-black",
    color: "#000000",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    data: {},
  },
  {
    id: 2,
    name: "stone-red",
    color: "#FF0000",
    roughness: 0.8,
    metallic: 0,
    alpha: 1,
    emission: 0,
    light: null,
    data: {},
  },
]

const createMaterials = (scene) =>
  Object.fromEntries(
    materialEntries.map((entry) => {
      const material = new BABYLON.PBRMaterial(entry.name, scene)
      material.alpha = entry.alpha
      material.albedoColor = BABYLON.Color3.FromHexString(entry.color)
      material.roughness = entry.roughness
      material.metallic = entry.metallic
      material.maxSimultaneousLights = 12

      return [entry.id, { ...entry, material }]
    }),
  )

export default createMaterials

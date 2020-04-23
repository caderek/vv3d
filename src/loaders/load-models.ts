import * as BABYLON from "babylonjs"
import { blocksValues } from "../blocks"

const loadModels = async (scene) => {
  const modelsMeta = new WeakMap()

  for (const block of blocksValues) {
    await new Promise((resolve, reject) => {
      BABYLON.SceneLoader.Append(
        "models/",
        `${block.name}.glb`,
        scene,
        resolve,
        null,
        reject,
      )
    })
  }

  await new Promise((resolve, reject) => {
    BABYLON.SceneLoader.Append(
      "models/",
      `hero.glb`,
      scene,
      resolve,
      null,
      reject,
    )
  })

  const heroRoot = scene.getMeshByName("hero").parent

  scene.meshes
    .filter((mesh) => mesh.name.includes("hero"))
    .forEach((mesh) => {
      modelsMeta.set(mesh, { root: heroRoot, rootName: "hero" })
    })

  await new Promise((resolve, reject) => {
    BABYLON.SceneLoader.Append(
      "models/",
      `ship.glb`,
      scene,
      resolve,
      null,
      reject,
    )
  })

  const shipRoot = scene.getMeshByName("ship").parent

  scene.meshes
    .filter((mesh) => mesh.name.includes("ship"))
    .forEach((mesh) => {
      modelsMeta.set(mesh, {
        root: shipRoot,
        rootName: "ship",
        name: mesh.name.slice(5),
      })
    })

  return modelsMeta
}

export default loadModels

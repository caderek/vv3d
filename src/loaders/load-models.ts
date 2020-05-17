import * as BABYLON from "babylonjs"

const loadModels = async (scene) => {
  const modelsMeta = new WeakMap()

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
      mesh.isPickable = false
    })

  await new Promise((resolve, reject) => {
    BABYLON.SceneLoader.Append(
      "models/",
      `gun-pew-pew.glb`,
      scene,
      resolve,
      null,
      reject,
    )
  })

  const gunRoot = scene.getMeshByName("gun-pew-pew").parent

  scene.meshes
    .filter((mesh) => mesh.name.includes("gun-pew-pew"))
    .forEach((mesh) => {
      modelsMeta.set(mesh, { root: gunRoot, rootName: "gun-pew-pew" })
    })

  await new Promise((resolve, reject) => {
    BABYLON.SceneLoader.Append(
      "models/",
      `bot.glb`,
      scene,
      resolve,
      null,
      reject,
    )
  })

  const botRoot = scene.getMeshByName("bot").parent

  scene.meshes
    .filter((mesh) => mesh.name.includes("bot"))
    .forEach((mesh) => {
      modelsMeta.set(mesh, { root: botRoot, rootName: "bot" })
    })

  await new Promise((resolve, reject) => {
    BABYLON.SceneLoader.Append(
      "models/",
      `mobs.glb`,
      scene,
      resolve,
      null,
      reject,
    )
  })

  scene.meshes
    .filter(
      (mesh) =>
        mesh.name.includes("andy") ||
        mesh.name.includes("pete") ||
        mesh.name.includes("nemo"),
    )
    .forEach((mesh) => {
      mesh.isVisible = false
      mesh.isPickable = false
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

  await new Promise((resolve, reject) => {
    BABYLON.SceneLoader.Append(
      "models/",
      `blocks.glb`,
      scene,
      resolve,
      null,
      reject,
    )
  })
  await new Promise((resolve, reject) => {
    BABYLON.SceneLoader.Append(
      "models/",
      `pipes-and-fences.glb`,
      scene,
      resolve,
      null,
      reject,
    )
  })
  await new Promise((resolve, reject) => {
    BABYLON.SceneLoader.Append(
      "models/",
      `decorations.glb`,
      scene,
      resolve,
      null,
      reject,
    )
  })

  // console.log({ sceneLights: scene.lights.map((light) => light.name) })
  return modelsMeta
}

export default loadModels

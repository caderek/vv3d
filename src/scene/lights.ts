import * as BABYLON from "babylonjs"

class Lights {
  top: any
  bottom: any
  ambient: any
  skybox: any
  private glow: any
  private scene: any
  private worldSize: number

  constructor(scene) {
    this.scene = scene
    this.createLights()
    this.createGlow()
  }

  createSkybox(worldSize) {
    const skybox = BABYLON.Mesh.CreateBox(
      "skyBox",
      worldSize + 6,
      this.scene,
      false,
      BABYLON.Mesh.BACKSIDE,
    )

    const skyboxMaterial = new BABYLON.StandardMaterial("skybox", this.scene)

    skyboxMaterial.disableLighting = true
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0.15, 0.35, 0.75)
    skyboxMaterial.alpha = 0.95

    skybox.material = skyboxMaterial
    //@ts-ignore
    skybox.backFaceCulling = true
    skybox.position.y = worldSize / 2 - 0.5
    skybox.position.z = worldSize / 2 - 0.5
    skybox.position.x = worldSize / 2 - 0.5
    skybox.isPickable = false
    skybox.isVisible = false

    this.skybox = skybox
    this.glow.addExcludedMesh(skybox)
  }

  toggleSkybox() {
    this.skybox.isVisible = !this.skybox.isVisible
  }

  private changeSkyboxAlpha(alpha) {
    this.skybox.material.alpha = alpha
  }

  createGlow() {
    const glow = new BABYLON.GlowLayer("glow", this.scene)
    glow.intensity = 0.5

    this.glow = glow
  }

  private createLights() {
    const top = new BABYLON.DirectionalLight(
      "topLight",
      new BABYLON.Vector3(9, -30, 30),
      this.scene,
    )
    top.diffuse = new BABYLON.Color3(1, 1, 1)
    top.intensity = 4
    top.autoUpdateExtends = false
    top.autoCalcShadowZBounds = true
    top.setEnabled(true)

    const bottom = new BABYLON.DirectionalLight(
      "underLight",
      new BABYLON.Vector3(9, 30, -30),
      this.scene,
    )
    bottom.intensity = 0.5
    bottom.setEnabled(true)

    const ambient = new BABYLON.HemisphericLight(
      "ambientLight",
      new BABYLON.Vector3(0, 30, 0),
      this.scene,
    )
    ambient.intensity = 0.2
    ambient.setEnabled(true)

    this.top = top
    this.bottom = bottom
    this.ambient = ambient
  }

  change({ top, bottom, ambient, skyAlpha, color }) {
    this.top.intensity = top
    this.top.diffuse = BABYLON.Color3.FromHexString(color)
    this.bottom.intensity = bottom
    this.ambient.intensity = ambient
    this.changeSkyboxAlpha(skyAlpha)
  }
}

export default Lights

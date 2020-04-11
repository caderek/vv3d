import * as BABYLON from "babylonjs"

class Lights {
  top: any
  bottom: any
  ambient: any
  private skybox: any
  private glow: any
  private scene: any

  constructor(scene) {
    this.scene = scene
    this.createLights()
    this.createSkybox()
    this.createGlow([this.skybox])
  }

  private createSkybox() {
    const skybox = BABYLON.Mesh.CreateBox(
      "skyBox",
      16,
      this.scene,
      false,
      BABYLON.Mesh.BACKSIDE,
    )
    var skyboxMaterial = new BABYLON.StandardMaterial("skybox", this.scene)
    skyboxMaterial.disableLighting = true
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0.15, 0.35, 0.75)
    skyboxMaterial.alpha = 0.95
    skybox.material = skyboxMaterial
    skybox.backFaceCulling = true
    skybox.position.y = 5.5
    skybox.position.z = 5.5
    skybox.position.x = 5.5
    skybox.isPickable = false

    this.skybox = skybox
  }

  private changeSkyboxAlpha(alpha) {
    this.skybox.material.alpha = alpha
  }

  private createGlow(excluded: any[]) {
    const glow = new BABYLON.GlowLayer("glow", this.scene)
    glow.intensity = 0.5

    excluded.forEach((mesh) => {
      glow.addExcludedMesh(mesh)
    })

    this.glow = glow
  }

  private createLights() {
    const top = new BABYLON.DirectionalLight(
      "topLight",
      new BABYLON.Vector3(50, -50, 50),
      this.scene,
    )
    top.diffuse = new BABYLON.Color3(1, 1, 0.8)
    top.intensity = 4
    top.autoUpdateExtends = false
    top.autoCalcShadowZBounds = true

    const bottom = new BABYLON.DirectionalLight(
      "bottomLight",
      new BABYLON.Vector3(-50, 50, -50),
      this.scene,
    )
    bottom.intensity = 0.5

    const ambient = new BABYLON.HemisphericLight(
      "ambientLight",
      new BABYLON.Vector3(0, 50, 0),
      this.scene,
    )
    ambient.intensity = 0.2

    this.top = top
    this.bottom = bottom
    this.ambient = ambient
  }

  change({ top, bottom, ambient, skyAlpha }) {
    this.top.intensity = top
    this.bottom.intensity = bottom
    this.ambient.intensity = ambient
    this.changeSkyboxAlpha(skyAlpha)
  }
}

export default Lights

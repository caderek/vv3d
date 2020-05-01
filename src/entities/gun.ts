import * as BABYLON from "babylonjs"
import Bot from "./bot"

class Gun {
  public mesh: any
  private game: any
  private scene: any
  private sounds: any
  private visible: boolean

  constructor(scene, game, sounds) {
    this.game = game
    this.scene = scene
    this.sounds = sounds
    this.mesh = scene.getMeshByName("gun-pew-pew").parent
    // this.mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL)
    this.visible = true

    scene.meshes
      .filter((mesh) => mesh.name.includes("gun"))
      .forEach((mesh) => {
        mesh.material.maxSimultaneousLights = 12
      })

    scene.getMeshByName(
      "gun-pew-pew-crystal-glow",
    ).material.disableLighting = true
  }

  toggle() {
    this.visible = !this.visible
    this.mesh.isVisible = this.visible
    this.scene.meshes
      .filter((mesh) => mesh.name.includes("gun"))
      .forEach((mesh) => {
        mesh.isVisible = this.visible
      })
  }

  render() {}
}

export default Gun

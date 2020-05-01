import * as BABYLON from "babylonjs"

class Cyclops {
  public mesh: any
  private game: any
  private scene: any
  private sounds: any

  constructor(scene, game, sounds) {
    this.game = game
    this.scene = scene
    this.sounds = sounds
    this.mesh = scene.getMeshByName("cyclops").parent.clone("cyclopes")
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL)

    scene.meshes
      .filter((mesh) => mesh.name.includes("cyclops"))
      .forEach((mesh) => {
        mesh.material.maxSimultaneousLights = 12
      })
  }

  place(y, z, x) {
    this.mesh.position.y = y
    this.mesh.position.z = z
    this.mesh.position.x = x

    return this
  }

  render() {
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 48, BABYLON.Space.LOCAL)
  }
}

export default Cyclops

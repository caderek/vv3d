import * as BABYLON from "babylonjs"

class Ship {
  public mesh: any
  private scene: any
  private world: any
  private graph: any
  private position: any
  private remainingPath: any
  private remainingSteps: number
  private velocityY: number
  private velocityZ: number
  private velocityX: number

  constructor(scene, world, worldGraph) {
    this.scene = scene
    this.world = world
    this.graph = worldGraph
    this.mesh = scene.getMeshByName("ship").parent
    this.mesh.position.y = this.world.length - 1 - 0.5
    this.mesh.position.z = 0
    this.mesh.position.x = this.world.length - 1 - 0.5
    // console.log(scene.activeCamera.position.z)
    // this.mesh.position.y = scene.activeCamera.position.y
    // this.mesh.position.z = scene.activeCamera.position.z
    // this.mesh.position.x = scene.activeCamera.position.x
    this.position = { y: (this.world.length - 1) * 10, z: 0, x: 0 }
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL)
    this.remainingPath = []
    this.remainingSteps = 0
    this.velocityY = 0
    this.velocityZ = 0
    this.velocityX = 0

    scene.meshes
      .filter((mesh) => mesh.name.includes("ship-glow"))
      .forEach((mesh) => {
        mesh.material.disableLighting = true
      })
  }

  render() {
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 48, BABYLON.Space.LOCAL)
  }
}

export default Ship

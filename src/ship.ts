import * as BABYLON from "babylonjs"

class Ship {
  public mesh: any
  public orbiting: boolean
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
    this.mesh.parent = null
    this.mesh.position.y = this.world.length / 2 - 1
    this.mesh.position.z = -2
    this.mesh.position.x = this.world.length / 2
    this.position = { y: (this.world.length - 1) * 10, z: 0, x: 0 }
    this.mesh.rotate(BABYLON.Axis.Y, (Math.PI / 2) * 3, BABYLON.Space.LOCAL)
    this.remainingPath = []
    this.remainingSteps = 0
    this.velocityY = 0
    this.velocityZ = 0
    this.velocityX = 0
    this.orbiting = false

    scene.meshes
      .filter((mesh) => mesh.name.includes("ship-glow"))
      .forEach((mesh) => {
        mesh.material.disableLighting = true
      })

    scene.meshes
      .filter((mesh) => mesh.name.includes("ship"))
      .forEach((mesh) => {
        mesh.material.maxSimultaneousLights = 12
      })
  }

  toggle() {
    this.orbiting = !this.orbiting

    if (this.orbiting) {
      console.log("go to orbit!")
      console.log("ship!!!")
      console.log(this.mesh)
      this.mesh.parent = this.scene.activeCamera
      this.mesh.position.y = -0.7
      this.mesh.position.z = 0.49
      this.mesh.position.x = 0
      this.mesh.rotate(BABYLON.Axis.Y, -(Math.PI / 2), BABYLON.Space.LOCAL)
    } else {
      this.mesh.parent = null
      this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL)
      this.mesh.position.y = this.world.length / 2 - 1
      this.mesh.position.z = -2
      this.mesh.position.x = this.world.length / 2
    }
  }

  bounce() {}

  render() {
    if (!this.orbiting) {
      // this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 48, BABYLON.Space.LOCAL)
    }
  }
}

export default Ship

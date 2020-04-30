import * as BABYLON from "babylonjs"

class Bot {
  public mesh: any
  private game: any
  private scene: any
  private sounds: any
  private position: any
  private remainingPath: any
  private remainingSteps: number
  private velocityY: number
  private velocityZ: number
  private velocityX: number
  private visible: boolean
  private light: any

  constructor(scene, game, sounds, shadowGenerator) {
    this.game = game
    this.scene = scene
    this.sounds = sounds
    this.mesh = scene.getMeshByName("bot").parent
    this.mesh.position.y = this.game.world.map.length - 1 - 0.5
    this.mesh.position.z = 2
    this.mesh.position.x = 2
    this.position = { y: (this.game.world.map.length - 1) * 10, z: 0, x: 0 }
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL)
    this.remainingPath = []
    this.remainingSteps = 0
    this.velocityY = 0
    this.velocityZ = 0
    this.velocityX = 0
    this.visible = true
    this.light = scene.getLightByID("Point")

    scene.meshes
      .filter((mesh) => mesh.name.includes("bot"))
      .forEach((mesh) => {
        mesh.material.maxSimultaneousLights = 12
      })

    // this.toggle()
  }

  bounce() {
    const animations = this.scene.animationGroups.filter((animation) =>
      animation.name.includes("bot"),
    )
    animations.forEach((animation) => animation.play(true))
  }

  move(destination) {}

  toggle() {
    this.visible = !this.visible
    this.mesh.isVisible = this.visible
    this.scene.meshes
      .filter((mesh) => mesh.name.includes("bot"))
      .forEach((mesh) => {
        mesh.isVisible = this.visible
      })

    this.light.intensity = this.visible ? 1 : 0
  }

  render() {
    if (this.remainingPath.length > 0 || this.remainingSteps > 0) {
      if (this.remainingSteps === 0) {
        const waypoint = this.remainingPath.shift()
        this.velocityZ = waypoint.z - this.position.z / 10
        this.velocityY = waypoint.y - this.position.y / 10
        this.velocityX = waypoint.x - this.position.x / 10
        this.remainingSteps = 5
      }

      this.position.y += this.velocityY * 2
      this.position.z += this.velocityZ * 2
      this.position.x += this.velocityX * 2

      this.mesh.position.y = this.position.y / 10 - 0.5
      this.mesh.position.z = this.position.z / 10
      this.mesh.position.x = this.position.x / 10

      this.remainingSteps -= 1
    } else {
      this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 48, BABYLON.Space.LOCAL)
    }
  }
}

export default Bot

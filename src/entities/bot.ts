import * as BABYLON from "babylonjs"
import getFirstEmptyField from "../helpers/getFirstEmptyField"

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
  private delay: number

  constructor(scene, game, sounds, shadowGenerator) {
    this.game = game
    this.scene = scene
    this.sounds = sounds
    this.delay = 0
    this.mesh = scene.getMeshByName("bot").parent
    this.mesh.position.y = this.game.world.map.length - 1 + 1
    this.mesh.position.z = 2
    this.mesh.position.x = 2
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

    scene.getMeshByName("bot-flame-glow").material.disableLighting = true
  }

  bounce() {
    const animations = this.scene.animationGroups.filter((animation) =>
      animation.name.includes("bot"),
    )
    animations.forEach((animation) => animation.play(true))
  }

  move({ y, z, x }) {
    this.delay = 15

    this.remainingPath = this.game.world.graph.find(
      `${this.position.y / 10}_${this.position.z / 10}_${this.position.x / 10}`,
      `${y}_${z}_${x}`,
    )
  }

  toggle() {
    this.visible = !this.visible
    this.mesh.isVisible = this.visible
    this.scene.meshes
      .filter((mesh) => mesh.name.includes("bot"))
      .forEach((mesh) => {
        mesh.isVisible = this.visible
      })

    this.light.intensity = this.visible ? 1 : 0
    this.resetPosition()
  }

  private resetPosition() {
    const y = getFirstEmptyField(this.game.world.map, 1, 8)
    this.position = { y: y * 10, z: 10, x: 80 }
    this.mesh.position.y = y + 1
    this.mesh.position.z = 1
    this.mesh.position.x = 8
  }

  render() {
    if (this.delay !== 0) {
      this.delay--
      return
    }

    if (this.remainingPath.length > 0 || this.remainingSteps > 0) {
      if (this.remainingSteps === 0) {
        const waypoint = this.remainingPath.shift()
        this.velocityZ = waypoint.z - this.position.z / 10
        this.velocityY = waypoint.y - this.position.y / 10
        this.velocityX = waypoint.x - this.position.x / 10
        this.remainingSteps = 10
      }

      this.position.y += this.velocityY
      this.position.z += this.velocityZ
      this.position.x += this.velocityX

      this.mesh.position.y = this.position.y / 10 + 1
      this.mesh.position.z = this.position.z / 10
      this.mesh.position.x = this.position.x / 10

      this.remainingSteps -= 1
    } else {
      this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 60, BABYLON.Space.LOCAL)
    }
  }
}

export default Bot

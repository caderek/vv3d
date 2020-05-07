import * as BABYLON from "babylonjs"
import Bot from "./bot"
import Gun from "./gun"
import getFirstEmptyField from "../helpers/getFirstEmptyField"

class Hero {
  public mesh: any
  private hand: any
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
  private bot: Bot
  private gun: Gun
  private attacking: boolean
  private target: any
  private modelsMeta: any
  private steps: any[]

  constructor(scene, game, sounds, bot, modelsMeta) {
    this.game = game
    this.scene = scene
    this.sounds = sounds
    this.modelsMeta = modelsMeta
    this.bot = bot
    this.attacking = false
    this.mesh = scene.getMeshByName("hero").parent
    this.mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL)
    this.remainingPath = []
    this.remainingSteps = 0
    this.velocityY = 0
    this.velocityZ = 0
    this.velocityX = 0
    this.visible = true
    this.light = scene.getLightByName("hero-light")
    this.hand = scene.getMeshByName("hero-arm.R")

    this.resetPosition()

    scene.meshes
      .filter((mesh) => mesh.name.includes("hero"))
      .forEach((mesh) => {
        mesh.material.maxSimultaneousLights = 12
      })

    scene.getMeshByName("hero-glow.R").material.disableLighting = true

    this.toggle()
  }

  bounce() {
    const animations = this.scene.animationGroups.filter((animation) =>
      animation.name.includes("hero"),
    )
    animations.forEach((animation) => animation.play(true))
  }

  attack(target) {
    this.attacking = true
    this.target = target
    const angle = -this.getAngleBetweenHeroAndTarget(target)
    const axis = new BABYLON.Vector3(0, 1, 0)
    const quaternion = BABYLON.Quaternion.RotationAxis(axis, angle)
    this.mesh.rotationQuaternion = quaternion

    if (this.isTargetInRange(target)) {
      this.gun.shoot(target)
      this.attacking = false
      this.steps = null
    } else {
      this.sounds.copy.play()
    }
  }

  private getAngleBetweenHeroAndTarget(target) {
    const angle = BABYLON.Angle.BetweenTwoPoints(
      new BABYLON.Vector2(this.mesh.position.x, this.mesh.position.z),
      new BABYLON.Vector2(target.mesh.position.x, target.mesh.position.z),
    )
    const rad = angle.radians()

    return rad
  }

  private isTargetInRange(target) {
    const pickingRay = BABYLON.Ray.CreateNewFromTo(
      this.gun.laser.absolutePosition,
      target.mesh.absolutePosition,
    )

    const hit = this.scene.pickWithRay(pickingRay, (mesh) => {
      const meta = this.modelsMeta.get(mesh)
      return mesh.isPickable && (meta === undefined || meta.type === "mob")
    })

    if (hit.pickedMesh !== target.mesh) {
      this.moveOneStep(
        Math.round(target.mesh.position.y),
        target.mesh.position.z,
        target.mesh.position.x,
      )

      return false
    }

    return true
  }

  moveOneStep(y, z, x) {
    if (!this.steps) {
      this.steps = this.game.world.graph.find(
        `${this.position.y / 10}_${this.position.z / 10}_${
          this.position.x / 10
        }`,
        `${y}_${z}_${x}`,
      )
    }

    const step = [this.steps.shift()]

    if (step.length === 1) {
      this.remainingPath = step
      return true
    }

    return false
  }

  move(destination) {
    this.attacking = false
    this.target = null

    const coords = destination.split("_").map(Number)
    coords[0] += 1
    const [y, z, x] = coords

    if (this.game.world.map?.[y]?.[z]?.[x] !== 0) {
      this.sounds.denied.play()
      return
    }

    this.remainingPath = this.game.world.graph.find(
      `${this.position.y / 10}_${this.position.z / 10}_${this.position.x / 10}`,
      `${y}_${z}_${x}`,
    )

    if (this.remainingPath.length !== 0) {
      const botTarget =
        this.remainingPath.length > 2
          ? this.remainingPath[this.remainingPath.length - 3]
          : null

      this.sounds.go.play()

      if (botTarget !== null) {
        this.bot.move(botTarget)
      }
    } else {
      this.sounds.denied.play()
    }
  }

  toggle() {
    this.visible = !this.visible
    this.mesh.isVisible = this.visible
    this.scene.meshes
      .filter((mesh) => mesh.name.includes("hero"))
      .forEach((mesh) => {
        mesh.isVisible = this.visible
      })

    this.light.intensity = this.visible ? 1 : 0

    this.bot.toggle()
    this.resetPosition()

    if (this.gun) {
      this.gun.toggle()
    }
  }

  changeGun(gun) {
    this.gun = gun
    gun.mesh.setParent(this.hand)
    this.gun.toggle()
  }

  private resetPosition() {
    const y = getFirstEmptyField(this.game.world.map, 1, 9)
    this.position = { y: y * 10, z: 10, x: 90 }
    this.mesh.position.y = y - 0.5
    this.mesh.position.z = 1
    this.mesh.position.x = 9
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
      if (this.attacking) {
        this.attack(this.target)
      } else {
        // this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 48, BABYLON.Space.LOCAL)
      }
    }
  }
}

export default Hero

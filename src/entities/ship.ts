import * as BABYLON from "babylonjs"
import * as GUI from "babylonjs-gui"
import getFirstEmptyField from "../helpers/getFirstEmptyField"

class Ship {
  public mesh: any
  private lights: any
  public orbiting: boolean
  private scene: any
  private game: any
  private camera: any
  private position: any
  private remainingPath: any
  private remainingSteps: number
  private velocityY: number
  private velocityZ: number
  private velocityX: number
  private ray: any
  private rayCounter: number
  private rayColorLeft: any
  private rayColorRight: any
  private laserLeft: any
  private laserRight: any
  private screen: any

  constructor(scene, game, camera, gui, shadowGenerator) {
    this.scene = scene
    this.game = game
    this.camera = camera
    this.mesh = scene.getMeshByName("ship").parent
    this.mesh.parent = null
    this.mesh.rotate(BABYLON.Axis.Y, (Math.PI / 2) * 3, BABYLON.Space.LOCAL)
    this.remainingPath = []
    this.remainingSteps = 0
    this.velocityY = 0
    this.velocityZ = 0
    this.velocityX = 0
    this.orbiting = false
    this.lights = scene.lights.filter((light) => light.name.includes("ship"))

    const shipMeshes = scene.meshes.filter((mesh) => mesh.name.includes("ship"))

    this.lights.forEach((light) => {
      light.includedOnlyMeshes = shipMeshes
    })

    shipMeshes.forEach((mesh) => {
      mesh.material.maxSimultaneousLights = 12
    })

    scene.meshes
      .filter(
        (mesh) =>
          mesh.name.includes("ship-glow") || mesh.name.includes("ship-button"),
      )
      .forEach((mesh) => {
        mesh.material.disableLighting = true
      })

    this.laserLeft = scene.getMeshByName("ship-laser.L")
    this.laserRight = scene.getMeshByName("ship-laser.R")

    const screenMesh = scene.getMeshByName("ship-screen")
    const screen = new GUI.Rectangle()
    screen.width = "320px"
    screen.height = "110px"
    screen.thickness = 0
    // screen.background = "blue"
    gui.addControl(screen)

    const label = new GUI.TextBlock()
    label.text = `Planet ${game.world.data.name}`
    label.color = "#008DE7"
    label.fontFamily = "monospace"
    screen.addControl(label)

    screen.linkWithMesh(screenMesh)

    this.screen = {
      screen,
      label,
    }

    this.createRay()
    this.toggle()
  }

  toggle() {
    this.orbiting = !this.orbiting

    if (this.orbiting) {
      this.mesh.parent = this.scene.activeCamera
      this.mesh.position.y = -0.79
      this.mesh.position.z = 0.49
      this.mesh.position.x = 0
      this.mesh.rotate(BABYLON.Axis.Y, -(Math.PI / 2), BABYLON.Space.LOCAL)
      this.camera.goToOrbit()
      this.screen.screen.isVisible = true
    } else {
      this.mesh.parent = null
      this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL)
      this.mesh.position.y = getFirstEmptyField(this.game.world.map, 1, 9) - 0.5
      this.mesh.position.z = -1
      this.mesh.position.x = 9
      this.camera.goToHero()
      this.screen.screen.isVisible = false
    }
  }

  bounce() {
    const animations = this.scene.animationGroups.filter((animation) =>
      animation.name.includes("ship"),
    )
    animations.forEach((animation) => animation.play(true))
  }

  stop() {
    const animations = this.scene.animationGroups.filter((animation) =>
      animation.name.includes("ship"),
    )
    animations.forEach((animation) => animation.stop())
  }

  shoot(y: number, z: number, x: number, side: "left" | "right") {
    const laser = side === "left" ? this.laserLeft : this.laserRight

    BABYLON.MeshBuilder.CreateTube("ray-glow", {
      path: [
        new BABYLON.Vector3(x, y - 0.5, z),
        new BABYLON.Vector3(
          laser.absolutePosition.x,
          laser.absolutePosition.y,
          laser.absolutePosition.z,
        ),
      ],
      instance: this.ray,
    })

    this.ray.material.emissiveColor =
      side === "left" ? this.rayColorLeft : this.rayColorRight
    this.ray.isVisible = true
    this.rayCounter = 2
  }

  refreshScreen() {
    this.screen.label.text = `Planet ${this.game.world.data.name}`
  }

  private createRay() {
    const ray = BABYLON.MeshBuilder.CreateTube(
      "ray-glow",
      {
        path: [
          new BABYLON.Vector3(0, 0, 0),
          new BABYLON.Vector3(
            this.mesh.absolutePosition.x,
            this.mesh.absolutePosition.y,
            this.mesh.absolutePosition.z,
          ),
        ],
        radius: 0.03,
        updatable: true,
      },
      this.scene,
    )

    ray.material = new BABYLON.StandardMaterial("ray", this.scene)
    // @ts-ignore
    ray.material.disableLighting = true
    ray.isVisible = false
    ray.isPickable = false

    this.ray = ray
    this.rayCounter = 0
    this.rayColorLeft = BABYLON.Color3.FromHexString("#008DE7")
    this.rayColorRight = BABYLON.Color3.FromHexString("#E70075")
  }

  render() {
    if (this.rayCounter === 0 && this.ray.isVisible) {
      this.ray.isVisible = false
    } else if (this.rayCounter !== 0) {
      this.rayCounter--
    }

    if (!this.orbiting) {
    }
  }
}

export default Ship

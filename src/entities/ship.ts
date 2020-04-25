import * as BABYLON from "babylonjs"

class Ship {
  public mesh: any
  public orbiting: boolean
  private scene: any
  private map: any
  private graph: any
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

  constructor(scene, world, camera) {
    this.scene = scene
    this.map = world.map
    this.graph = world.graph
    this.camera = camera
    this.mesh = scene.getMeshByName("ship").parent
    this.mesh.parent = null
    this.mesh.position.y = this.map.length / 2 - 1
    this.mesh.position.z = -2
    this.mesh.position.x = this.map.length / 2
    this.position = { y: (this.map.length - 1) * 10, z: 0, x: 0 }
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

    this.laserLeft = scene.getMeshByName("ship-laser.L")
    this.laserRight = scene.getMeshByName("ship-laser.R")

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
    } else {
      this.mesh.parent = null
      this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.LOCAL)
      this.mesh.position.y = this.map.length / 2 - 1
      this.mesh.position.z = -2
      this.mesh.position.x = this.map.length / 2
      this.camera.goToHero()
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
        new BABYLON.Vector3(x, y, z),
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
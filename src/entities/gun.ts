import * as BABYLON from "babylonjs"
import Bot from "./bot"

class Gun {
  public mesh: any
  public laser: any
  private game: any
  private scene: any
  private sounds: any
  private visible: boolean
  private ray: any
  private rayCounter: number
  private target: any
  private modelsMeta: any

  constructor(scene, game, sounds, modelsMeta) {
    this.game = game
    this.scene = scene
    this.modelsMeta = modelsMeta
    this.sounds = sounds
    this.mesh = scene.getMeshByName("gun-pew-pew").parent
    // this.mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL)
    this.visible = true
    this.laser = scene.getMeshByName("gun-pew-pew-crystal-glow")

    scene.meshes
      .filter((mesh) => mesh.name.includes("gun"))
      .forEach((mesh) => {
        mesh.material.maxSimultaneousLights = 12
      })

    scene.getMeshByName(
      "gun-pew-pew-crystal-glow",
    ).material.disableLighting = true

    this.createRay()
  }

  shoot(target) {
    this.target = target
    this.rayCounter = 10
    this.sounds.gun.play()
  }

  private renderRay() {
    BABYLON.MeshBuilder.CreateTube("gun-ray-glow", {
      path: [
        new BABYLON.Vector3(
          this.laser.absolutePosition.x,
          this.laser.absolutePosition.y,
          this.laser.absolutePosition.z,
        ),
        new BABYLON.Vector3(
          this.target.mesh.absolutePosition.x,
          this.target.mesh.absolutePosition.y,
          this.target.mesh.absolutePosition.z,
        ),
      ],
      instance: this.ray,
    })

    this.ray.isVisible = true
  }

  private createRay() {
    const ray = BABYLON.MeshBuilder.CreateTube(
      "gun-ray-glow",
      {
        path: [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0)],
        radius: 0.03,
        updatable: true,
      },
      this.scene,
    )

    ray.material = new BABYLON.StandardMaterial("ray", this.scene)
    // @ts-ignore
    ray.material.emissiveColor = BABYLON.Color3.FromHexString("#E70075")

    // @ts-ignore
    ray.material.disableLighting = true
    ray.isVisible = false
    ray.isPickable = false

    this.ray = ray
    this.rayCounter = 0
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

  render() {
    if (this.rayCounter === 0 && this.ray.isVisible) {
      this.ray.isVisible = false
    } else if (this.rayCounter !== 0) {
      this.renderRay()
      this.rayCounter--
    }
  }
}

export default Gun

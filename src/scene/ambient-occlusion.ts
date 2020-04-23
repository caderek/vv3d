import * as BABYLON from "babylonjs"

class AmbientOcclusion {
  constructor(scene, camera) {
    const ssao = new BABYLON.SSAO2RenderingPipeline("ssao", scene, {
      ssaoRatio: 0.5, // Ratio of the SSAO post-process, in a lower resolution
      blurRatio: 1, // Ratio of the combine post-process (combines the SSAO and the scene)
    })
    ssao.radius = 8
    ssao.totalStrength = 0.9
    ssao.expensiveBlur = true
    ssao.samples = 16
    ssao.maxZ = 100
    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(
      "ssao",
      camera,
    )

    const defaultpipeline = new BABYLON.DefaultRenderingPipeline(
      "default",
      true,
      scene,
      [camera],
    )
    defaultpipeline.fxaaEnabled = true
  }
}

export default AmbientOcclusion

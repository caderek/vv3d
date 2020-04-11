import * as BABYLON from "babylonjs"

const optimize = (scene) => {
  var options = new BABYLON.SceneOptimizerOptions()
  options.addOptimization(new BABYLON.HardwareScalingOptimization(4, 4))

  // Optimizer
  var optimizer = new BABYLON.SceneOptimizer(scene, options)
  optimizer.targetFrameRate = 20
}

export default optimize

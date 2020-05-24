import * as BABYLON from "babylonjs"

const handleControls = (scene, game, action1, action2, canvas, mobile) => {
  const input = {
    down: false,
    up: false,
  }

  let gamepadConnected = false
  const gamepadButtons = [false, false, false, false]

  let right = false
  let left = false
  let timer = 0
  let cycle = false
  let prevCameraPosition = { x: null, y: null, z: null }

  canvas.addEventListener("contextmenu", () => {
    right = true
  })

  canvas.addEventListener("click", ({ target }) => {
    left = true
  })

  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        input.down = true
        break
      case BABYLON.PointerEventTypes.POINTERUP:
        input.up = true
        break
    }
  })

  var gamepadManager = new BABYLON.GamepadManager()
  gamepadManager.onGamepadConnectedObservable.add((gamepad, state) => {
    console.log("Gamepad connected")
    gamepadConnected = true
    //@ts-ignore
    gamepad.onButtonDownObservable.add((button, state) => {
      //Button has been pressed
      game.sounds.button.play()
      gamepadButtons[button] = true
      console.log(button)
    })
    //@ts-ignore
    gamepad.onButtonUpObservable.add((button, state) => {
      //Button has been pressed
      gamepadButtons[button] = false
      console.log(button)
    })
  })
  gamepadManager.onGamepadDisconnectedObservable.add((gamepad, state) => {
    gamepadConnected = false
    console.log("Gamepad disconnected")
  })

  const camera = scene.activeCamera

  return () => {
    if (gamepadConnected) {
      if (gamepadButtons[0]) {
        console.log("X")
        action2()
      }
      if (gamepadButtons[1]) {
        console.log("O")
        action1()
      }
      if (gamepadButtons[4]) {
        console.log("L1")
        camera.alpha += 0.05
      }
      if (gamepadButtons[5]) {
        console.log("R1")
        camera.alpha -= 0.05
      }

      // gamepadButtons.fill(false)
    }

    const cameraNotMoved =
      scene.activeCamera.position.x === prevCameraPosition.x &&
      scene.activeCamera.position.y === prevCameraPosition.y &&
      scene.activeCamera.position.z === prevCameraPosition.z

    if (!mobile) {
      if (input.down) {
        prevCameraPosition = { ...scene.activeCamera.position }
        input.down = false
      } else if (input.up) {
        input.up = false

        if (!cameraNotMoved) {
          left = false
          right = false
          return
        }

        if (left) {
          action2()
          left = false
        } else if (right) {
          action1()
          right = false
        }
      }
    } else {
      if (timer !== 0) {
        timer++
      }

      if (timer > 7 && cameraNotMoved) {
        action1()
        cycle = true
        timer = 1
      }

      if (input.down) {
        timer = 1
        input.down = false
        prevCameraPosition = { ...scene.activeCamera.position }
      } else if (input.up) {
        if (timer <= 15 && !cycle && cameraNotMoved) {
          action2()
        }
        timer = 0
        input.up = false
        cycle = false
      }
    }
  }
}

export default handleControls

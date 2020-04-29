const saveWorld = (game) => {
  window.localStorage.setItem(
    "world",
    JSON.stringify({ map: game.world.map, data: game.world.data, version: 1 }),
  )
}

export { saveWorld }

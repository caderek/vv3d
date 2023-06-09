const saveWorld = (game) => {
  window.localStorage.setItem(
    "world",
    JSON.stringify({
      map: game.world.map,
      data: game.world.data,
      mobs: game.world.mobs,
      version: "0.1.12",
    }),
  )
}

export { saveWorld }

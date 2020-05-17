const saveWorld = (game) => {
  window.localStorage.setItem(
    "world",
    JSON.stringify({
      map: game.world.map,
      data: game.world.data,
      mobs: game.world.mobs,
      version: "0.1.7",
    }),
  )
}

export { saveWorld }

const saveWorld = (game) => {
  console.log({ mobsSave: game.world.mobs })
  window.localStorage.setItem(
    "world",
    JSON.stringify({
      map: game.world.map,
      data: game.world.data,
      mobs: game.world.mobs,
      version: "0.1.0",
    }),
  )
}

export { saveWorld }

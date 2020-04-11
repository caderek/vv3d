const saveWorld = (world) => {
  window.localStorage.setItem("world", JSON.stringify(world))
}

export { saveWorld }

const getItemsWithinRadius = (scene, radius, y, z, x) => {
  const meshes = []
  for (let i = -radius + y; i <= radius + y; i++) {
    for (let j = -radius + z; j <= radius + z; j++) {
      for (let k = -radius + x; k <= radius + x; k++) {
        const mesh = scene.getMeshByName(`item_${i}_${j}_${k}`)
        if (mesh) {
          meshes.push(mesh)
        }
      }
    }
  }
  return meshes
}

export default getItemsWithinRadius

const fs = require("fs")

const cut = (map, fromY, fromZ, fromX, toY, toZ, toX) => {
  const fragment = []

  for (let y = 0; y <= toY - fromY; y++) {
    fragment.push([])

    for (let z = 0; z <= toZ - fromZ; z++) {
      fragment[y].push([])

      for (let x = 0; x <= toX - fromX; x++) {
        console.log({ y, z, x })
        fragment[y][z].push(map[y + fromY][z + fromZ][x + fromX])
      }
    }
  }

  return fragment
}

const files = fs.readdirSync("./scripts/fragments")

const items = []

files.forEach((file) => {
  const content = JSON.parse(
    fs.readFileSync(`./scripts/fragments/${file}`).toString(),
  )

  const { map, fragments } = content

  fragments.forEach(({ type, coords }) => {
    items.push({
      type,
      fragment: cut(map, ...coords),
      height: coords[3] - coords[0] + 1,
      depth: coords[4] - coords[1] + 1,
      width: coords[5] - coords[2] + 1,
    })
  })
})

console.dir(items, { colors: true, depth: 99 })

fs.writeFileSync(
  "./src/world/fragments.ts",
  `const fragments = ${JSON.stringify(items)};export default fragments`,
)

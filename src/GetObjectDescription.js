const twoSpaces = / {2,}/g

const GetObjectDescription = (obj, precision = 1) => {
  const { type } = obj

  let output
  let count = null

  if (type === 'Blitter') {
    count = obj.children.list.length
  } else if (type === 'ParticleEmitter') {
    count = obj.getParticleCount()
  } else if (type === 'SpriteGPULayer') {
    count = obj.memberCount
  } else if (type === 'TilemapLayer' || type === 'TilemapGPULayer') {
    count = obj.tilesTotal
  } else if (obj.list) {
    count = obj.list.length
  }

  const countStr = count === null ? '' : `(${count})`

  if (type === 'DisplayList') {
    output = `${obj.type} ${obj.name} ${countStr}`
  } else {
    const visible = obj.visible ? '+' : '-'
    const pos =
      typeof obj.x === 'number'
        ? `(${obj.x.toFixed(precision)}, ${obj.y.toFixed(precision)})`
        : ''

    output = `${visible} ${obj.type} ${obj.name} ${pos} ${obj.depth.toFixed(precision)} ${countStr}`
  }

  output = output.replace(twoSpaces, ' ').trimEnd()

  return output
}

export default GetObjectDescription

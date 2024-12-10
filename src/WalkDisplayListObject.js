import GetObjectDescription from './GetObjectDescription'

const indentMap = {}

for (let i = 0; i <= 11; i++) {
  indentMap[i] = ' '.repeat(2 * i)
}

const WalkDisplayListObj = (
  obj,
  output = [],
  currentDepth = 0,
  maxDepth = 10,
  maxLength = 1000
) => {
  output.push((indentMap[currentDepth] ?? '! ') + GetObjectDescription(obj))

  const { list } = obj

  if (list) {
    currentDepth += 1

    const listLength = list.length
    const currentIndent = indentMap[currentDepth] ?? '! '

    if (currentDepth > maxDepth) {
      if (listLength > 0) {
        output.push(`${currentIndent}[ ${listLength} more ... ]`)
      }

      return output
    }

    let remainingChildren = listLength

    for (const child of list) {
      WalkDisplayListObj(child, output, currentDepth, maxDepth, maxLength)

      remainingChildren -= 1

      if (output.length >= maxLength) {
        if (remainingChildren > 0) {
          output.push(`${currentIndent}[ ${remainingChildren} more ... ]`)
        }

        return output
      }
    }
  }

  return output
}

export default WalkDisplayListObj

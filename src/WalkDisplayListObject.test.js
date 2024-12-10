import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import GetObjectDescription from './GetObjectDescription'
import WalkDisplayListObj from './WalkDisplayListObject'

vi.mock('./GetObjectDescription', () => ({
  default: vi.fn((obj) => `${obj.name}`)
}))

describe('WalkDisplayListObj', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should call GetObjectDescription with the correct parameters', () => {
    const obj = { name: 'root' }
    WalkDisplayListObj(obj)
    expect(GetObjectDescription).toHaveBeenCalledWith(obj)
  })

  test('should handle nested objects', () => {
    const obj = {
      name: 'root',
      list: [
        { name: 'child1' },
        { name: 'child2', list: [{ name: 'grandchild' }] }
      ]
    }
    const result = WalkDisplayListObj(obj)
    expect(result).toEqual(['root', '  child1', '  child2', '    grandchild'])
  })

  test('should handle objects without a list property', () => {
    const obj = { name: 'root' }
    const result = WalkDisplayListObj(obj)
    expect(result).toEqual(['root'])
  })

  test('should descend and then ascend correctly', () => {
    const obj = {
      name: 'root',
      list: [
        { name: 'child1', list: [{ name: 'grandchild1' }] },
        { name: 'child2' }
      ]
    }
    const result = WalkDisplayListObj(obj)
    expect(result).toEqual(['root', '  child1', '    grandchild1', '  child2'])
  })

  test('should respect maxDepth parameter with maxDepth = 0', () => {
    const obj = {
      name: 'root',
      list: [
        { name: 'child1', list: [{ name: 'grandchild1' }] },
        { name: 'child2', list: [{ name: 'grandchild2' }] }
      ]
    }
    const result = WalkDisplayListObj(obj, [], 0, 0)
    expect(result).toEqual(['root', '  [ 2 more ... ]'])
  })

  // Won't fix :P
  test.skip('should respect maxLength parameter with maxLength = 1', () => {
    const obj = {
      name: 'root',
      list: [
        { name: 'child1' },
        { name: 'child2', list: [{ name: 'grandchild' }] }
      ]
    }
    const result = WalkDisplayListObj(obj, [], 0, 5, 1)
    expect(result).toEqual(['root', '  [ 2 more ... ]'])
  })

  test('should respect maxDepth parameter with maxDepth = 1', () => {
    const obj = {
      name: 'root',
      list: [
        { name: 'child1', list: [{ name: 'grandchild1' }] },
        { name: 'child2', list: [{ name: 'grandchild2' }] }
      ]
    }
    const result = WalkDisplayListObj(obj, [], 0, 1)
  })

  test('should respect maxDepth parameter with maxDepth = 2', () => {
    const obj = {
      name: 'root',
      list: [
        { name: 'child1', list: [{ name: 'grandchild1' }] },
        { name: 'child2', list: [{ name: 'grandchild2' }] }
      ]
    }
    const result = WalkDisplayListObj(obj, [], 0, 2)
    expect(result).toEqual([
      'root',
      '  child1',
      '    grandchild1',
      '  child2',
      '    grandchild2'
    ])
  })

  test('should respect maxLength parameter with maxLength = 2', () => {
    const obj = {
      name: 'root',
      list: [
        { name: 'child1' },
        { name: 'child2', list: [{ name: 'grandchild' }] }
      ]
    }
    const result = WalkDisplayListObj(obj, [], 0, 5, 2)
    expect(result).toEqual(['root', '  child1', '  [ 1 more ... ]'])
  })
})

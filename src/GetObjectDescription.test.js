import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import GetObjectDescription from './GetObjectDescription'

describe('GetObjectDescription', () => {
  test('returns correct description for DisplayList', () => {
    const obj = {
      type: 'DisplayList',
      name: 'displayListObject',
      list: [1, 2, 3, 4]
    }
    const result = GetObjectDescription(obj)
    expect(result).toBe('DisplayList displayListObject (4)')
  })

  test('returns correct description for empty Layer', () => {
    const obj = {
      type: 'Layer',
      name: 'layerObject',
      visible: true,
      depth: 5
    }
    const result = GetObjectDescription(obj)
    expect(result).toBe('+ Layer layerObject 5.0')
  })

  test('returns correct description for Layer with 3 children', () => {
    const obj = {
      type: 'Layer',
      name: 'layerObject',
      visible: true,
      depth: 5,
      list: [1, 2, 3]
    }
    const result = GetObjectDescription(obj)
    expect(result).toBe('+ Layer layerObject 5.0 (3)')
  })

  test('returns correct description for DisplayList with empty name', () => {
    const obj = {
      type: 'DisplayList',
      name: '',
      list: [1, 2, 3, 4]
    }
    const result = GetObjectDescription(obj)
    expect(result).toBe('DisplayList (4)')
  })

  test('returns correct description for Blitter', () => {
    const obj = {
      type: 'Blitter',
      children: { list: [1, 2, 3] },
      name: 'blitterObject',
      visible: true,
      x: 10,
      y: 20,
      depth: 5
    }
    const result = GetObjectDescription(obj)
    expect(result).toBe('+ Blitter blitterObject (10.0, 20.0) 5.0 (3)')
  })

  test('returns correct description for ParticleEmitter', () => {
    const obj = {
      type: 'ParticleEmitter',
      getParticleCount: () => 10,
      name: 'particleEmitterObject',
      visible: true,
      x: 10,
      y: 20,
      depth: 5
    }
    const result = GetObjectDescription(obj)
    expect(result).toBe(
      '+ ParticleEmitter particleEmitterObject (10.0, 20.0) 5.0 (10)'
    )
  })

  test('returns correct description for Container', () => {
    const obj = {
      type: 'Container',
      list: [1, 2],
      name: 'containerObject',
      visible: true,
      x: 10,
      y: 20,
      depth: 5
    }
    const result = GetObjectDescription(obj)
    expect(result).toBe('+ Container containerObject (10.0, 20.0) 5.0 (2)')
  })

  test('returns correct description for Sprite', () => {
    const obj = {
      type: 'Sprite',
      name: 'spriteObject',
      visible: true,
      x: 10,
      y: 20,
      depth: 5
    }
    const result = GetObjectDescription(obj)
    expect(result).toBe('+ Sprite spriteObject (10.0, 20.0) 5.0')
  })

  test('returns correct description for invisible Sprite', () => {
    const obj = {
      type: 'Sprite',
      name: 'spriteObject',
      visible: false,
      x: 10,
      y: 20,
      depth: 5
    }
    const result = GetObjectDescription(obj)
    expect(result).toBe('- Sprite spriteObject (10.0, 20.0) 5.0')
  })

  test('returns correct description with indentation at depth 2', () => {
    const obj = {
      type: 'Sprite',
      name: 'spriteObject',
      visible: true,
      x: 10,
      y: 20,
      depth: 5
    }
    const result = GetObjectDescription(obj)
    expect(result).toBe('+ Sprite spriteObject (10.0, 20.0) 5.0')
  })
})

test('returns correct description for Sprite with empty name', () => {
  const obj = {
    type: 'Sprite',
    name: '',
    visible: true,
    x: 10,
    y: 20,
    depth: 5
  }
  const result = GetObjectDescription(obj)
  expect(result).toBe('+ Sprite (10.0, 20.0) 5.0')
})

test('returns correct description with precision 2 for Blitter', () => {
  const obj = {
    type: 'Blitter',
    children: { list: [1, 2, 3] },
    name: 'blitterObject',
    visible: true,
    x: 10.123,
    y: 20.456,
    depth: 5.789
  }
  const result = GetObjectDescription(obj, 2)
  expect(result).toBe('+ Blitter blitterObject (10.12, 20.46) 5.79 (3)')
})

test('returns correct description with precision 3 for ParticleEmitter', () => {
  const obj = {
    type: 'ParticleEmitter',
    getParticleCount: () => 10,
    name: 'particleEmitterObject',
    visible: true,
    x: 10.1234,
    y: 20.5678,
    depth: 5.9123
  }
  const result = GetObjectDescription(obj, 3)
  expect(result).toBe(
    '+ ParticleEmitter particleEmitterObject (10.123, 20.568) 5.912 (10)'
  )
})

test('returns correct description with precision 0 for Container', () => {
  const obj = {
    type: 'Container',
    list: [1, 2],
    name: 'containerObject',
    visible: true,
    x: 10.123,
    y: 20.456,
    depth: 5.789
  }
  const result = GetObjectDescription(obj, 0)
  expect(result).toBe('+ Container containerObject (10, 20) 6 (2)')
})

test('returns correct description with precision 2 for Sprite', () => {
  const obj = {
    type: 'Sprite',
    name: 'spriteObject',
    visible: true,
    x: 10.123,
    y: 20.456,
    depth: 5.789
  }
  const result = GetObjectDescription(obj, 2)
  expect(result).toBe('+ Sprite spriteObject (10.12, 20.46) 5.79')
})

test('returns correct description with precision 1 for invisible Sprite', () => {
  const obj = {
    type: 'Sprite',
    name: 'spriteObject',
    visible: false,
    x: 10.123,
    y: 20.456,
    depth: 5.789
  }
  const result = GetObjectDescription(obj, 1)
  expect(result).toBe('- Sprite spriteObject (10.1, 20.5) 5.8')
})

test('returns correct description with precision 2', () => {
  const obj = {
    type: 'Sprite',
    name: 'spriteObject',
    visible: true,
    x: 10.123,
    y: 20.456,
    depth: 5.789
  }
  const result = GetObjectDescription(obj, 2)
  expect(result).toBe('+ Sprite spriteObject (10.12, 20.46) 5.79')
})

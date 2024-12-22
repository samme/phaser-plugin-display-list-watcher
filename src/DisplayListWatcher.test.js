import EventEmitter from 'eventemitter3'
import Phaser from 'phaser'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { DisplayListWatcher } from './DisplayListWatcher.js'

vi.mock('phaser', () => {
  const Camera = vi.fn()

  Camera.prototype.setBounds = vi.fn().mockReturnThis()
  Camera.prototype.destroy = vi.fn()

  const FixedKeyControl = vi.fn()

  FixedKeyControl.prototype.update = vi.fn()

  console.log('new Camera()', new Camera())

  console.log('new FixedKeyControl()', new FixedKeyControl())

  class ScenePlugin {
    constructor(scene, pluginManager) {
      this.pluginManager = pluginManager
      this.game = pluginManager.game
      this.scene = scene
      this.systems = scene.sys
    }

    boot() {}

    destroy() {
      this.pluginManager = null
      this.game = null
      this.scene = null
      this.systems = null
    }
  }

  return {
    default: {
      Plugins: {
        ScenePlugin: ScenePlugin
      },
      Textures: {
        Events: {
          ADD_KEY: 'add-'
        }
      },
      Cache: {
        Events: {
          ADD: 'add'
        }
      },
      Scenes: {
        Events: {
          BOOT: 'boot',
          DESTROY: 'destroy',
          RENDER: 'render',
          SHUTDOWN: 'shutdown',
          START: 'start',
          UPDATE: 'update'
        }
      },
      GameObjects: {
        RetroFont: {
          Parse: vi.fn()
        }
      },
      Cameras: {
        Scene2D: {
          Camera: Camera
        },
        Controls: {
          FixedKeyControl: FixedKeyControl
        }
      }
    }
  }
})

// console.log('Phaser', Phaser)

describe('DisplayListWatcher', () => {
  test('is a function', () => {
    expect(DisplayListWatcher).toBeInstanceOf(Function)
  })

  test('prototype is an object', () => {
    expect(DisplayListWatcher.prototype).toBeInstanceOf(Object)
  })

  test('prototype.boot is a function', () => {
    expect(DisplayListWatcher.prototype.boot).toBeInstanceOf(Function)
  })

  test('prototype.destroy is a function', () => {
    expect(DisplayListWatcher.prototype.destroy).toBeInstanceOf(Function)
  })
})

describe('new DisplayListWatcher(scene, pluginManager)', () => {
  let game
  let scene
  let pluginManager

  beforeEach(() => {
    game = { plugins: null }
    pluginManager = { game }
    game.plugins = pluginManager
    scene = {
      sys: {
        cache: {
          bitmapFont: {
            events: new EventEmitter(),
            add: vi.fn(),
            exists: vi.fn().mockReturnValue(true)
          }
        },
        events: new EventEmitter(),
        input: {
          keyboard: Object.assign(new EventEmitter(), {
            addKey: vi.fn(() => new EventEmitter()),
            removeKey: vi.fn().mockReturnThis()
          })
        },
        make: {
          bitmapText: vi.fn(() => ({
            destroy: vi.fn(),
            renderCanvas: vi.fn(),
            renderWebGL: vi.fn(),
            setText: vi.fn().mockReturnThis()
          }))
        },
        renderer: { type: Phaser.WEBGL },
        scale: { width: 1024, height: 768 },
        settings: { key: 'testScene', isBooted: false },
        textures: Object.assign(new EventEmitter(), {
          addBase64: vi.fn().mockReturnThis(),
          exists: vi.fn().mockReturnValue(true)
        })
      }
    }

    expect(game).toBeInstanceOf(Object)
    expect(game.plugins).toBeInstanceOf(Object)
    expect(pluginManager).toBeInstanceOf(Object)
    expect(pluginManager.game).toBeInstanceOf(Object)
  })

  afterEach(() => {
    scene = undefined
    pluginManager = undefined
  })

  test('is an object', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin).toBeInstanceOf(Object)
  })

  test('has `scene` object', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.scene).toBeInstanceOf(Object)
  })

  test('has `systems` object', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.systems).toBeInstanceOf(Object)
  })

  test('has `pluginManager` object', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.pluginManager).toBeInstanceOf(Object)
  })

  test('has `game` object', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.game).toBeInstanceOf(Object)
  })

  test('camera is null', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.camera).toBeNull()
  })

  test('controls is null', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.controls).toBeNull()
  })

  test('hideKey is null', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.hideKey).toBeNull()
  })

  test('modKey is null', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.modKey).toBeNull()
  })

  test('resetKey is null', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.resetKey).toBeNull()
  })

  test('showKey is null', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.showKey).toBeNull()
  })

  test('text is null', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.text).toBeNull()
  })

  test('toggleKey is null', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    expect(plugin.toggleKey).toBeNull()
  })

  test('boot and destroy', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    plugin.boot()
    plugin.destroy()

    expect(plugin.camera).toBeNull()
    expect(plugin.controls).toBeNull()
    expect(plugin.hideKey).toBeNull()
    expect(plugin.modKey).toBeNull()
    expect(plugin.resetKey).toBeNull()
    expect(plugin.showKey).toBeNull()
    expect(plugin.text).toBeNull()
    expect(plugin.toggleKey).toBeNull()

    expect(plugin.scene).toBeNull()
    expect(plugin.systems).toBeNull()
    expect(plugin.pluginManager).toBeNull()
    expect(plugin.game).toBeNull()
  })

  test('boot, (start, update, render, stop), destroy', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    plugin.boot()

    plugin.start()
    plugin.update()
    plugin.render()
    plugin.update()
    plugin.render()
    plugin.stop()

    plugin.start()
    plugin.update()
    plugin.render()
    plugin.update()
    plugin.render()
    plugin.stop()

    plugin.destroy()
  })

  test('boot() calls start() if the scene has already booted', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const startSpy = vi.spyOn(plugin, 'start')

    scene.sys.settings.key = 'bootedScene'
    scene.sys.settings.isBooted = true

    plugin.boot()

    expect(startSpy).toHaveBeenCalledTimes(1)
  })

  test('boot() does not call start() if the scene has not booted', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const startSpy = vi.spyOn(plugin, 'start')

    scene.sys.settings.key = 'unbootedScene'
    scene.sys.settings.isBooted = false

    plugin.boot()

    expect(startSpy).not.toHaveBeenCalled()
  })

  test('after boot(), scene START event causes plugin start()', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const startSpy = vi.spyOn(plugin, 'start')

    plugin.boot()
    plugin.systems.events.emit(Phaser.Scenes.Events.START)

    expect(startSpy).toHaveBeenCalledTimes(1)
  })

  test('after boot(), scene SHUTDOWN event causes plugin stop()', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const stopSpy = vi.spyOn(plugin, 'stop')

    plugin.boot()
    plugin.systems.events.emit(Phaser.Scenes.Events.SHUTDOWN)

    expect(stopSpy).toHaveBeenCalledTimes(1)
  })

  test('after boot(), scene DESTROY event causes plugin destroy()', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const destroySpy = vi.spyOn(plugin, 'destroy')

    plugin.boot()
    plugin.systems.events.emit(Phaser.Scenes.Events.DESTROY)

    expect(destroySpy).toHaveBeenCalledTimes(1)
  })

  test('after boot() and start(), scene UPDATE event causes plugin update()', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const updateSpy = vi.spyOn(plugin, 'update')

    plugin.boot()
    plugin.start()
    plugin.systems.events.emit(Phaser.Scenes.Events.UPDATE)

    expect(updateSpy).toHaveBeenCalledTimes(1)
  })

  test('after boot() and start(), scene RENDER event causes plugin render()', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const renderSpy = vi.spyOn(plugin, 'render')

    plugin.boot()
    plugin.start()
    plugin.systems.events.emit(Phaser.Scenes.Events.RENDER)

    expect(renderSpy).toHaveBeenCalledTimes(1)
  })
})

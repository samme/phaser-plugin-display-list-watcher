import EventEmitter from 'eventemitter3'
import Phaser from 'phaser'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { DisplayListWatcher } from './DisplayListWatcher.js'

vi.mock('phaser', () => {
  const Camera = vi.fn()

  Camera.prototype.setBounds = vi.fn().mockReturnThis()
  Camera.prototype.setRoundPixels = vi.fn().mockReturnThis()
  Camera.prototype.preRender = vi.fn().mockReturnThis()
  Camera.prototype.destroy = vi.fn()

  const FixedKeyControl = vi.fn()

  FixedKeyControl.prototype.update = vi.fn()

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
      Core: {
        Events: {
          POST_RENDER: 'postrender'
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
      },
      Input: {
        Keyboard: {
          Events: {
            ANY_KEY_DOWN: 'keydown',
            ANY_KEY_UP: 'keyup',
            COMBO_MATCH: 'keycombomatch',
            DOWN: 'down',
            KEY_DOWN: 'keydown-',
            KEY_UP: 'keyup-',
            UP: 'up'
          },
          KeyCodes: {
            A: 65,
            ALT: 18,
            B: 66,
            BACK_SLASH: 220,
            BACKSPACE: 8,
            BACKTICK: 192,
            BRACKET_LEFT_FIREFOX: 175,
            BRACKET_RIGHT_FIREFOX: 174,
            C: 67,
            CAPS_LOCK: 20,
            CLOSED_BRACKET: 221,
            COLON: 58,
            COMMA_FIREFOX_WINDOWS: 60,
            COMMA_FIREFOX: 62,
            COMMA: 188,
            CTRL: 17,
            D: 68,
            DELETE: 46,
            DOWN: 40,
            E: 69,
            EIGHT: 56,
            END: 35,
            ENTER: 13,
            ESC: 27,
            F: 70,
            F1: 112,
            F10: 121,
            F11: 122,
            F12: 123,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            FIVE: 53,
            FORWARD_SLASH: 191,
            FOUR: 52,
            G: 71,
            H: 72,
            HOME: 36,
            I: 73,
            INSERT: 45,
            J: 74,
            K: 75,
            L: 76,
            LEFT: 37,
            M: 77,
            MINUS: 189,
            N: 78,
            NINE: 57,
            NUMPAD_ADD: 107,
            NUMPAD_EIGHT: 104,
            NUMPAD_FIVE: 101,
            NUMPAD_FOUR: 100,
            NUMPAD_NINE: 105,
            NUMPAD_ONE: 97,
            NUMPAD_SEVEN: 103,
            NUMPAD_SIX: 102,
            NUMPAD_SUBTRACT: 109,
            NUMPAD_THREE: 99,
            NUMPAD_TWO: 98,
            NUMPAD_ZERO: 96,
            O: 79,
            ONE: 49,
            OPEN_BRACKET: 219,
            P: 80,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PAUSE: 19,
            PERIOD: 190,
            PLUS: 187,
            PRINT_SCREEN: 42,
            Q: 81,
            QUOTES: 222,
            R: 82,
            RIGHT: 39,
            S: 83,
            SEMICOLON_FIREFOX: 59,
            SEMICOLON: 186,
            SEVEN: 55,
            SHIFT: 16,
            SIX: 54,
            SPACE: 32,
            T: 84,
            TAB: 9,
            THREE: 51,
            TWO: 50,
            U: 85,
            UP: 38,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            ZERO: 48
          }
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
    game = { events: new EventEmitter(), plugins: null }
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
        displayList: {
          list: []
        },
        events: new EventEmitter(),
        input: Object.assign(new EventEmitter(), {
          keyboard: Object.assign(new EventEmitter(), {
            addKey: vi.fn(() => new EventEmitter()),
            removeKey: vi.fn().mockReturnThis()
          })
        }),
        make: {
          bitmapText: vi.fn(() => ({
            height: 1,
            visible: true,
            destroy: vi.fn(),
            renderCanvas: vi.fn(),
            renderWebGL: vi.fn(),
            setPosition: vi.fn().mockReturnThis(),
            setText: vi.fn().mockReturnThis()
          }))
        },
        renderer: { type: Phaser.WEBGL },
        scale: { width: 1024, height: 768 },
        scenePlugin: { getIndex: () => 0 },
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

  test('modKey is null', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.modKey).toBeNull()
  })

  test('text is null', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    expect(plugin.text).toBeNull()
  })

  test('boot and destroy', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)

    plugin.boot()
    plugin.destroy()

    expect(plugin.camera).toBeNull()
    expect(plugin.controls).toBeNull()
    expect(plugin.modKey).toBeNull()
    expect(plugin.text).toBeNull()

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

  test('no keyboard: boot, (start, render, stop), destroy', () => {
    scene.sys.input.keyboard = null

    const plugin = new DisplayListWatcher(scene, pluginManager)

    plugin.boot()

    plugin.start()
    plugin.render()
    plugin.render()
    plugin.stop()

    plugin.start()
    plugin.render()
    plugin.render()
    plugin.stop()

    plugin.destroy()
  })

  test('no input: boot, (start, render, stop), destroy', () => {
    scene.sys.input = null

    const plugin = new DisplayListWatcher(scene, pluginManager)

    plugin.boot()

    plugin.start()
    plugin.render()
    plugin.render()
    plugin.stop()

    plugin.start()
    plugin.render()
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

  test('after boot() and start(), game POST_RENDER event causes plugin render()', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const renderSpy = vi.spyOn(plugin, 'render')

    plugin.boot()
    plugin.start()

    game.events.emit(Phaser.Core.Events.POST_RENDER)

    expect(renderSpy).toHaveBeenCalledTimes(1)
  })

  test('after boot(), start(), stop(), scene UPDATE event does not cause plugin update()', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const updateSpy = vi.spyOn(plugin, 'update')

    plugin.boot()
    plugin.start()
    plugin.stop()
    plugin.systems.events.emit(Phaser.Scenes.Events.UPDATE)

    expect(updateSpy).not.toHaveBeenCalled()
  })

  test('after boot(), start(), stop(), game POST_RENDER event does not cause plugin render()', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const renderSpy = vi.spyOn(plugin, 'render')

    plugin.boot()
    plugin.start()
    plugin.stop()

    game.events.emit(Phaser.Core.Events.POST_RENDER)

    expect(renderSpy).not.toHaveBeenCalled()
  })

  test('after boot() and destroy(), scene START event does not cause plugin start()', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const startSpy = vi.spyOn(plugin, 'start')

    plugin.boot()
    plugin.destroy()

    scene.sys.events.emit(Phaser.Scenes.Events.START)

    expect(startSpy).not.toHaveBeenCalled()
  })

  test('after boot() and destroy(), scene SHUTDOWN event does not cause plugin stop()', () => {
    const plugin = new DisplayListWatcher(scene, pluginManager)
    const stopSpy = vi.spyOn(plugin, 'stop')

    plugin.boot()
    plugin.destroy()

    // stop() is called once by destroy() already.
    expect(stopSpy).toHaveBeenCalledOnce()

    scene.sys.events.emit(Phaser.Scenes.Events.SHUTDOWN)

    expect(stopSpy).toHaveBeenCalledOnce()
  })
})

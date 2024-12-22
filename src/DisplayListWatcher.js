import Phaser from 'phaser'
import fontData from '/proggy_clean_inv.json'
import fontImage from '/proggy_clean_inv.png'
import WalkDisplayListObj from './WalkDisplayListObject'

const { POSITIVE_INFINITY } = Number
const TextureEvents = Phaser.Textures.Events
const CacheEvents = Phaser.Cache.Events
const SceneEvents = Phaser.Scenes.Events
const ParseRetroFont = Phaser.GameObjects.RetroFont.Parse
const fontTextureKey = fontData.image
const fontKey = fontData.image

let hasPendingFontImage = false

export class DisplayListWatcher extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager)

    this.camera = null
    this.controls = null
    this.hideKey = null
    this.modKey = null
    this.resetKey = null
    this.showKey = null
    this.text = null
    this.toggleKey = null
  }

  boot() {
    const { cache, events, settings, textures } = this.systems

    console.debug('boot', settings.key)

    if (!hasPendingFontImage && !textures.exists(fontTextureKey)) {
      hasPendingFontImage = true

      console.debug('addBase64', fontKey, fontImage)

      textures.addBase64(fontKey, fontImage)
    }

    textures.once(`${TextureEvents.ADD_KEY}${fontTextureKey}`, () => {
      console.debug('add bitmapFont', fontKey, fontData)

      cache.bitmapFont.add(fontKey, ParseRetroFont(this.scene, fontData))
    })

    if (settings.key === '__SYSTEM') {
      console.debug('leave system scene')

      return
    }

    events.on(SceneEvents.START, this.start, this)
    events.on(SceneEvents.SHUTDOWN, this.stop, this)
    events.on(SceneEvents.DESTROY, this.destroy, this)

    console.debug('isBooted', settings.isBooted)

    if (settings.isBooted) {
      this.start()
    }
  }

  startIfFontWasAdded(cache, key) {
    if (key !== fontKey) {
      return
    }

    cache.events.off(CacheEvents.ADD, this.startIfFontWasAdded, this)

    this.start()
  }

  start() {
    const { cache, events, make, renderer } = this.systems
    const fontCache = cache.bitmapFont
    const { keyboard } = this.systems.input
    const { width, height } = this.systems.scale

    console.debug('start', this.systems.settings.key)

    if (!fontCache.exists(fontKey)) {
      console.debug('abort start, wait for fontCache')

      fontCache.events.on(CacheEvents.ADD, this.startIfFontWasAdded, this)

      return
    }

    events.on(SceneEvents.UPDATE, this.update, this)
    events.on(SceneEvents.RENDER, this.render, this)

    this.camera = new Phaser.Cameras.Scene2D.Camera(
      0,
      0,
      width,
      height
    ).setBounds(0, 0, POSITIVE_INFINITY, POSITIVE_INFINITY)

    this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: this.camera,
      up: keyboard.addKey('UP'),
      down: keyboard.addKey('DOWN'),
      left: keyboard.addKey('LEFT'),
      right: keyboard.addKey('RIGHT'),
      speed: 1
    })

    this.modKey = keyboard.addKey('SHIFT')
    this.toggleKey = keyboard.addKey('Z')
    this.showKey = keyboard.addKey('X')
    this.hideKey = keyboard.addKey('C')
    this.resetKey = keyboard.addKey('V')

    this.toggleKey.on('down', (_key, event) => {
      if (event.shiftKey) {
        this.toggle()
      }
    })
    this.showKey.on('down', (_key, event) => {
      if (event.shiftKey) {
        this.show()
      }
    })
    this.hideKey.on('down', (_key, event) => {
      if (event.shiftKey) {
        this.hide()
      }
    })
    this.resetKey.on('down', (_key, event) => {
      if (event.shiftKey) {
        this.resetCamera()
      }
    })

    console.debug('controls', this.controls)

    // this.background = this.systems.add.rectangle(0, 0, width, height, 0, 0.5);

    this.text = make.bitmapText({ font: fontKey }, false)

    this.renderText =
      renderer.type === Phaser.WEBGL
        ? this.text.renderWebGL
        : this.text.renderCanvas
  }

  stop() {
    const { cache, events, input, settings } = this.systems
    const { keyboard } = input

    console.debug('stop', settings.key, settings.state)

    cache.bitmapFont.events.off(CacheEvents.ADD, this.startIfFontWasAdded, this)

    events.off(SceneEvents.UPDATE, this.update, this)
    events.off(SceneEvents.RENDER, this.render, this)

    keyboard.removeKey(this.hideKey, true)
    keyboard.removeKey(this.modKey, true)
    keyboard.removeKey(this.resetKey, true)
    keyboard.removeKey(this.showKey, true)
    keyboard.removeKey(this.toggleKey, true)

    if (this.camera) {
      this.camera.destroy()
    }

    if (this.controls) {
      const { left, right, up, down } = this.controls

      keyboard.removeKey(left)
      keyboard.removeKey(right)
      keyboard.removeKey(up)
      keyboard.removeKey(down)
    }

    if (this.text) {
      this.text.destroy()
    }

    this.camera = null
    this.controls = null
    this.hideKey = null
    this.modKey = null
    this.resetKey = null
    this.showKey = null
    this.toggleKey = null
  }

  update(_time, delta) {
    if (this.modKey.isDown) {
      this.controls.update(delta)
    }
  }

  render() {
    if (!this.text.visible) {
      return
    }

    const { displayList, renderer, scenePlugin, settings } = this.systems
    const x = 256 * scenePlugin.getIndex(this.scene)
    const y = 0

    const output = WalkDisplayListObj(
      {
        name: settings.key,
        type: 'DisplayList',
        list: displayList.list
      },
      [],
      0
    )

    this.text.setPosition(x, y).setText(output)

    this.camera.preRender()

    this.renderText(renderer, this.text, this.camera)
  }

  destroy() {
    // TODO
    this.stop()

    this.pluginManager = null
    this.game = null
    this.scene = null
    this.systems = null
  }

  hide() {
    this.text.visible = false
  }

  show() {
    this.text.visible = true
  }

  toggle() {
    this.text.visible = !this.text.visible
  }

  resetCamera() {
    this.camera.setScroll(0, 0)
  }
}

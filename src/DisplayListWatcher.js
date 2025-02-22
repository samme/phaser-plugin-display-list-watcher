import Phaser from 'phaser'
import fontData from './proggy_clean_inv'
import fontImage from './proggy_clean_inv.png'
import WalkDisplayListObj from './WalkDisplayListObject'

const { POSITIVE_INFINITY } = Number
const TextureEvents = Phaser.Textures.Events
const CacheEvents = Phaser.Cache.Events
const KeyboardEvents = Phaser.Input.Keyboard.Events
const SceneEvents = Phaser.Scenes.Events
const { KeyCodes } = Phaser.Input.Keyboard
const ParseRetroFont = Phaser.GameObjects.RetroFont.Parse
const fontTextureKey = fontData.image
const fontKey = fontData.image

export class DisplayListWatcher extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager)

    this.camera = null
    this.controls = null
    this.modKey = null
    this.text = null
  }

  boot() {
    const { cache, events, settings, textures } = this.systems

    console.debug('boot', settings.key)

    if (!textures.exists(fontTextureKey)) {
      this.addImage(fontKey, fontImage)
    }

    textures.once(`${TextureEvents.ADD_KEY}${fontTextureKey}`, () => {
      console.debug('font texture added', fontTextureKey)

      if (cache.bitmapFont.has(fontKey)) {
        console.debug('font already in cache, exit', fontKey)

        return
      }

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

  // For Phaser v3.87. Avoids errors from duplicate keys.

  addImage(key, url) {
    const { textures } = this.systems

    if (textures.exists(key)) {
      console.debug('texture exists already, exit', key)
    }

    const image = new Image()

    image.onload = function onload() {
      image.onload = null

      if (textures.exists(key)) {
        console.debug('texture exists already, exit', key)

        return
      }

      console.debug('addImage', key, image)

      textures.addImage(key, image)
    }

    image.src = url

    console.debug('new image', image)
  }

  onFontCacheAdded(cache, key) {
    if (key !== fontKey) {
      return
    }

    cache.events.off(CacheEvents.ADD, this.onFontCacheAdded, this)

    this.start()
  }

  start() {
    const { cache, events, input, make, renderer } = this.systems
    const fontCache = cache.bitmapFont
    const keyboard = input?.keyboard
    const { width, height } = this.systems.scale

    console.debug('start', this.systems.settings.key)

    if (!fontCache.exists(fontKey)) {
      console.debug('abort start, wait for fontCache')

      fontCache.events.on(CacheEvents.ADD, this.onFontCacheAdded, this)

      return
    }

    events.on(SceneEvents.RENDER, this.render, this)

    this.camera = new Phaser.Cameras.Scene2D.Camera(0, 0, width, height)
      .setBounds(0, 0, POSITIVE_INFINITY, POSITIVE_INFINITY)
      .setRoundPixels(true)

    if (keyboard) {
      events.on(SceneEvents.UPDATE, this.update, this)

      this.addKeyboardControls(keyboard)
    }

    // this.background = this.systems.add.rectangle(0, 0, width, height, 0, 0.5);

    this.text = make.bitmapText({ font: fontKey }, false)

    this.renderText =
      renderer.type === Phaser.WEBGL
        ? this.text.renderWebGL
        : this.text.renderCanvas
  }

  stop() {
    const { cache, events, input, settings } = this.systems
    const keyboard = input?.keyboard

    console.debug('stop', settings.key, settings.state)

    cache.bitmapFont.events.off(CacheEvents.ADD, this.onFontCacheAdded, this)

    events.off(SceneEvents.UPDATE, this.update, this)
    events.off(SceneEvents.RENDER, this.render, this)

    if (keyboard) {
      keyboard.off(KeyboardEvents.ANY_KEY_DOWN, this.onAnyKeyDown, this)
    }

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
    this.modKey = null
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

    this.camera.setBounds(0, 0, POSITIVE_INFINITY, this.text.height)
    this.camera.preRender()

    this.renderText(renderer, this.text, this.camera)
  }

  destroy() {
    this.stop()

    this.systems.events
      .off(SceneEvents.START, this.start, this)
      .off(SceneEvents.SHUTDOWN, this.stop, this)
      .off(SceneEvents.DESTROY, this.destroy, this)

    this.pluginManager = null
    this.game = null
    this.scene = null
    this.systems = null
  }

  onAnyKeyDown(event) {
    if (!this.modKey.isDown) return

    const method = this.keyMap[event.keyCode]

    if (!method) return

    console.debug(event.keyCode, method.name)

    method.call(this)
  }

  addKeyboardControls(keyboard) {
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: this.camera,
      up: keyboard.addKey(KeyCodes.UP),
      down: keyboard.addKey(KeyCodes.DOWN),
      left: keyboard.addKey(KeyCodes.LEFT),
      right: keyboard.addKey(KeyCodes.RIGHT),
      speed: 1
    })

    console.debug('controls', this.controls)

    this.modKey = keyboard.addKey(KeyCodes.SHIFT)

    keyboard.on(KeyboardEvents.ANY_KEY_DOWN, this.onAnyKeyDown, this)
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

  pageUp() {
    this.camera.scrollY -= this.camera.height
  }

  pageDown() {
    this.camera.scrollY += this.camera.height
  }

  pageStart() {
    this.camera.scrollY = 0
  }

  pageEnd() {
    this.camera.scrollY = POSITIVE_INFINITY
  }
}

const proto = DisplayListWatcher.prototype

proto.keyMap = {
  [KeyCodes.C]: proto.hide,
  [KeyCodes.END]: proto.pageEnd,
  [KeyCodes.HOME]: proto.pageStart,
  [KeyCodes.PAGE_DOWN]: proto.pageDown,
  [KeyCodes.PAGE_UP]: proto.pageUp,
  [KeyCodes.V]: proto.resetCamera,
  [KeyCodes.X]: proto.show,
  [KeyCodes.Z]: proto.toggle
}

console.log(proto.keyMap)

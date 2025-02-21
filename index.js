import Phaser from 'phaser'
import DisplayListWatcher from './src/main'

function stringToColor(str) {
  let hash = 5381

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }

  return hash >>> (0 % 0xffffff)
}

class Example extends Phaser.Scene {
  init() {
    this.cameras
      .add(512, 384, 512, 384)
      .setAngle(45)
      .setAlpha(0.5)
      .setBackgroundColor(stringToColor(this.sys.settings.key))
      .centerOn(0, 0)
  }

  preload() {}

  create() {
    this.add.blitter(0, 0, '__DEFAULT').create(0, 0)
    this.add.container(0, 0, [this.add.container(0, 0, this.add.container())])
    this.add.layer([this.add.layer(this.add.layer())])
    this.add.particles(0, 0, '__DEFAULT')
    this.add.zone(0, 0, 1, 1)
    this.add.text(0, 0, '👀', { font: '72px sans-serif' }).setName('eyes')

    for (let i = 0; i < 1000; i++) {
      this.add.zone(2 * i, 2 * i)
    }
  }
}

new Phaser.Game({
  // type: Phaser.CANVAS,
  plugins: {
    scene: [
      {
        key: 'DisplayListWatcher',
        plugin: DisplayListWatcher,
        start: true
      }
    ]
  },
  scene: [
    new Example({ key: '1 active', active: true }),
    new Example({ key: '2 active', active: true }),
    new Example({ key: '3 inactive', active: false }),
    new Example({ key: '4 active', active: true }),
    new Example({
      key: '5 no other plugins',
      active: true,
      plugins: ['DisplayListWatcher']
    }),
    new Example({ key: '6 active', active: true })
  ]
})

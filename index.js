import Phaser from 'phaser'
import DisplayListWatcher from './src/main'

class Example extends Phaser.Scene {
  preload() {}

  create() {
    this.add.blitter(0, 0, '__DEFAULT').create(0, 0)
    this.add.container(0, 0, [this.add.container(0, 0, this.add.container())])
    this.add.layer([this.add.layer(this.add.layer())])
    this.add.particles(0, 0, '__DEFAULT')
    this.add.zone(0, 0, 1, 1)
  }
}

new Phaser.Game({
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
    })
  ]
})

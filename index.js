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
    new Example({ key: 'example1', active: true }),
    new Example({ key: 'example2', active: true }),
    new Example({ key: 'example3', active: false }),
    new Example({ key: 'example4', active: true })
  ]
})

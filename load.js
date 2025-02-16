import 'mocha/mocha.js'
import { assert } from 'chai'
import Phaser from 'phaser'

const { mocha, Mocha } = window

mocha.setup('bdd')

const { describe: context, test, before, after, beforeEach, afterEach } = Mocha

context('Phaser', () => {
  test('is an object', () => {
    assert.isObject(Phaser)
  })

  test('is the required version', () => {
    assert.propertyVal(Phaser, 'VERSION', '3.87')
  })
})

context('load.scenePlugin()', () => {
  let game

  beforeEach((done) => {
    game = new Phaser.Game({
      callbacks: {
        postBoot: () => {
          done()
        }
      }
    })
  })

  afterEach((done) => {
    // biome-ignore lint/performance/noDelete: deglobalize
    delete window.DisplayListWatcher

    game.events.once('destroy', () => {
      game = null
      done()
    })
    game.destroy(true)
  })

  test('load.scenePlugin("DisplayListWatcher", "dist/display-list-watcher.umd.js") adds the plugin class to the plugin manager', (done) => {
    const scene = game.scene.systemScene

    scene.load
      .scenePlugin('DisplayListWatcher', 'dist/display-list-watcher.umd.js')
      .start()

    scene.load.once('complete', (loader, totalComplete, totalFailed) => {
      assert.strictEqual(totalComplete, 1)

      assert.strictEqual(totalFailed, 0)

      assert.property(window, 'DisplayListWatcher')

      assert.isFunction(window.DisplayListWatcher)

      assert.include(game.plugins.scenePlugins, 'DisplayListWatcher')

      done()
    })
  })
})

mocha.globals(['Phaser', 'DisplayListWatcher'])
mocha.checkLeaks()
mocha.run()

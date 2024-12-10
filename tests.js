import 'mocha/mocha.js'
import { assert } from 'chai'
import Phaser from 'phaser'
import DisplayListWatcher from './src/main'

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

context('DisplayListWatcher', () => {
  test('is a function', () => {
    assert.isFunction(DisplayListWatcher)
  })
})

for (const config of [{ type: Phaser.CANVAS }, { type: Phaser.WEBGL }]) {
  context(`Add the plugin to the game (${JSON.stringify(config)})`, () => {
    let game

    test('With `plugins.scene`, the plugin class is in the plugin manager', (done) => {
      game = new Phaser.Game({
        ...config,
        plugins: {
          scene: [
            {
              key: 'DisplayListWatcher',
              plugin: DisplayListWatcher,
              start: true
            }
          ]
        },
        callbacks: {
          preBoot: (game) => {
            console.debug('preBoot')
          },
          postBoot: (game) => {
            console.debug('postBoot')

            assert.include(game.plugins.scenePlugins, 'DisplayListWatcher')

            done()
          }
        }
      })
    })
  })
}

mocha.checkLeaks()
mocha.globals(['Phaser'])
mocha.run()

import 'mocha/mocha.js'
import { assert } from 'chai'
import Phaser from 'phaser'

import './dist/display-list-watcher.umd.js'

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

context('window', () => {
  test('has DisplayListWatcher', () => {
    assert.property(window, 'DisplayListWatcher')
  })

  test('DisplayListWatcher is a function', () => {
    assert.isFunction(window.DisplayListWatcher)
  })
})

context('DisplayListWatcher', () => {
  test('is a function', () => {
    // biome-ignore lint/correctness/noUndeclaredVariables: global
    assert.isFunction(DisplayListWatcher)
  })

  test('extends Phaser.Plugins.ScenePlugin', () => {
    assert.strictEqual(
      // biome-ignore lint/correctness/noUndeclaredVariables: global
      Object.getPrototypeOf(DisplayListWatcher.prototype),
      Phaser.Plugins.ScenePlugin.prototype
    )
  })

  test('has prototype.boot() function', () => {
    // biome-ignore lint/correctness/noUndeclaredVariables: global
    assert.isFunction(DisplayListWatcher.prototype.boot)
  })
})

mocha.checkLeaks()
mocha.globals(['Phaser', 'DisplayListWatcher'])
mocha.run()

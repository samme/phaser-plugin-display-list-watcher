import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import packageJson from './package.json'

describe('package.json paths', () => {
  test('main field should have a valid path', () => {
    expect(fs.existsSync(packageJson.main), packageJson.main).toBe(true)
  })

  test('module field should have a valid path', () => {
    expect(fs.existsSync(packageJson.module), packageJson.module).toBe(true)
  })

  test('files field should have valid paths', () => {
    for (const file of packageJson.files) {
      expect(fs.existsSync(file), file).toBe(true)
    }
  })
})

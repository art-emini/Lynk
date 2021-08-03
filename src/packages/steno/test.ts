import { strictEqual as equal } from 'assert'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import { Writer } from './index.js'

export async function testSteno(): Promise<void> {
  const max = 1000
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'steno-test-'))
  const file = path.join(dir, 'tmp.txt')

  const writer = new Writer(file)
  const promises = []

  // Test race condition
  for (let i = 1; i <= max; ++i) {
    promises.push(writer.write(String(i)))
  }

  // All promises should resolve
  await Promise.all(promises)
  equal(parseInt(fs.readFileSync(file, 'utf-8')), max)
}

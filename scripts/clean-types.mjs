import { rmSync } from 'node:fs'

rmSync('dist/types', { recursive: true, force: true })

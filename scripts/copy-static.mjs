import { cpSync } from 'node:fs'
cpSync('public/static', 'build', { recursive: true })
cpSync('public/bages/App-Store-Badge.svg', 'build/App-Store-Badge.svg')

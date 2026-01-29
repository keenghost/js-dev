import child_process from 'node:child_process'
import fs from 'node:fs'

fs.rmSync('dist', { recursive: true, force: true })

child_process.execSync('pnpm tsc', { stdio: 'inherit' })
fs.cpSync('packages/tsconfig', 'dist/packages/tsconfig', { recursive: true })

const pick_keys = [
  'name',
  'version',
  'description',
  'keywords',
  'author',
  'license',
  'repository',
  'publishConfig',
  'type',
  'exports',
  'files',
  'dependencies',
  'peerDependencies',
  'peerDependenciesMeta',
]
const packagejson = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf-8' }))
const newpackagejson = {}

for (const key in packagejson) {
  if (pick_keys.includes(key)) {
    newpackagejson[key] = packagejson[key]
  }
}

fs.writeFileSync('dist/package.json', JSON.stringify(newpackagejson, null, 2))
fs.copyFileSync('LICENSE', 'dist/LICENSE')
fs.copyFileSync('README.md', 'dist/README.md')

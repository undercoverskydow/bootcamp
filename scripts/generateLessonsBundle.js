const fs = require('fs')
const path = require('path')

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function scanContent(root) {
  const out = {}
  if (!fs.existsSync(root)) return out

  const instructors = fs.readdirSync(root).filter((d) => fs.statSync(path.join(root, d)).isDirectory())
  for (const instr of instructors) {
    out[instr] = out[instr] || { beginner: [], intermediate: [], advanced: [] }
    const instrPath = path.join(root, instr)
    const levels = fs.readdirSync(instrPath).filter((d) => fs.statSync(path.join(instrPath, d)).isDirectory())
    for (const level of levels) {
      const levelPath = path.join(instrPath, level)
      const files = fs.readdirSync(levelPath).filter((f) => f.endsWith('.json')).sort()
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(levelPath, file), 'utf8')
          const data = JSON.parse(content)
          out[instr][level] = out[instr][level] || []
          out[instr][level].push(data)
        } catch (e) {
          console.warn('Failed to read', file, e.message)
        }
      }
    }
  }

  return out
}

function main() {
  const contentRoot = path.join(__dirname, '..', 'content')
  const outPath = path.join(__dirname, '..', 'src', 'data', 'lessons.bundle.json')
  const bundle = scanContent(contentRoot)
  fs.writeFileSync(outPath, JSON.stringify(bundle, null, 2), 'utf8')
  console.log('Wrote lesson bundle to', outPath)
}

if (require.main === module) main()

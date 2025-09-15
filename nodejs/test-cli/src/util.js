import fs from 'fs'

export const checkPath = path => {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new Error('Invalid path: Path must be a non-empty string.')
  }

  if (fs.existsSync(path)) {
    return true
  } else {
    return false
  }
}

import { marked } from 'marked'
import fs from 'fs'

const markdown = fs.readFileSync('README.md', 'utf-8')
const html = marked.parse(markdown)
console.log(html)

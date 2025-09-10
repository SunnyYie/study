import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

export function WatermarkPlugin() {
  return {
    name: 'vite-watermark-plugin',
    async transform(code: string, id: string) {
      if (!id.match(/\.(png|jpg|jpeg|webp)$/)) {
        return null
      }

      try {
        const imageBuffer = await fs.readFileSync(id)
        const image = sharp(imageBuffer)
        const metaData = await image.metadata()

        const svgText = `<svg width="${metaData.width}" height="${metaData.height}">
          <text x="50%" y="50%" font-size="20" fill="rgba(255, 255, 255, 0.5)" font-family="Arial, sans-serif" dominant-baseline="middle" text-anchor="middle">Watermark</text>
        </svg>`

        const processdImage = await image.composite([{ input: Buffer.from(svgText), gravity: 'center' }]).toBuffer()

        const base64Image = processdImage.toString('base64')
        return `export default "data:image/${path.extname(id).slice(1)};base64,${base64Image}"`
      } catch (error) {}
    },
  }
}

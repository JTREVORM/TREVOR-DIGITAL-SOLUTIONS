/**
 * Generate square app icons from the official TDS logo.
 *
 * The logo file is a 1536x1024 presentation lockup. Used directly as a
 * favicon it is both the wrong shape (browsers squash or letterbox it) and
 * absurdly heavy for the job (1.8 MB for something drawn at 32 px).
 *
 * This takes a square window centred on the TDS monogram — measured region
 * x 415-1131, y 229-603 — and scales it down uniformly. Nothing is redrawn,
 * recoloured or stretched: it is the existing artwork, at its own aspect
 * ratio, on its own background. The standard "mark vs lockup" distinction.
 *
 *   node scripts/make-icons.mjs
 */

import sharp from "sharp"
import { resolve } from "node:path"

const SOURCE = resolve(process.cwd(), "public/logo.png")

/**
 * The monogram is wide and short (716 x 374), so a square window big enough
 * for its width would reach down into the "TREVOR" wordmark below it and clip
 * the lettering. Instead the mark is extracted on its own with a small margin
 * and then letterboxed onto the brand's navy — padding, never stretching.
 */
const MARK = { left: 385, top: 199, width: 776, height: 426 }

/** #050a15 — sampled from the logo's own background. */
const BRAND_NAVY = { r: 5, g: 10, b: 21 }

const OUTPUTS = [
  { file: "src/app/icon.png", size: 512, label: "favicon / PWA icon" },
  { file: "src/app/apple-icon.png", size: 180, label: "Apple touch icon" },
  { file: "public/og-image.png", size: null, label: "Open Graph image" },
]

const meta = await sharp(SOURCE).metadata()
console.log(`source: ${meta.width}x${meta.height}`)

if (
  MARK.left < 0 ||
  MARK.top < 0 ||
  MARK.left + MARK.width > (meta.width ?? 0) ||
  MARK.top + MARK.height > (meta.height ?? 0)
) {
  console.error("Crop window falls outside the image. Aborting.")
  process.exit(1)
}

for (const out of OUTPUTS) {
  const path = resolve(process.cwd(), out.file)

  if (out.file.includes("og-image")) {
    // Open Graph wants 1200x630. The full lockup is preserved and letterboxed
    // onto the brand's own navy, so nothing is cropped or distorted.
    await sharp(SOURCE)
      .resize(1200, 630, { fit: "contain", background: BRAND_NAVY })
      .png({ compressionLevel: 9 })
      .toFile(path)
  } else {
    await sharp(SOURCE)
      .extract(MARK)
      // `contain` pads to square; it never crops the mark or changes its
      // proportions.
      .resize(out.size, out.size, { fit: "contain", background: BRAND_NAVY })
      .png({ compressionLevel: 9 })
      .toFile(path)
  }

  const info = await sharp(path).metadata()
  const kb = Math.round((await sharp(path).toBuffer()).length / 1024)
  console.log(`${out.file.padEnd(26)} ${info.width}x${info.height}  ${kb} KB  (${out.label})`)
}

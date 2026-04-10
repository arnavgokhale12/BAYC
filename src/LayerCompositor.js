/**
 * LayerCompositor.js
 * Stacks transparent PNG trait layers onto a canvas in draw order.
 * Each layer is a 600×600 PNG served from /public/traits/{category}/{file}.
 * Images are cached in memory across renders.
 */

const imageCache = new Map();

const LAYER_ORDER = ['background', 'body', 'clothing', 'eyes', 'mouth', 'hat', 'accessory'];

/**
 * Load an image from a URL, using the module-level cache.
 * Returns a Promise<HTMLImageElement>.
 */
function loadImage(src) {
  if (imageCache.has(src)) return imageCache.get(src);

  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load trait image: ${src}`));
    img.src     = src;
  });

  imageCache.set(src, promise);
  return promise;
}

/**
 * Build the URL for a trait file.
 * Vite serves files from /public as root-relative paths.
 */
function traitSrc(category, file) {
  return `/traits/${category}/${file}`;
}

/**
 * Draw all trait layers onto an existing canvas context.
 * Layers are drawn in LAYER_ORDER; missing traits are silently skipped.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} size - Width and height of the canvas in pixels
 * @param {Object} traits - Map of category key → trait object (must have .file)
 */
export async function compositeLayers(ctx, size, traits) {
  ctx.clearRect(0, 0, size, size);

  for (const key of LAYER_ORDER) {
    const trait = traits[key];
    if (!trait?.file) continue;

    try {
      const img = await loadImage(traitSrc(key, trait.file));
      ctx.drawImage(img, 0, 0, size, size);
    } catch (err) {
      console.warn(`[LayerCompositor] ${err.message}`);
    }
  }
}

/**
 * Render all trait layers to a data URL string.
 * Useful for thumbnails, sharing, or caching.
 *
 * @param {Object} traits
 * @param {number} size
 * @returns {Promise<string>} data URL
 */
export async function compositeToDataURL(traits, size = 200) {
  const canvas = document.createElement('canvas');
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  await compositeLayers(ctx, size, traits);
  return canvas.toDataURL('image/png');
}

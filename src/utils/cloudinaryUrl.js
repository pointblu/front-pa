/**
 * Genera una URL de Cloudinary con transformaciones automáticas.
 * Si la URL no es de Cloudinary, la devuelve sin modificar.
 *
 * @param {string} url  - URL original de la imagen
 * @param {Object} opts
 * @param {number} [opts.width]   - Ancho deseado (ej: 400)
 * @param {string} [opts.quality] - Calidad (default: 'auto')
 * @param {string} [opts.format]  - Formato (default: 'auto')
 * @param {string} [opts.crop]    - Modo de recorte (default: 'limit')
 * @returns {string}
 */
export function getCloudinaryUrl(url, { width, quality = "auto", format = "auto", crop = "limit" } = {}) {
  if (!url || !url.includes("res.cloudinary.com")) return url ?? "";

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  const transforms = [`q_${quality}`, `f_${format}`];
  if (width) transforms.push(`w_${width}`, `c_${crop}`);

  return `${parts[0]}/upload/${transforms.join(",")}/${parts[1]}`;
}

/**
 * Genera el atributo srcSet para imágenes de Cloudinary.
 * @param {string} url
 * @param {number[]} widths - Ej: [400, 800, 1200]
 * @returns {string}
 */
export function getCloudinarySrcSet(url, widths = [400, 800, 1200]) {
  if (!url || !url.includes("res.cloudinary.com")) return "";
  return widths
    .map((w) => `${getCloudinaryUrl(url, { width: w })} ${w}w`)
    .join(", ");
}

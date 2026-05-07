/**
 * Elimina etiquetas HTML de un string y devuelve texto plano.
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html = "") {
  const el = document.createElement("div");
  el.setHTMLUnsafe(html);
  return el.textContent ?? "";
}

/**
 * Agrupa un array de episodios por número de temporada.
 * @param {Array} episodes
 * @returns {Object<number, Array>}
 */
export function groupBySeason(episodes) {
  return episodes.reduce((acc, ep) => {
    (acc[ep.season] ??= []).push(ep);
    return acc;
  }, {});
}

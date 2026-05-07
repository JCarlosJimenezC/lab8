const BASE = "https://api.tvmaze.com";

/**
 * Busca series por nombre.
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchShows(query) {
  const url = new URL(`${BASE}/search/shows`);
  url.searchParams.set("q", query);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

/**
 * Obtiene todos los episodios de una serie.
 * @param {number} showId
 * @returns {Promise<Array>}
 */
export async function getEpisodes(showId) {
  const res = await fetch(`${BASE}/shows/${showId}/episodes`);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

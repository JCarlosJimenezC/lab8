import { stripHtml } from "./utils.js";

const template       = document.querySelector("#card-template");
const resultsSection = document.querySelector("#results-section");
const resultsTitle   = document.querySelector("#results-title");
const resultsCount   = document.querySelector("#results-count");
const resultsGrid    = document.querySelector("#results-grid");

/**
 * Renderiza el grid de resultados de búsqueda.
 * @param {Array}    results   Resultados de TVMaze search
 * @param {string}   query     Término buscado
 * @param {Function} onSelect  Callback al hacer click en una tarjeta
 */
export function renderGrid(results, query, onSelect) {
  resultsGrid.replaceChildren();
  results.forEach(item => resultsGrid.append(buildCard(item.show, onSelect)));

  resultsTitle.textContent = `Resultados para "${query}"`;
  resultsCount.textContent =
    `${results.length} serie${results.length !== 1 ? "s" : ""} encontrada${results.length !== 1 ? "s" : ""}`;
  resultsSection.hidden = false;
}

export function hideResults() {
  resultsSection.hidden = true;
}

// ── Privado ───────────────────────────────────────────────

function buildCard(show, onSelect) {
  const frag = template.content.cloneNode(true);
  const card = frag.querySelector(".series-card");

  // Imagen
  const img    = card.querySelector(".card-image");
  const noImg  = card.querySelector(".card-no-image");
  const imgUrl = show.image?.medium ?? show.image?.original ?? "";
  if (imgUrl) {
    img.src = imgUrl;
    img.alt = show.name ?? "";
    noImg.hidden = true;
  } else {
    img.hidden = true;
  }

  // Título
  card.querySelector(".card-title").textContent = show.name ?? "Sin título";

  // Rating
  const ratingEl = card.querySelector(".card-rating");
  if (show.rating?.average) {
    ratingEl.textContent = `⭐ ${show.rating.average}`;
  } else {
    ratingEl.hidden = true;
  }

  // Estado
  const statusEl = card.querySelector(".card-status");
  const status   = show.status ?? "";
  statusEl.textContent = status;
  if (status === "Running")     statusEl.classList.add("running");
  else if (status === "Ended")  statusEl.classList.add("ended");
  else                          statusEl.classList.add("other");

  // Año, géneros, resumen, enlace
  card.querySelector(".card-year").textContent    = show.premiered?.slice(0, 4) ?? "";
  card.querySelector(".card-genres").textContent  = show.genres?.join(" · ") ?? "";
  card.querySelector(".card-summary").textContent = stripHtml(show.summary);

  const link  = card.querySelector(".card-link");
  link.href   = show.url ?? `https://www.tvmaze.com/shows/${show.id}`;

  // Click → abre detalle (pero no si el click es en el enlace)
  card.style.cursor = "pointer";
  card.addEventListener("click", (ev) => {
    if (!ev.target.closest(".card-link")) onSelect(show);
  });

  return card;
}

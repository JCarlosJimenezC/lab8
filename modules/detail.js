import { stripHtml, groupBySeason } from "./utils.js";

const $detail = document.querySelector("#detail-section");

/**
 * Renderiza la vista de detalle de una serie con sus episodios.
 * @param {Object}   show      Objeto show de TVMaze
 * @param {Array}    episodes  Array de episodios de TVMaze
 * @param {Function} onBack    Callback para volver al grid
 */
export function renderDetail(show, episodes, onBack) {
  const $header   = $detail.querySelector("header")   ?? document.createElement("header");
  const $episodes = $detail.querySelector(".episodes") ?? document.createElement("div");

  $detail.setHTMLUnsafe(/* html */`
    <button class="back-btn">← Volver a resultados</button>
    <div class="detail-layout">
      <header></header>
      <div class="episodes"></div>
    </div>
  `);

  // Referencias tras el render
  const $headerEl   = $detail.querySelector("header");
  const $episodesEl = $detail.querySelector(".episodes");

  $headerEl.setHTMLUnsafe(createShowHTML(show));

  const seasons = groupBySeason(episodes);
  const list    = Object.values(seasons).map((season, index) => createSeasonHTML(season, index + 1));
  $episodesEl.setHTMLUnsafe(/* html */`
    <h3 class="episodes-heading">Episodios (${episodes.length})</h3>
    ${list.join("")}
  `);

  // Abrir la primera temporada por defecto
  const firstDetails = $episodesEl.querySelector(".season-details");
  if (firstDetails) firstDetails.open = true;

  $detail.querySelector(".back-btn").addEventListener("click", onBack);
  $detail.hidden = false;
  $detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function hideDetail() {
  $detail.hidden = true;
}

// ── Creadores de HTML ────────────────────────────────────

const createShowHTML = (show) => {
  const imgUrl    = show.image?.original ?? show.image?.medium ?? "";
  const network   = show.network?.name ?? show.webChannel?.name ?? "";
  const statusCls = show.status === "Running" ? "running"
                  : show.status === "Ended"   ? "ended" : "other";

  return /* html */`
    <aside class="detail-show-panel">
      ${imgUrl ? `<img class="detail-poster" src="${imgUrl}" alt="${show.name ?? ""}" loading="lazy" decoding="async">` : ""}
      <div class="detail-show-info">
        <h2 class="detail-title">${show.name ?? "Sin título"}</h2>
        <div class="detail-meta">
          ${show.rating?.average  ? `<span class="detail-rating">⭐ ${show.rating.average}</span>` : ""}
          ${show.status           ? `<span class="detail-status ${statusCls}">${show.status}</span>` : ""}
          ${show.premiered        ? `<span class="detail-year">📅 ${show.premiered}</span>` : ""}
          ${show.runtime          ? `<span class="detail-runtime">⏱ ${show.runtime} min</span>` : ""}
        </div>
        ${network               ? `<p class="detail-network">📡 ${network}</p>` : ""}
        ${show.genres?.length   ? `<p class="detail-genres">${show.genres.join(" · ")}</p>` : ""}
        ${show.summary          ? `<p class="detail-summary">${stripHtml(show.summary)}</p>` : ""}
        <a class="detail-link"
           href="${show.url ?? `https://www.tvmaze.com/shows/${show.id}`}"
           target="_blank"
           rel="noopener noreferrer">Ver en TVMaze →</a>
      </div>
    </aside>
  `;
};

const createEpisodeHTML = (episode) => {
  const num   = String(episode.number ?? 0).padStart(2, "0");
  const parts = [episode.airdate, episode.runtime ? `${episode.runtime} min` : ""].filter(Boolean);
  return /* html */`
    <li class="episode-item">
      <span class="ep-number">${num}</span>
      <div class="ep-info">
        <span class="ep-name">${episode.name ?? `Episodio ${episode.number}`}</span>
        <span class="ep-meta">${parts.join(" · ")}</span>
      </div>
    </li>
  `;
};

const createSeasonHTML = (episodes, number) => /* html */`
  <details class="season-details">
    <summary class="season-summary">
      Temporada ${number} · ${episodes.length} episodio${episodes.length !== 1 ? "s" : ""}
    </summary>
    <ul class="episode-list">
      ${episodes.map(createEpisodeHTML).join("")}
    </ul>
  </details>
`;

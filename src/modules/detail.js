import { stripHtml, groupBySeason } from "./utils.js";

const detailSection = document.querySelector("#detail-section");

/**
 * Renderiza la vista de detalle de una serie con sus episodios.
 * @param {Object}   show      Objeto show de TVMaze
 * @param {Array}    episodes  Array de episodios de TVMaze
 * @param {Function} onBack    Callback para volver al grid
 */
export function renderDetail(show, episodes, onBack) {
  detailSection.replaceChildren();

  const backBtn = document.createElement("button");
  backBtn.className   = "back-btn";
  backBtn.textContent = "← Volver a resultados";
  backBtn.addEventListener("click", onBack);

  const layout = document.createElement("div");
  layout.className = "detail-layout";
  layout.append(buildShowPanel(show), buildEpisodesPanel(episodes));

  detailSection.append(backBtn, layout);
  detailSection.hidden = false;
  detailSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function hideDetail() {
  detailSection.hidden = true;
}

// ── Privado ───────────────────────────────────────────────

function buildShowPanel(show) {
  const panel = document.createElement("aside");
  panel.className = "detail-show-panel";

  // Póster
  const imgUrl = show.image?.original ?? show.image?.medium ?? "";
  if (imgUrl) {
    const img     = document.createElement("img");
    img.src       = imgUrl;
    img.alt       = show.name ?? "";
    img.className = "detail-poster";
    img.loading   = "lazy";
    img.decoding  = "async";
    panel.append(img);
  }

  // Bloque de información
  const info = document.createElement("div");
  info.className = "detail-show-info";

  const title       = document.createElement("h2");
  title.className   = "detail-title";
  title.textContent = show.name ?? "Sin título";
  info.append(title);

  // Fila de metadatos
  const meta = document.createElement("div");
  meta.className = "detail-meta";

  if (show.rating?.average) {
    meta.append(createBadge("detail-rating", `⭐ ${show.rating.average}`));
  }
  if (show.status) {
    const cls = show.status === "Running" ? "running"
              : show.status === "Ended"   ? "ended" : "other";
    meta.append(createBadge(`detail-status ${cls}`, show.status));
  }
  if (show.premiered) {
    meta.append(createBadge("detail-year", `📅 ${show.premiered}`));
  }
  if (show.runtime) {
    meta.append(createBadge("detail-runtime", `⏱ ${show.runtime} min`));
  }
  info.append(meta);

  // Red / canal
  const network = show.network?.name ?? show.webChannel?.name;
  if (network) {
    info.append(createParagraph("detail-network", `📡 ${network}`));
  }

  // Géneros
  if (show.genres?.length) {
    info.append(createParagraph("detail-genres", show.genres.join(" · ")));
  }

  // Sinopsis
  if (show.summary) {
    info.append(createParagraph("detail-summary", stripHtml(show.summary)));
  }

  // Enlace TVMaze
  const link      = document.createElement("a");
  link.href       = show.url ?? `https://www.tvmaze.com/shows/${show.id}`;
  link.target     = "_blank";
  link.rel        = "noopener noreferrer";
  link.className  = "detail-link";
  link.textContent = "Ver en TVMaze →";
  info.append(link);

  panel.append(info);
  return panel;
}

function buildEpisodesPanel(episodes) {
  const panel = document.createElement("section");
  panel.className = "detail-episodes-panel";

  const heading       = document.createElement("h3");
  heading.className   = "episodes-heading";
  heading.textContent = `Episodios (${episodes.length})`;
  panel.append(heading);

  const seasons = groupBySeason(episodes);

  Object.entries(seasons).forEach(([season, eps], index) => {
    const details     = document.createElement("details");
    details.className = "season-details";
    if (index === 0) details.open = true;

    const summary     = document.createElement("summary");
    summary.className = "season-summary";
    summary.textContent = `Temporada ${season}  ·  ${eps.length} episodio${eps.length !== 1 ? "s" : ""}`;
    details.append(summary);

    const list     = document.createElement("ul");
    list.className = "episode-list";

    eps.forEach(ep => {
      const li = document.createElement("li");
      li.className = "episode-item";

      const num       = document.createElement("span");
      num.className   = "ep-number";
      num.textContent = String(ep.number ?? 0).padStart(2, "0");

      const epInfo = document.createElement("div");
      epInfo.className = "ep-info";

      const epName       = document.createElement("span");
      epName.className   = "ep-name";
      epName.textContent = ep.name ?? `Episodio ${ep.number}`;

      const parts = [];
      if (ep.airdate) parts.push(ep.airdate);
      if (ep.runtime) parts.push(`${ep.runtime} min`);

      const epMeta       = document.createElement("span");
      epMeta.className   = "ep-meta";
      epMeta.textContent = parts.join(" · ");

      epInfo.append(epName, epMeta);
      li.append(num, epInfo);
      list.append(li);
    });

    details.append(list);
    panel.append(details);
  });

  return panel;
}

// ── Helpers de creación de elementos ─────────────────────

function createBadge(className, text) {
  const el       = document.createElement("span");
  el.className   = className;
  el.textContent = text;
  return el;
}

function createParagraph(className, text) {
  const el       = document.createElement("p");
  el.className   = className;
  el.textContent = text;
  return el;
}

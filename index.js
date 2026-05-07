import { searchShows, getEpisodes } from "./modules/api.js";
import { showStatus, hideStatus }   from "./modules/ui.js";
import { renderGrid, hideResults }  from "./modules/cards.js";
import { renderDetail, hideDetail } from "./modules/detail.js";

// ── Referencias ───────────────────────────────────────────
const form  = document.querySelector("#search-form");
const input = document.querySelector("#search-input");

// ── Handlers ──────────────────────────────────────────────

async function handleSearch(ev) {
  ev.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  hideDetail();
  hideResults();
  showStatus("Buscando series...", "loading");

  try {
    const results = await searchShows(query);
    hideStatus();

    if (results.length === 0) {
      showStatus(`No se encontraron series para "${query}".`);
      return;
    }

    renderGrid(results, query, handleSelectShow);
  } catch (err) {
    showStatus(`Error al conectar con la API: ${err.message}`, "error");
    console.error(err);
  }
}

async function handleSelectShow(show) {
  hideResults();
  hideDetail();
  showStatus("Cargando episodios...", "loading");

  try {
    const episodes = await getEpisodes(show.id);
    hideStatus();
    renderDetail(show, episodes, handleBack);
  } catch (err) {
    showStatus(`Error al cargar episodios: ${err.message}`, "error");
    console.error(err);
  }
}

function handleBack() {
  hideDetail();
  hideResults();   // limpia por si acaso
  // Re-lanzar la búsqueda con el mismo término para volver al grid
  form.dispatchEvent(new Event("submit", { cancelable: true }));
}

// ── Eventos ───────────────────────────────────────────────
form.addEventListener("submit", handleSearch);

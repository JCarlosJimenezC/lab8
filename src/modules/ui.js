const statusSection = document.querySelector("#status-section");
const statusMsg     = document.querySelector("#status-message");

/**
 * Muestra el panel de estado con un mensaje.
 * @param {string} message
 * @param {""|"loading"|"error"} type
 */
export function showStatus(message, type = "") {
  statusMsg.textContent = message;
  statusMsg.className   = `status-message ${type}`.trim();
  statusSection.hidden  = false;
}

export function hideStatus() {
  statusSection.hidden = true;
}

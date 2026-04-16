// omikuji-garden entry module.
// Real logic lands in later slices (signbox, draw, overlay).

function init() {
  // Smoke check: prove ES module boot works.
  console.log("[omikuji-garden] init ok");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// omikuji-garden entry module.
// NOTE: `<script type="module">` is deferred, so DOM is already parsed
// by the time init() runs. Later slices can assume document.body exists.

const DATA_PATHS = {
  fortunes: "data/fortunes.json",
  articles: "data/articles.json",
};

/** Load fortunes + articles in parallel. Returns { fortunes, articles }. */
async function loadData() {
  const [fortunesRes, articlesRes] = await Promise.all([
    fetch(DATA_PATHS.fortunes),
    fetch(DATA_PATHS.articles),
  ]);
  if (!fortunesRes.ok) throw new Error(`fortunes.json HTTP ${fortunesRes.status}`);
  if (!articlesRes.ok) throw new Error(`articles.json HTTP ${articlesRes.status}`);
  const fortunesDoc = await fortunesRes.json();
  const articlesDoc = await articlesRes.json();
  return { fortunes: fortunesDoc.fortunes, articles: articlesDoc.articles };
}

async function init() {
  try {
    const { fortunes, articles } = await loadData();
    document.body.dataset.omikujiState = "ready";
    console.log(`[omikuji-garden] loaded ${fortunes.length} fortunes, ${articles.length} articles`);
    window.__omikuji = { fortunes, articles }; // dev inspection handle
  } catch (err) {
    document.body.dataset.omikujiState = "error";
    console.error("[omikuji-garden] data load failed:", err);
  }
}

init();

// omikuji-garden — draw + stick-face logic.
// NOTE: `<script type="module">` is deferred, so DOM is already parsed
// by the time init() runs. Later slices can assume document.body exists.
// Article overlay lands in Slice 5.

const DATA_PATHS = {
  fortunes: "data/fortunes.json",
  articles: "data/articles.json",
};

const state = {
  fortunes: [],
  articles: [],
  currentFortune: null,
  currentArticle: null,
};

async function loadData() {
  const [fr, ar] = await Promise.all([
    fetch(DATA_PATHS.fortunes),
    fetch(DATA_PATHS.articles),
  ]);
  if (!fr.ok) throw new Error(`fortunes.json HTTP ${fr.status}`);
  if (!ar.ok) throw new Error(`articles.json HTTP ${ar.status}`);
  const fd = await fr.json();
  const ad = await ar.json();
  return { fortunes: fd.fortunes, articles: ad.articles };
}

/** Unbiased random pick of one fortune. */
function pickFortune(fortunes) {
  const i = Math.floor(Math.random() * fortunes.length);
  return fortunes[i];
}

/** Weighted random pick of one article. Article weights default to 1. */
function pickArticle(articles) {
  const total = articles.reduce((s, a) => s + (a.weight ?? 1), 0);
  let r = Math.random() * total;
  for (const a of articles) {
    r -= (a.weight ?? 1);
    if (r <= 0) return a;
  }
  return articles[articles.length - 1];
}

function setStage(stage) {
  document.getElementById("app").dataset.stage = stage;
}

function renderStickFront(fortune) {
  document.getElementById("fortune-seal").textContent = fortune.level;
  document.getElementById("fortune-text-ja").textContent = fortune.text_ja;
  document.getElementById("fortune-text-zh").textContent = fortune.text_zh;
  document.getElementById("stick-number").textContent = `第 ${fortune.id} 番`;
}

function draw() {
  state.currentFortune = pickFortune(state.fortunes);
  state.currentArticle = pickArticle(state.articles);
  renderStickFront(state.currentFortune);

  const stage = document.getElementById("stick-stage");
  stage.hidden = false;
  stage.dataset.anim = "entering";
  setStage("stick");

  // Clear animation class after it plays so re-draws retrigger it.
  stage.addEventListener("animationend", () => {
    delete stage.dataset.anim;
  }, { once: true });
}

function returnToSignbox() {
  const stage = document.getElementById("stick-stage");
  stage.hidden = true;
  setStage("signbox");
  state.currentFortune = null;
  state.currentArticle = null;
}

function wireEvents() {
  document.getElementById("signbox").addEventListener("click", draw);
  document.getElementById("btn-redraw").addEventListener("click", () => {
    returnToSignbox();
    draw();
  });
  // btn-flip wired in Slice 5
}

async function init() {
  try {
    const { fortunes, articles } = await loadData();
    state.fortunes = fortunes;
    state.articles = articles;
    wireEvents();
    setStage("signbox");
    document.body.dataset.omikujiState = "ready";
    console.log(`[omikuji-garden] ready — ${fortunes.length} fortunes, ${articles.length} articles`);
    window.__omikuji = state; // dev inspection handle
  } catch (err) {
    document.body.dataset.omikujiState = "error";
    console.error("[omikuji-garden] init failed:", err);
  }
}

init();

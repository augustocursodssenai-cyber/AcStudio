const grid = document.getElementById("catalogGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const emptyState = document.getElementById("emptyState");

let generoAtivo = "todos";

function renderGrid() {
  const termo = searchInput.value.trim().toLowerCase();

  const filtrados = CATALOGO_FILMES.filter((f) => {
    const bateGenero = generoAtivo === "todos" || f.genero === generoAtivo;
    const bateBusca =
      !termo ||
      f.titulo.toLowerCase().includes(termo) ||
      f.genero.toLowerCase().includes(termo);
    return bateGenero && bateBusca;
  });

  grid.innerHTML = "";
  emptyState.hidden = filtrados.length !== 0;

  filtrados.forEach((filme) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.background = `linear-gradient(155deg, ${filme.cor1}55, ${filme.cor2})`;

    card.innerHTML = `
      <span class="card-icon">${filme.icon}</span>
      <div class="card-overlay"></div>
      <span class="card-rating">★ ${filme.nota}</span>
      <span class="card-play">▶</span>
      <div class="card-poster">
        <div class="card-info">
          <span class="card-genre">${filme.genero}</span>
          <div class="card-title">${filme.titulo}</div>
          <div class="card-meta">${filme.ano} · ${filme.duracao}</div>
        </div>
      </div>
    `;

    card.addEventListener("click", () => abrirModal(filme));
    grid.appendChild(card);
  });
}

filters.addEventListener("click", (e) => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  filters.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  generoAtivo = chip.dataset.genero;
  renderGrid();
});

searchInput.addEventListener("input", renderGrid);

// MODAL
const modal = document.getElementById("modal");
const modalMedia = document.getElementById("modalMedia");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalDesc = document.getElementById("modalDesc");
const modalActions = document.getElementById("modalActions");
const modalClose = document.getElementById("modalClose");

function abrirModal(filme, autoAssistir = false) {
  modalTitle.textContent = filme.titulo;
  modalMeta.textContent = `${filme.genero} · ${filme.ano} · ${filme.duracao} · ★ ${filme.nota}`;
  modalDesc.textContent = filme.sinopse;

  modalActions.innerHTML = "";

  if (filme.completoEmbed) {
    const btnFull = document.createElement("button");
    btnFull.className = "btn btn-primary";
    btnFull.textContent = "▶ Assistir filme completo";
    btnFull.onclick = () => mostrarEmbed(filme.completoEmbed);
    modalActions.appendChild(btnFull);
  } else if (filme.completoUrl) {
    const btnFull = document.createElement("a");
    btnFull.className = "btn btn-primary";
    btnFull.href = filme.completoUrl;
    btnFull.target = "_blank";
    btnFull.rel = "noopener";
    btnFull.textContent = "▶ Assistir filme completo";
    modalActions.appendChild(btnFull);
  }

  const btnTrailer = document.createElement("button");
  btnTrailer.className = "btn btn-ghost";
  btnTrailer.textContent = "Ver trailer no YouTube ↗";
  btnTrailer.onclick = () => abrirTrailer(filme.trailerQuery);
  modalActions.appendChild(btnTrailer);

  if (autoAssistir && filme.completoEmbed) {
    mostrarEmbed(filme.completoEmbed);
  } else if (autoAssistir && filme.completoUrl) {
    window.open(filme.completoUrl, "_blank", "noopener");
    mostrarPlaceholder(filme);
  } else {
    mostrarPlaceholder(filme);
  }

  modal.classList.add("active");
}

function mostrarEmbed(src) {
  modalMedia.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen" allowfullscreen frameborder="0"></iframe>`;
}

function mostrarPlaceholder(filme) {
  modalMedia.innerHTML = `
    <div class="media-placeholder" style="background:linear-gradient(155deg, ${filme.cor1}55, ${filme.cor2})">
      <span class="media-placeholder-icon">${filme.icon}</span>
      <p>Trailer disponível no YouTube</p>
    </div>
  `;
}

function abrirTrailer(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  window.open(url, "_blank", "noopener");
}

modalClose.addEventListener("click", fecharModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) fecharModal();
});
function fecharModal() {
  modal.classList.remove("active");
  modalMedia.innerHTML = "";
}

// HERO (filme de destaque)
const destaque = CATALOGO_FILMES.find((f) => f.destaque) || CATALOGO_FILMES[0];
document.getElementById("heroTitle").textContent = destaque.titulo;
document.getElementById("heroMeta").textContent = `${destaque.genero} · ${destaque.ano} · ${destaque.duracao} · ★ ${destaque.nota}`;
document.getElementById("heroDesc").textContent = destaque.sinopse;
document.getElementById("btnAssistir").addEventListener("click", () => abrirModal(destaque, true));
document.getElementById("btnTrailer").addEventListener("click", () => abrirTrailer(destaque.trailerQuery));

renderGrid();

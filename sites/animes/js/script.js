const grid = document.getElementById("catalogGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const emptyState = document.getElementById("emptyState");

let generoAtivo = "todos";

function renderGrid() {
  const termo = searchInput.value.trim().toLowerCase();

  const filtrados = CATALOGO_ANIMES.filter((a) => {
    const bateGenero = generoAtivo === "todos" || a.genero === generoAtivo;
    const bateBusca =
      !termo ||
      a.titulo.toLowerCase().includes(termo) ||
      a.genero.toLowerCase().includes(termo);
    return bateGenero && bateBusca;
  });

  grid.innerHTML = "";
  emptyState.hidden = filtrados.length !== 0;

  filtrados.forEach((anime) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.background = `linear-gradient(155deg, ${anime.cor1}55, ${anime.cor2})`;

    card.innerHTML = `
      <span class="card-icon">${anime.icon}</span>
      <div class="card-overlay"></div>
      <span class="card-season">${anime.temporada}</span>
      <span class="card-rating">★ ${anime.nota}</span>
      <span class="card-play">▶</span>
      <div class="card-poster">
        <div class="card-info">
          <span class="card-genre">${anime.genero}</span>
          <div class="card-title">${anime.titulo}</div>
          <div class="card-meta">${anime.ano} · ${anime.duracao}</div>
        </div>
      </div>
    `;

    card.addEventListener("click", () => abrirModal(anime));
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

function abrirModal(anime, autoAssistir = false) {
  modalTitle.textContent = anime.titulo;
  modalMeta.textContent = `${anime.genero} · ${anime.temporada} · ${anime.ano} · ★ ${anime.nota}`;
  modalDesc.textContent = anime.sinopse;

  modalActions.innerHTML = "";

  if (anime.completoEmbed) {
    const btnFull = document.createElement("button");
    btnFull.className = "btn btn-primary";
    btnFull.textContent = "▶ Assistir episódio completo";
    btnFull.onclick = () => mostrarEmbed(anime.completoEmbed);
    modalActions.appendChild(btnFull);
  } else if (anime.completoUrl) {
    const btnFull = document.createElement("a");
    btnFull.className = "btn btn-primary";
    btnFull.href = anime.completoUrl;
    btnFull.target = "_blank";
    btnFull.rel = "noopener";
    btnFull.textContent = "▶ Assistir episódio completo ↗";
    modalActions.appendChild(btnFull);
  }

  const btnTrailer = document.createElement("button");
  btnTrailer.className = "btn btn-ghost";
  btnTrailer.textContent = "Ver trailer no YouTube ↗";
  btnTrailer.onclick = () => abrirTrailer(anime.trailerQuery);
  modalActions.appendChild(btnTrailer);

  if (autoAssistir && anime.completoEmbed) {
    mostrarEmbed(anime.completoEmbed);
  } else if (autoAssistir && anime.completoUrl) {
    window.open(anime.completoUrl, "_blank", "noopener");
    mostrarPlaceholder(anime);
  } else {
    mostrarPlaceholder(anime);
  }

  modal.classList.add("active");
}

function mostrarEmbed(src) {
  modalMedia.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen" allowfullscreen frameborder="0"></iframe>`;
}

function mostrarPlaceholder(anime) {
  modalMedia.innerHTML = `
    <div class="media-placeholder" style="background:linear-gradient(155deg, ${anime.cor1}55, ${anime.cor2})">
      <span class="media-placeholder-icon">${anime.icon}</span>
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

// HERO (anime de destaque)
const destaque = CATALOGO_ANIMES.find((a) => a.destaque) || CATALOGO_ANIMES[0];
document.getElementById("heroTitle").textContent = destaque.titulo;
document.getElementById("heroMeta").textContent = `${destaque.genero} · ${destaque.temporada} · ${destaque.ano} · ★ ${destaque.nota}`;
document.getElementById("heroDesc").textContent = destaque.sinopse;
document.getElementById("btnAssistir").addEventListener("click", () => abrirModal(destaque, true));
document.getElementById("btnTrailer").addEventListener("click", () => abrirTrailer(destaque.trailerQuery));

renderGrid();

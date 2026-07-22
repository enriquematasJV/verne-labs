document.addEventListener('DOMContentLoaded', async () => {
  const gridContainer = document.getElementById('simulationsGrid');
  const searchInput = document.getElementById('labSearch');
  const noResults = document.getElementById('noResults');
  const filterChipsContainer = document.getElementById('filterChips');
  const activeSubjects = new Set();
  let chips = [];
  let todosChip = null;
  let config = null;
  let manifest = null;

  async function loadConfig() {
    try {
      const response = await fetch('config.json');
      config = await response.json();
      return config;
    } catch (error) {
      console.error('Error cargando config.json:', error);
      return null;
    }
  }

  async function loadManifest() {
    try {
      const response = await fetch('manifest.json');
      manifest = await response.json();
      return manifest;
    } catch (error) {
      console.error('Error cargando manifest.json:', error);
      return null;
    }
  }

  function buildCategoryMap() {
    const map = {};
    if (config && config.etiquetas) {
      for (const etiqueta of config.etiquetas) {
        map[etiqueta.nombre] = etiqueta.id;
      }
    }
    return map;
  }

  async function loadFilterChips() {
    if (!config) return;

    const categoryMap = buildCategoryMap();

    todosChip = document.createElement('button');
    todosChip.type = 'button';
    todosChip.className = 'chip active';
    todosChip.dataset.filter = 'todos';
    todosChip.textContent = 'Todos';
    filterChipsContainer.appendChild(todosChip);

    for (const etiqueta of config.etiquetas) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.dataset.filter = etiqueta.id;
      btn.textContent = etiqueta.nombre;
      filterChipsContainer.appendChild(btn);
    }

    chips = Array.from(document.querySelectorAll('.chip'));
    setupFilters();
  }

  async function loadCards() {
    if (!manifest) return;

    for (const lab of manifest.laboratorios) {
      try {
        const cardPath = `simulaciones/${lab.carpeta}/card-${lab.carpeta}.html`;
        const response = await fetch(cardPath);
        if (!response.ok) throw new Error(`No se pudo cargar ${cardPath}`);
        const html = await response.text();

        const temp = document.createElement('div');
        temp.innerHTML = html;
        const card = temp.firstElementChild;

        await processCardActions(card, lab.carpeta);
        gridContainer.appendChild(card);
      } catch (error) {
        console.error(`Error cargando ${lab.carpeta}:`, error);
      }
    }

    applyFilters();
  }

  async function processCardActions(card, carpeta) {
    const actionsDiv = card.querySelector('.card-actions');
    if (!actionsDiv) return;

    let secondaryBtn = actionsDiv.querySelector('.button.secondary');

    if (!secondaryBtn) {
      secondaryBtn = document.createElement('a');
      secondaryBtn.className = 'button secondary';
      secondaryBtn.href = `simulaciones/${carpeta}/unidad-didactica.html`;
      secondaryBtn.textContent = 'Ver unidad didáctica';
      actionsDiv.appendChild(secondaryBtn);
    }

    const unitPath = `simulaciones/${carpeta}/unidad-didactica.html`;

    try {
      const response = await fetch(unitPath);
      if (!response.ok) {
        secondaryBtn.onclick = (e) => {
          e.preventDefault();
          alert('Esta unidad didáctica está en preparación.');
        };
      }
    } catch (error) {
      secondaryBtn.onclick = (e) => {
        e.preventDefault();
        alert('Esta unidad didáctica está en preparación.');
      };
    }
  }

  function setupFilters() {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip === todosChip) {
          activeSubjects.clear();
        } else {
          if (activeSubjects.has(chip.dataset.filter)) {
            activeSubjects.delete(chip.dataset.filter);
          } else {
            activeSubjects.add(chip.dataset.filter);
          }
        }

        todosChip.classList.toggle('active', activeSubjects.size === 0);
        chips.forEach(c => {
          if (c !== todosChip) c.classList.toggle('active', activeSubjects.has(c.dataset.filter));
        });

        applyFilters();
      });
    });

    searchInput.addEventListener('input', applyFilters);
  }

  function applyFilters() {
    const cards = Array.from(document.querySelectorAll('#simulationsGrid .simulation-card'));
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      const subjects = (card.dataset.subject || '').split(/\s+/);
      const matchesSubject = activeSubjects.size === 0 || subjects.some(s => activeSubjects.has(s));
      const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
      const visible = matchesSubject && matchesSearch;
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount += 1;
    });

    noResults.classList.toggle('visible', visibleCount === 0);
  }

  await loadConfig();
  await loadManifest();
  await loadFilterChips();
  await loadCards();
});

const INITIAL_VISIBLE_GENRES = 6;

// Renderiza os chips de gênero em blocos expansíveis para evitar poluição visual
// nos painéis de filtro da Biblioteca e do Meu Acervo.
export function renderExpandableGenreChips(container, generos, getActive, onSelect) {
  if (!container) return { resetExpanded: () => {} };
  let expanded = false;

  const sync = () => {
    const active = getActive();
    const chips = [...container.querySelectorAll('.filter-chip[data-value]')];
    let hiddenCount = 0;

    chips.forEach((chip, idx) => {
      const keepVisible = expanded || idx < INITIAL_VISIBLE_GENRES || chip.dataset.value === active;
      chip.hidden = !keepVisible;
      if (!keepVisible) hiddenCount++;
    });

    const toggle = container.querySelector('.filter-chip-toggle');
    if (toggle) {
      if (!expanded && hiddenCount === 0) {
        toggle.hidden = true;
      } else {
        toggle.hidden = false;
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.textContent = expanded ? 'Ver menos' : `Ver mais (${hiddenCount})`;
      }
    }
  };

  container.innerHTML =
    generos.map(g => `<button type="button" class="filter-chip" data-value="${g}">${g}</button>`).join('') +
    `<button type="button" class="filter-chip filter-chip-toggle" aria-expanded="false"></button>`;

  container.querySelectorAll('.filter-chip[data-value]').forEach(chip => {
    chip.addEventListener('click', () => {
      onSelect(chip, container);
      sync();
    });
  });

  const toggleBtn = container.querySelector('.filter-chip-toggle');
  toggleBtn?.addEventListener('click', () => {
    expanded = !expanded;
    sync();
  });

  sync();
  return { sync };
}

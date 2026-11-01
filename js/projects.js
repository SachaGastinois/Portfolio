document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-studio-accent', 'border-studio-accent', 'text-white');
        b.classList.add('border-studio-border', 'text-studio-muted');
      });

      btn.classList.add('active', 'bg-studio-accent', 'border-studio-accent', 'text-white');
      btn.classList.remove('border-studio-border', 'text-studio-muted');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = (card.getAttribute('data-category') || '').split(/\s+/);
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
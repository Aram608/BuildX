const searchInput = document.getElementById('searchInput');
const categoryBlocks = document.querySelectorAll('.category-block');

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    categoryBlocks.forEach(categoryBlock => {
        const seriesSections = categoryBlock.querySelectorAll('.series-section');
        let hasVisibleInCategory = false;

        seriesSections.forEach(section => {
            const cards = section.querySelectorAll('.component-card');
            let hasVisibleCardsInSeries = false;

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = 'block';
                    hasVisibleCardsInSeries = true;
                    hasVisibleInCategory = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // Скрываем подраздел, если по запросу в нем ничего не найдено
            if (hasVisibleCardsInSeries) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });

        // Скрываем целую категорию (например, всю секцию SSD или RAM), если ничего не подошло
        if (hasVisibleInCategory) {
            categoryBlock.style.display = 'block';
        } else {
            categoryBlock.style.display = 'none';
        }
    });
});

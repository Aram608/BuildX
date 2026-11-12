document.addEventListener('DOMContentLoaded', () => {
    // 1. Переключение между вкладками
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // 2. Живой поиск по каталогу комплектующих
    const searchInput = document.getElementById('searchInput');
    const categoryBlocks = document.querySelectorAll('.category-block');

    if (searchInput) {
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

                    section.style.display = hasVisibleCardsInSeries ? 'block' : 'none';
                });

                categoryBlock.style.display = hasVisibleInCategory ? 'block' : 'none';
            });
        });
    }

    // 3. Логика конструктора сборки ПК
    const checkBuildBtn = document.getElementById('checkBuildBtn');
    const buildResults = document.getElementById('buildResults');

    if (checkBuildBtn) {
        checkBuildBtn.addEventListener('click', () => {
            const gpuSelect = document.getElementById('bGpu');
            const psuText = document.getElementById('resPsu');

            if (gpuSelect && psuText) {
                const gpuVal = gpuSelect.value;
                if (gpuVal === '5090') {
                    psuText.textContent = '1000W - 1200W';
                } else if (gpuVal === '4085') {
                    psuText.textContent = '850W';
                } else {
                    psuText.textContent = '650W - 750W';
                }
                buildResults.style.display = 'block';
            }
        });
    }

    // 4. Калькулятор FPS в играх
    const calcFpsBtn = document.getElementById('calcFpsBtn');
    const fpsResults = document.getElementById('fpsResults');

    if (calcFpsBtn) {
        calcFpsBtn.addEventListener('click', () => {
            const gpu = document.getElementById('fpsGpu').value;
            const res = document.getElementById('fpsRes').value;

            let mult = 1.0;
            if (gpu === '5090') mult = 2.3;
            else if (gpu === '4085') mult = 1.5;
            else if (gpu === '4070') mult = 1.2;
            else if (gpu === '7800xt') mult = 1.15;

            if (res === '2160') mult *= 0.58;
            else if (res === '1440') mult *= 0.84;

            document.getElementById('gameCp').textContent = Math.round(70 * mult) + ' FPS';
            document.getElementById('gameCs').textContent = Math.round(380 * mult) + ' FPS';
            document.getElementById('gameWukong').textContent = Math.round(80 * mult) + ' FPS';
            document.getElementById('gameGta').textContent = Math.round(140 * mult) + ' FPS';

            fpsResults.style.display = 'block';
        });
    }
});

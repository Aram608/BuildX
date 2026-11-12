// Переключение между вкладками
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');
    });
});

// Живой поиск по каталогу комплектующих
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

                if (hasVisibleCardsInSeries) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });

            if (hasVisibleInCategory) {
                categoryBlock.style.display = 'block';
            } else {
                categoryBlock.style.display = 'none';
            }
        });
    });
}

// Калькулятор FPS в играх
const calcBtn = document.getElementById('calcFpsBtn');
const fpsResults = document.getElementById('fpsResults');

if (calcBtn) {
    calcBtn.addEventListener('click', () => {
        const gpu = document.getElementById('gpuSelect').value;
        const cpu = document.getElementById('cpuSelect').value;
        const res = document.getElementById('resSelect').value;

        // Базовые коэффициенты производительности для демонстрации
        let baseMultiplier = 1.0;
        if (gpu === '5090') baseMultiplier = 2.2;
        else if (gpu === '5080') baseMultiplier = 1.8;
        else if (gpu === '4090') baseMultiplier = 1.7;
        else if (gpu === '4080s') baseMultiplier = 1.4;
        else if (gpu === '4070ts') baseMultiplier = 1.25;
        else if (gpu === '4070s') baseMultiplier = 1.1;
        else if (gpu === '7900xtx') baseMultiplier = 1.6;
        else if (gpu === '7800xt') baseMultiplier = 1.1;
        else if (gpu === 'b580') baseMultiplier = 0.85;
        else if (gpu === '4060') baseMultiplier = 0.75;

        if (cpu === 'mid') baseMultiplier *= 0.92;
        if (cpu === 'budget') baseMultiplier *= 0.8;

        if (res === '2160') baseMultiplier *= 0.6;
        else if (res === '1440') baseMultiplier *= 0.85;

        // Расчет для разных игр
        const cpFps = Math.round(75 * baseMultiplier);
        const csFps = Math.round(380 * baseMultiplier);
        const wukongFps = Math.round(85 * baseMultiplier);
        const gtaFps = Math.round(140 * baseMultiplier);

        document.getElementById('resCP').textContent = cpFps + ' FPS';
        document.getElementById('resCS').textContent = csFps + ' FPS';
        document.getElementById('resWukong').textContent = wukongFps + ' FPS';
        document.getElementById('resGTA').textContent = gtaFps + ' FPS';

        fpsResults.style.display = 'block';
    });
}

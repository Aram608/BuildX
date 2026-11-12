// Находим наши элементы на странице по их ID
const cpuSelect = document.getElementById('cpu');
const gpuSelect = document.getElementById('gpu');
const totalPriceEl = document.getElementById('total-price');
const fpsCs2El = document.getElementById('fps-cs2');
const fpsCpEl = document.getElementById('fps-cp');

// Функция, которая запускается при любом выборе детали
function calculateBuild() {
    // 1. Берем цену выбранных деталей
    const cpuPrice = Number(cpuSelect.value);
    const gpuPrice = Number(gpuSelect.value);
    
    // 2. Берем очки мощности из атрибута data-score
    const cpuScore = Number(cpuSelect.options[cpuSelect.selectedIndex].dataset.score);
    const gpuScore = Number(gpuSelect.options[gpuSelect.selectedIndex].dataset.score);

    // 3. Считаем и выводим общую цену
    totalPriceEl.textContent = cpuPrice + gpuPrice;

    // 4. Если выбраны ОБЕ детали — считаем FPS
    if (cpuScore > 0 && gpuScore > 0) {
        // Формула для CS2 (больше зависит от процессора)
        const cs2Fps = Math.round((cpuScore * 2.2) + (gpuScore * 1.5));
        // Формула для Cyberpunk (больше зависит от видеокарты)
        const cpFps = Math.round((cpuScore * 0.3) + (gpuScore * 0.9));

        fpsCs2El.textContent = cs2Fps + ' FPS';
        fpsCpEl.textContent = cpFps + ' FPS';
    } else {
        fpsCs2El.textContent = '0 FPS';
        fpsCpEl.textContent = '0 FPS';
    }
}

// Следим за изменениями в выпадающих списках
cpuSelect.addEventListener('change', calculateBuild);
gpuSelect.addEventListener('change', calculateBuild);

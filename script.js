// База данных доступных деталей ПК
const partsDatabase = {
    cpu: [
        { name: "AMD Ryzen 7 7800X3D", price: 389, tdp: 120 },
        { name: "Intel Core i7-14700K", price: 409, tdp: 250 },
        { name: "AMD Ryzen 5 7600X", price: 219, tdp: 105 }
    ],
    gpu: [
        { name: "NVIDIA GeForce RTX 4085 Super", price: 999, tdp: 320 },
        { name: "NVIDIA GeForce RTX 4070 Ti", price: 799, tdp: 285 },
        { name: "AMD Radeon RX 7900 XTX", price: 929, tdp: 355 }
    ],
    ram: [
        { name: "Corsair Vengeance RGB 32GB DDR5 6000MHz", price: 115, tdp: 15 },
        { name: "G.Skill Trident Z5 RGB 64GB DDR5", price: 210, tdp: 25 }
    ],
    storage: [
        { name: "Samsung 990 PRO 2TB NVMe SSD", price: 169, tdp: 10 },
        { name: "WD Black SN850X 1TB NVMe SSD", price: 95, tdp: 8 }
    ],
    motherboard: [
        { name: "ASUS ROG Strix B650-A Gaming WiFi", price: 239, tdp: 40 },
        { name: "MSI MAG Z790 TOMAHAWK WIFI", price: 259, tdp: 50 }
    ],
    cooler: [
        { name: "NZXT Kraken Elite 360 RGB", price: 279, tdp: 20 },
        { name: "DeepCool AK620 Digital", price: 69, tdp: 15 }
    ],
    psu: [
        { name: "Corsair RM850x Shift 850W 80+ Gold", price: 139, tdp: 0 },
        { name: "Seasonic Focus GX-1000 1000W", price: 189, tdp: 0 }
    ],
    case: [
        { name: "NZXT H6 Flow RGB Dual-Chamber", price: 134, tdp: 0 },
        { name: "Lian Li O11 Dynamic EVO", price: 159, tdp: 0 }
    ]
};

// Структура слотов сборки пользователя
const slots = [
    { id: 'cpu', label: 'Процессор (CPU)', icon: '⚡' },
    { id: 'cooler', label: 'Охлаждение CPU', icon: '❄️' },
    { id: 'motherboard', label: 'Материнская плата', icon: '🧩' },
    { id: 'ram', label: 'Оперативная память (RAM)', icon: '💾' },
    { id: 'gpu', label: 'Видеокарта (GPU)', icon: '🎮' },
    { id: 'storage', label: 'Накопитель (SSD)', icon: '💽' },
    { id: 'psu', label: 'Блок питания (PSU)', icon: '🔌' },
    { id: 'case', label: 'Корпус', icon: '🖥️' }
];

let currentBuild = {};
let currentActiveSlot = null;
let scene, camera, renderer, pcGroup;
let isRgbActive = false;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    renderSlots();
    init3DViewer();
    updateStats();
});

// Рендер слотов конфигуратора
function renderSlots() {
    const container = document.getElementById('components-list');
    container.innerHTML = '';

    slots.forEach(slot => {
        const selected = currentBuild[slot.id];
        const html = `
            <div onclick="openModal('${slot.id}')" class="group bg-[#141419] hover:bg-[#1a1a22] border border-zinc-800 hover:border-[#ff007f]/50 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-lg">
                <div class="flex items-center space-x-4">
                    <div class="w-11 h-11 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-xl group-hover:border-[#ff007f] transition">
                        ${slot.icon}
                    </div>
                    <div>
                        <div class="text-xs font-semibold uppercase tracking-wider text-zinc-500">${slot.label}</div>
                        <div class="text-sm font-bold text-zinc-200 mt-0.5">${selected ? selected.name : 'Нажмите для выбора'}</div>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="text-sm font-bold ${selected ? 'text-[#ff007f]' : 'text-zinc-600'}">${selected ? '$' + selected.price : '+ Выбрать'}</span>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

// Открытие модального окна выбора детали
function openModal(slotId) {
    currentActiveSlot = slotId;
    const slotInfo = slots.find(s => s.id === slotId);
    document.getElementById('modal-title').innerText = `Выбрать: ${slotInfo.label}`;
    document.getElementById('modal-search').value = '';
    renderModalItems(partsDatabase[slotId]);
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('flex');
}

function closeModal() {
    document.getElementById('modal').classList.remove('flex');
    document.getElementById('modal').classList.add('hidden');
}

function renderModalItems(items) {
    const container = document.getElementById('modal-items');
    container.innerHTML = '';

    if (!items || items.length === 0) {
        container.innerHTML = '<div class="text-center text-zinc-500 py-6">Ничего не найдено</div>';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = "flex items-center justify-between p-3 bg-black/30 hover:bg-[#ff007f]/10 border border-zinc-800 hover:border-[#ff007f]/50 rounded-xl cursor-pointer transition";
        div.innerHTML = `
            <span class="text-sm font-medium text-zinc-200">${item.name}</span>
            <span class="text-sm font-bold text-[#ff007f]">$${item.price}</span>
        `;
        div.onclick = () => selectPart(item);
        container.appendChild(div);
    });
}

function filterParts(query) {
    const items = partsDatabase[currentActiveSlot];
    const filtered = items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
    renderModalItems(filtered);
}

function selectPart(item) {
    currentBuild[currentActiveSlot] = item;
    closeModal();
    renderSlots();
    updateStats();
    update3DModel();
}

// Обновление цен, TDP и аналитики
function updateStats() {
    let totalPrice = 0;
    let totalTdp = 0;

    Object.keys(currentBuild).forEach(key => {
        if (currentBuild[key]) {
            totalPrice += currentBuild[key].price;
            totalTdp += currentBuild[key].tdp || 0;
        }
    });

    document.getElementById('total-price').innerText = `$${totalPrice}`;
    document.getElementById('stat-tdp').innerText = `${totalTdp} Вт`;

    const selectedCount = Object.keys(currentBuild).length;
    const statusEl = document.getElementById('stat-status');
    if (selectedCount === 0) {
        statusEl.innerText = "Пусто";
        statusEl.className = "text-zinc-500 font-semibold";
    } else if (selectedCount < slots.length) {
        statusEl.innerText = "В процессе";
        statusEl.className = "text-amber-400 font-semibold";
    } else {
        statusEl.innerText = "Готово к сборке!";
        statusEl.className = "text-emerald-400 font-semibold";
    }
}

// Инициализация 3D сцены (Three.js)
function init3DViewer() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(5, 3, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Свет
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff007f, 3,

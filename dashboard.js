// Data kendaraan lokal
let vehicles = [
    { name: "Sandstrom", vid: "57761", plate: "VL94FY3P", health: 81.5, fuel: 87.6 }
];

function renderVehicleList() {
    const tbody = document.getElementById('vehicle-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    vehicles.forEach((v, index) => {
        const healthClass = v.health < 40 ? 'fill-warning' : 'fill-health';
        const fuelClass = v.fuel < 20 ? 'fill-warning' : 'fill-fuel';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong><i class="fa-solid fa-truck"></i> ${v.name}</strong></td>
            <td><span class="badge-vid">${v.vid}</span></td>
            <td><span class="badge-plate">${v.plate}</span></td>
            <td>
                ${v.health.toFixed(1).replace('.', ',')}%
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill ${healthClass}" style="width: ${v.health}%"></div>
                </div>
            </td>
            <td>
                ${v.fuel.toFixed(1).replace('.', ',')}%
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill ${fuelClass}" style="width: ${v.fuel}%"></div>
                </div>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn-link" onclick="copyHudLink('${v.name}', '${v.vid}', '${v.plate}')">
                        <i class="fa-solid fa-copy"></i> Salin Link
                    </button>
                    <button class="btn-delete" onclick="deleteVehicle(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function addVehicle(event) {
    event.preventDefault();
    
    const name = document.getElementById('input-name').value;
    const vid = document.getElementById('input-vid').value;
    const plate = document.getElementById('input-plate').value;

    // Nilai default awal saat ditambahkan
    const health = 100.0;
    const fuel = 100.0;

    vehicles.push({ name, vid, plate, health, fuel });
    renderVehicleList();

    document.getElementById('add-form').reset();
}

function deleteVehicle(index) {
    vehicles.splice(index, 1);
    renderVehicleList();
}

function copyHudLink(name, vid, plate) {
    const generatedUrl = `https://aliceaensley.github.io/spedoalice/index.html?name=${encodeURIComponent(name)}&vid=${vid}&plate=${plate}&v=1`;
    
    navigator.clipboard.writeText(generatedUrl).then(() => {
        alert(`Link HUD untuk ${name} berhasil disalin!\n\nURL: ${generatedUrl}`);
    });
}

document.addEventListener('DOMContentLoaded', renderVehicleList);

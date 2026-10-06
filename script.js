let elements = {};
let speedMode = 1;
let indicators = 0;
let maxFuelCapacity = 800; // Default

const onOrOff = state => state ? 'On' : 'Off';

// Fungsi membaca parameter dari URL Dashboard
function loadConfigFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const modelParam = urlParams.get('model');
    const maxFuelParam = urlParams.get('maxfuel');

    if (modelParam && elements.truckModel) {
        elements.truckModel.innerText = modelParam;
    }
    if (maxFuelParam) {
        maxFuelCapacity = parseInt(maxFuelParam);
    }
}

function setEngine(state) {
    elements.engine.innerText = onOrOff(state);
}

function setSpeed(speed) {
    switch(speedMode) {
        case 1: elements.speed.innerText = `${Math.round(speed * 2.236936)} MPH`; break;
        case 2: elements.speed.innerText = `${Math.round(speed * 1.943844)} Knots`; break;
        default: elements.speed.innerText = `${Math.round(speed * 3.6)} KMH`;
    }
}

function setRPM(rpm) {
    elements.rpm.innerText = `${rpm.toFixed(0)} RPM`;
}

function setFuel(fuelPercent) {
    // Menampilkan persentase dan estimasi liter berdasarkan maxFuel dari Dashboard
    const currentLiters = Math.round((fuelPercent) * maxFuelCapacity);
    elements.fuel.innerText = `${Math.round(fuelPercent * 100)}%/100% (${currentLiters}L)`;
}

function setHealth(health) {
    elements.health.innerText = `${Math.round(health * 100)}%/100%`;
}

function setGear(gear) {
    elements.gear.innerText = String(gear);
}

function setHeadlights(state) {
    switch(state) {
        case 1: elements.headlights.innerText = 'On'; break;
        case 2: elements.headlights.innerText = 'High Beam'; break;
        default: elements.headlights.innerText = 'Off';
    }
}

function setLeftIndicator(state) {
    indicators = (indicators & 0b10) | (state ? 0b01 : 0b00);
    elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;
}

function setRightIndicator(state) {
    indicators = (indicators & 0b01) | (state ? 0b10 : 0b00);
    elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;
}

function setSeatbelts(state) {
    elements.seatbelts.innerText = onOrOff(state);
}

function setOdometer(distance) {
    elements.odometer.innerText = distance.toFixed(1) + ' Miles';
}

// Inisialisasi Event listener FiveM NUI & Load Parameter URL
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        engine: document.getElementById('engine'),
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        gear: document.getElementById('gear'),
        headlights: document.getElementById('headlights'),
        indicators: document.getElementById('indicators'),
        seatbelts: document.getElementById('seatbelts'),
        odometer: document.getElementById('odometer'),
        truckModel: document.getElementById('truck-model')
    };

    // Muat konfigurasi dari URL Dashboard
    loadConfigFromURL();
});

// Listener Event dari FiveM NUI Lua Script
window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.type === "updateHUD") {
        if (data.truckModel && elements.truckModel) elements.truckModel.innerText = data.truckModel;
        if (data.speed !== undefined) setSpeed(data.speed);
        if (data.rpm !== undefined) setRPM(data.rpm);
        if (data.fuel !== undefined) setFuel(data.fuel);
        if (data.health !== undefined) setHealth(data.health);
        if (data.gear !== undefined) setGear(data.gear);
        if (data.engine !== undefined) setEngine(data.engine);
        if (data.odometer !== undefined) setOdometer(data.odometer);
    }
});

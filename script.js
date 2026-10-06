let elements = {};
let speedMode = 1;
let indicators = 0;

const onOrOff = state => state ? 'On' : 'Off';

// Fungsi membaca data (Nama, VID, Plat) dari URL Dashboard
function loadConfigFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('name');
    const vidParam = urlParams.get('vid');
    const plateParam = urlParams.get('plate');

    if (nameParam && elements.truckModel) elements.truckModel.innerText = nameParam;
    if (vidParam && elements.truckVid) elements.truckVid.innerText = vidParam;
    if (plateParam && elements.truckPlate) elements.truckPlate.innerText = plateParam;
}

function setEngine(state) {
    if (elements.engine) elements.engine.innerText = onOrOff(state);
}

function setSpeed(speed) {
    if (!elements.speed) return;
    switch(speedMode) {
        case 1: elements.speed.innerText = `${Math.round(speed * 2.236936)} MPH`; break;
        case 2: elements.speed.innerText = `${Math.round(speed * 1.943844)} Knots`; break;
        default: elements.speed.innerText = `${Math.round(speed * 3.6)} KMH`;
    }
}

// SISTEM RPM YANG DIPERBAIKI
function setRPM(rpm) {
    if (!elements.rpm) return;
    const val = Math.round(rpm);
    elements.rpm.innerText = `${val} RPM`;

    // Berubah warna merah/redline jika RPM tinggi (misal di atas 2500)
    if (val >= 2500) {
        elements.rpm.classList.add('rpm-high');
    } else {
        elements.rpm.classList.remove('rpm-high');
    }
}

function setFuel(fuelPercent) {
    if (elements.fuel) elements.fuel.innerText = `${Math.round(fuelPercent * 100)}%/100%`;
}

function setHealth(health) {
    if (elements.health) elements.health.innerText = `${Math.round(health * 100)}%/100%`;
}

function setGear(gear) {
    if (!elements.gear) return;
    if (gear === 0) {
        elements.gear.innerText = 'N';
    } else if (gear === -1) {
        elements.gear.innerText = 'R';
    } else {
        elements.gear.innerText = String(gear);
    }
}

function setHeadlights(state) {
    if (!elements.headlights) return;
    switch(state) {
        case 1: elements.headlights.innerText = 'On'; break;
        case 2: elements.headlights.innerText = 'High Beam'; break;
        default: elements.headlights.innerText = 'Off';
    }
}

function setLeftIndicator(state) {
    indicators = (indicators & 0b10) | (state ? 0b01 : 0b00);
    if (elements.indicators) {
        elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;
    }
}

function setRightIndicator(state) {
    indicators = (indicators & 0b01) | (state ? 0b10 : 0b00);
    if (elements.indicators) {
        elements.indicators.innerText = `${indicators & 0b01 ? 'On' : 'Off'} / ${indicators & 0b10 ? 'On' : 'Off'}`;
    }
}

function setSeatbelts(state) {
    if (elements.seatbelts) elements.seatbelts.innerText = onOrOff(state);
}

function setOdometer(distance) {
    if (elements.odometer) elements.odometer.innerText = distance.toFixed(1) + ' Miles';
}

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
        truckModel: document.getElementById('truck-model'),
        truckVid: document.getElementById('truck-vid'),
        truckPlate: document.getElementById('truck-plate')
    };

    loadConfigFromURL();
});

// Listener Event dari FiveM / NUI
window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.type === "updateHUD") {
        if (data.name && elements.truckModel) elements.truckModel.innerText = data.name;
        if (data.vid && elements.truckVid) elements.truckVid.innerText = data.vid;
        if (data.plate && elements.truckPlate) elements.truckPlate.innerText = data.plate;
        if (data.speed !== undefined) setSpeed(data.speed);
        if (data.rpm !== undefined) setRPM(data.rpm);
        if (data.fuel !== undefined) setFuel(data.fuel);
        if (data.health !== undefined) setHealth(data.health);
        if (data.gear !== undefined) setGear(data.gear);
        if (data.engine !== undefined) setEngine(data.engine);
        if (data.odometer !== undefined) setOdometer(data.odometer);
    }
});

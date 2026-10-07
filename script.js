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
    
    let calculatedSpeed = 0;
    switch(speedMode) {
        case 1: 
            calculatedSpeed = Math.round(speed * 2.236936);
            elements.speed.innerText = `${calculatedSpeed} MPH`; 
            break;
        case 2: 
            calculatedSpeed = Math.round(speed * 1.943844);
            elements.speed.innerText = `${calculatedSpeed} Knots`; 
            break;
        default: 
            calculatedSpeed = Math.round(speed * 3.6);
            elements.speed.innerText = `${calculatedSpeed} KMH`;
    }

    // Update Angka Kecepatan di Spedo Analog Kedua
    if (elements.analogSpeed) {
        elements.analogSpeed.innerText = calculatedSpeed;
    }
}

// SISTEM RPM DENGAN AUTO-CONVERT & DYNAMICAL REDLINE
function setRPM(rpm) {
    if (!elements.rpm) return;
    
    let realRpm = rpm;
    let normalizedRpm = rpm;

    // Jika game mengoperkan data rasio desimal (0.00 - 1.00)
    if (rpm <= 1.0) {
        realRpm = rpm * 8000; 
        normalizedRpm = rpm;
    } else {
        normalizedRpm = rpm / 8000; // Normalisasi ke 0.0 - 1.0 untuk jarum
    }

    const val = Math.round(realRpm);
    elements.rpm.innerText = `${val} RPM`;

    // Indikator Merah / Redline jika di atas 5500 RPM
    if (val >= 5500) {
        elements.rpm.classList.add('rpm-high');
    } else {
        elements.rpm.classList.remove('rpm-high');
    }

    // Rotasi Jarum di Spedo Analog Kedua (-135 deg sampai 135 deg)
    if (elements.analogNeedle) {
        const minAngle = -135;
        const maxAngle = 135;
        const currentRpm = Math.min(Math.max(normalizedRpm, 0), 1);
        const rotationAngle = minAngle + (currentRpm * (maxAngle - minAngle));
        
        elements.analogNeedle.style.transform = `rotate(${rotationAngle}deg)`;
    }
}

// FUEL DENGAN DESIMAL (KOMA)
function setFuel(fuelPercent) {
    if (elements.fuel) {
        const val = (fuelPercent * 100).toFixed(1).replace('.', ',');
        elements.fuel.innerText = `${val}%/100%`;
    }
}

// HEALTH DENGAN DESIMAL (KOMA)
function setHealth(health) {
    if (elements.health) {
        const val = (health * 100).toFixed(1).replace('.', ',');
        elements.health.innerText = `${val}%/100%`;
    }
}

function setGear(gear) {
    if (!elements.gear) return;
    
    let gearText = 'N';
    if (gear === 0) {
        gearText = 'N';
    } else if (gear === -1) {
        gearText = 'R';
    } else {
        gearText = String(gear);
    }

    elements.gear.innerText = gearText;

    // Update Gigi di Spedo Analog Kedua
    if (elements.analogGear) {
        elements.analogGear.innerText = gearText;
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
        truckPlate: document.getElementById('truck-plate'),
        // Elemen Spedo Kedua (Analog)
        analogSpeed: document.getElementById('analog-speed'),
        analogGear: document.getElementById('analog-gear'),
        analogNeedle: document.getElementById('analog-needle')
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
        if (data.headlights !== undefined) setHeadlights(data.headlights);
        if (data.seatbelts !== undefined) setSeatbelts(data.seatbelts);
    }
});

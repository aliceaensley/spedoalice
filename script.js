let elements = {};
let speedMode = 1;
let indicators = 0;
let lastSeatbeltState = null; // Menyimpan status terakhir seatbelt

const onOrOff = state => state ? 'On' : 'Off';

// Memuat Objek Audio tunggal (seatbelton.mp3)
const soundSeatbelt = new Audio('seatbelton.mp3');
soundSeatbelt.volume = 0.5; // Atur volume suara (0.0 - 1.0)

// Tabel Sudut Rotasi Presisi
const SPEED_ANGLES = [
    { speed: 0,   angle: 0 },
    { speed: 20,  angle: 21 },
    { speed: 40,  angle: 44 },
    { speed: 60,  angle: 68 },
    { speed: 80,  angle: 90 },
    { speed: 100, angle: 112 },
    { speed: 120, angle: 133 },
    { speed: 140, angle: 156 },
    { speed: 160, angle: 178 },
    { speed: 180, angle: 200 }
];

function calculatePreciseAngle(speed) {
    if (speed <= 0) return 0;
    if (speed >= 180) return 200;

    for (let i = 0; i < SPEED_ANGLES.length - 1; i++) {
        const p1 = SPEED_ANGLES[i];
        const p2 = SPEED_ANGLES[i + 1];

        if (speed >= p1.speed && speed <= p2.speed) {
            const ratio = (speed - p1.speed) / (p2.speed - p1.speed);
            return p1.angle + ratio * (p2.angle - p1.angle);
        }
    }
    return 0;
}

function loadConfigFromURL() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const nameParam = urlParams.get('name');
        const vidParam = urlParams.get('vid');
        const plateParam = urlParams.get('plate');

        if (nameParam && elements.truckModel) elements.truckModel.innerText = nameParam;
        if (vidParam && elements.truckVid) elements.truckVid.innerText = vidParam;
        if (plateParam && elements.truckPlate) elements.truckPlate.innerText = plateParam;
    } catch (e) {
        console.error("Error loading URL config:", e);
    }
}

function setEngine(state) {
    if (elements.engine) elements.engine.innerText = onOrOff(state);
}

function setSpeed(speed) {
    let calculatedSpeed = 0;
    switch(speedMode) {
        case 1: 
            calculatedSpeed = Math.round(speed * 2.236936);
            if (elements.speed) elements.speed.innerText = `${calculatedSpeed} MPH`; 
            break;
        case 2: 
            calculatedSpeed = Math.round(speed * 1.943844);
            if (elements.speed) elements.speed.innerText = `${calculatedSpeed} Knots`; 
            break;
        default: 
            calculatedSpeed = Math.round(speed * 3.6);
            if (elements.speed) elements.speed.innerText = `${calculatedSpeed} KMH`;
    }

    if (elements.analogSpeed) {
        elements.analogSpeed.innerText = calculatedSpeed;
    }

    if (elements.analogNeedle) {
        const rotationAngle = calculatePreciseAngle(calculatedSpeed);
        elements.analogNeedle.style.transform = `rotate(${rotationAngle}deg)`;
    }
}

function setRPM(rpm) {
    let realRpm = rpm;

    if (rpm <= 1.0) {
        realRpm = rpm * 8000; 
    }

    const val = Math.round(realRpm);
    
    if (elements.rpm) {
        elements.rpm.innerText = `${val} RPM`;
        if (val >= 5500) {
            elements.rpm.classList.add('rpm-high');
        } else {
            elements.rpm.classList.remove('rpm-high');
        }
    }
}

function setFuel(fuelPercent) {
    if (elements.fuel) {
        const val = (fuelPercent * 100).toFixed(1).replace('.', ',');
        elements.fuel.innerText = `${val}%/100%`;
    }
}

function setHealth(health) {
    if (elements.health) {
        const val = (health * 100).toFixed(1).replace('.', ',');
        elements.health.innerText = `${val}%/100%`;
    }
}

function setGear(gear) {
    let gearText = 'N';
    if (gear === 0) {
        gearText = 'N';
    } else if (gear === -1) {
        gearText = 'R';
    } else {
        gearText = String(gear);
    }

    if (elements.gear) elements.gear.innerText = gearText;

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

// LOGIKA PASANG / LEPAS SEATBELT DENGAN SATU AUDIO (seatbelton.mp3)
function setSeatbelts(state) {
    const isBeltOn = Boolean(state);

    if (elements.seatbelts) {
        elements.seatbelts.innerText = onOrOff(isBeltOn);
    }

    // Bunyikan seatbelton.mp3 setiap kali ada perubahan status (baik dari On ke Off, atau Off ke On)
    if (lastSeatbeltState !== null && lastSeatbeltState !== isBeltOn) {
        soundSeatbelt.currentTime = 0;
        soundSeatbelt.play().catch(e => console.log("Audio play error:", e));
    }

    lastSeatbeltState = isBeltOn;
}

function setOdometer(distance) {
    if (elements.odometer) elements.odometer.innerText = Number(distance).toFixed(1) + ' Miles';
}

function initElements() {
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
        analogSpeed: document.getElementById('analog-speed'),
        analogGear: document.getElementById('analog-gear'),
        analogNeedle: document.getElementById('analog-needle')
    };

    loadConfigFromURL();
    setSpeed(0);
}

document.addEventListener('DOMContentLoaded', initElements);

// Listener Event dari FiveM / NUI
window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data) return;

    if (!elements.speed) {
        initElements();
    }

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

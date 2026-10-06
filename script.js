let elements = {};

let speedMode = 0;
let indicators = 0;


/* =========================================================
   HELPER
   ========================================================= */

function onOrOff(state) {
    return state ? "ON" : "OFF";
}


/* =========================================================
   ENGINE
   ========================================================= */

function setEngine(state) {

    if (!elements.engine) return;

    elements.engine.innerText = onOrOff(state);

    elements.engine.classList.remove(
        "engine-on",
        "engine-off"
    );

    if (state) {
        elements.engine.classList.add("engine-on");
    } else {
        elements.engine.classList.add("engine-off");
    }
}


/* =========================================================
   SPEED
   ========================================================= */

function setSpeed(speed) {

    if (!elements.speed) return;

    let convertedSpeed = 0;
    let unit = "km/h";

    switch (speedMode) {

        // KM/H
        case 0:
            convertedSpeed = speed * 3.6;
            unit = "km/h";
            break;

        // MPH
        case 1:
            convertedSpeed = speed * 2.236936;
            unit = "mph";
            break;

        // KNOTS
        case 2:
            convertedSpeed = speed * 1.943844;
            unit = "kn";
            break;
    }

    elements.speed.innerText =
        Math.round(convertedSpeed);

    elements.speedUnit.innerText = unit;
}


/* =========================================================
   RPM
   ========================================================= */

function setRPM(rpm) {

    if (!elements.rpm) return;

    /*
        Template asli menggunakan 0 - 1.
        Kita tampilkan sebagai RPM yang lebih
        masuk akal untuk tampilan HUD.
    */

    let realRPM = rpm;

    if (rpm <= 1) {
        realRPM = rpm * 8000;
    }

    elements.rpm.innerText =
        Math.round(realRPM) + " RPM";
}


/* =========================================================
   FUEL
   ========================================================= */

function setFuel(fuel) {

    if (!elements.fuel) return;

    let percentage = fuel * 100;

    elements.fuel.innerText =
        Math.round(percentage) + "%";

    elements.fuel.classList.remove(
        "low-fuel",
        "medium-fuel",
        "normal-fuel"
    );

    if (percentage <= 20) {

        elements.fuel.classList.add(
            "low-fuel"
        );

    } else if (percentage <= 40) {

        elements.fuel.classList.add(
            "medium-fuel"
        );

    } else {

        elements.fuel.classList.add(
            "normal-fuel"
        );
    }
}


/* =========================================================
   HEALTH
   ========================================================= */

function setHealth(health) {

    /*
        Health tidak ditampilkan di HUD utama
        karena desain referensi tidak menggunakan
        health percentage.
    */

    return health;
}


/* =========================================================
   GEAR
   ========================================================= */

function setGear(gear) {

    if (!elements.gear) return;

    /*
        GTA/FiveM:
        0 = Neutral
        Gear negatif = Reverse
    */

    if (gear === 0) {

        elements.gear.innerText = "N";

    } else if (gear < 0) {

        elements.gear.innerText = "R" + Math.abs(gear);

    } else {

        elements.gear.innerText = String(gear);
    }
}


/* =========================================================
   HEADLIGHT
   ========================================================= */

function setHeadlights(state) {

    if (!elements.headlights) return;

    switch (state) {

        case 1:
            elements.headlights.innerText = "▮";
            break;

        case 2:
            elements.headlights.innerText = "▮▮";
            break;

        default:
            elements.headlights.innerText = "▯";
            break;
    }
}


/* =========================================================
   LEFT INDICATOR
   ========================================================= */

function setLeftIndicator(state) {

    indicators =
        (indicators & 0b10) |
        (state ? 0b01 : 0b00);

    updateIndicators();
}


/* =========================================================
   RIGHT INDICATOR
   ========================================================= */

function setRightIndicator(state) {

    indicators =
        (indicators & 0b01) |
        (state ? 0b10 : 0b00);

    updateIndicators();
}


/* =========================================================
   INDICATOR UPDATE
   ========================================================= */

function updateIndicators() {

    if (!elements.leftIndicator ||
        !elements.rightIndicator) {
        return;
    }

    elements.leftIndicator.classList.toggle(
        "active",
        Boolean(indicators & 0b01)
    );

    elements.rightIndicator.classList.toggle(
        "active",
        Boolean(indicators & 0b10)
    );
}


/* =========================================================
   SEATBELT
   ========================================================= */

function setSeatbelts(state) {

    /*
        Seatbelt tidak ditampilkan sebagai tulisan
        karena desain referensi menggunakan icon.
    */

    document.body.classList.toggle(
        "seatbelt-on",
        Boolean(state)
    );
}


/* =========================================================
   SPEED MODE
   ========================================================= */

function setSpeedMode(mode) {

    speedMode = mode;
}


/* =========================================================
   ODOMETER
   ========================================================= */

function setOdometer(distance) {

    if (!elements.odometer) return;

    /*
        Distance dari template lama berupa miles.
        Untuk HUD ini kita tampilkan KM.
    */

    let kilometers = distance;

    elements.odometer.innerText =
        kilometers.toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 1
            }
        ) + " km";
}


/* =========================================================
   VEHICLE NAME
   ========================================================= */

function setVehicleName(name) {

    if (!elements.vehicleName) return;

    elements.vehicleName.innerText =
        name || "Vehicle";
}


/* =========================================================
   PRESSURE
   ========================================================= */

function setPressure(pressure) {

    if (!elements.pressure) return;

    elements.pressure.innerText =
        Math.round(pressure) + " PSI";
}


/* =========================================================
   CARGO
   ========================================================= */

function setCargo(current, maximum) {

    if (!elements.cargo) return;

    elements.cargo.innerText =
        `${current} / ${maximum} L`;
}


/* =========================================================
   DISTANCE
   ========================================================= */

function setDistance(distance) {

    if (!elements.distance) return;

    elements.distance.innerText =
        Number(distance).toLocaleString(
            "en-US"
        ) + " km";
}


/* =========================================================
   CPU
   ========================================================= */

function setCPU(value) {

    if (!elements.cpu) return;

    elements.cpu.innerText =
        Math.round(value) + "%";
}


/* =========================================================
   MEMORY
   ========================================================= */

function setMemory(value) {

    if (!elements.memory) return;

    elements.memory.innerText =
        Math.round(value);
}


/* =========================================================
   GPU
   ========================================================= */

function setGPU(value) {

    if (!elements.gpu) return;

    elements.gpu.innerText =
        Math.round(value) + "%";
}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        elements = {

            vehicleName:
                document.getElementById(
                    "vehicleName"
                ),

            engine:
                document.getElementById(
                    "engine"
                ),

            speed:
                document.getElementById(
                    "speed"
                ),

            speedUnit:
                document.getElementById(
                    "speedUnit"
                ),

            rpm:
                document.getElementById(
                    "rpm"
                ),

            fuel:
                document.getElementById(
                    "fuel"
                ),

            health:
                document.getElementById(
                    "health"
                ),

            gear:
                document.getElementById(
                    "gear"
                ),

            headlights:
                document.getElementById(
                    "headlights"
                ),

            leftIndicator:
                document.getElementById(
                    "leftIndicator"
                ),

            rightIndicator:
                document.getElementById(
                    "rightIndicator"
                ),

            odometer:
                document.getElementById(
                    "odometer"
                ),

            pressure:
                document.getElementById(
                    "pressure"
                ),

            cargo:
                document.getElementById(
                    "cargo"
                ),

            distance:
                document.getElementById(
                    "distance"
                ),

            cpu:
                document.getElementById(
                    "cpu"
                ),

            memory:
                document.getElementById(
                    "memory"
                ),

            gpu:
                document.getElementById(
                    "gpu"
                )
        };


        /*
            DEFAULT DISPLAY
        */

        setVehicleName("DAF XF");

        setEngine(false);

        setSpeed(0);

        setRPM(0);

        setFuel(0.33);

        setGear(-1);

        setHeadlights(0);

        setOdometer(9315);

        setPressure(145);

        setCargo(592, 800);

        setDistance(2091);

        setCPU(35);

        setMemory(29);

        setGPU(83);

    }
);

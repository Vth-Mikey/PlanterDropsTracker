const readline = require('readline');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'logs.json');

// --- DATABASE (With Reminders) ---
const planterData = {
    "Plastic Planter": [
        { id: "plas_wax", label: "1x Swirled Wax", field: "Coconut", cd: 36, note: "" },
        { id: "plas_caus", label: "1x Caustic Wax", field: "Rose", cd: 36, note: "" },
        { id: "plas_smooth", label: "1x Super Smoothie", field: "Any", cd: 36, note: "" }
    ],
    "Candy Planter": [
        { id: "can_wax", label: "1x Swirled Wax", field: "Cactus", cd: 36, note: "" },
        { id: "can_caus", label: "1x Caustic Wax", field: "Mountain Top", cd: 36, note: "" },
        { id: "can_glue", label: "10x Glues", field: "Stump", cd: 7, note: "Requires 3x fully grown harvests in a row." }
    ],
    "Red Clay Planter": [
        { id: "red_wax_m", label: "1x Swirled Wax (Monthly)", field: "Sunflower", cd: 36, note: "" },
        { id: "red_caus", label: "1x Caustic Wax", field: "Clover", cd: 36, note: "" },
        { id: "red_sting", label: "10x Stingers", field: "Clover/Spider/Cactus", cd: 14, note: "Sequence: Clover -> Spider -> Cactus." },
        { id: "red_wax_w", label: "1x Swirled Wax (Weekly)", field: "Pine Tree Forest", cd: 7, note: "" }
    ],
    "Blue Clay Planter": [
        { id: "blue_wax", label: "1x Swirled Wax + 10-15 Micro-Converters", field: "Spider", cd: 36, note: "" },
        { id: "blue_caus", label: "1x Caustic Wax", field: "Clover", cd: 36, note: "" }
    ],
    "Tacky Planter": [
        { id: "tack_wax", label: "1x Swirled Wax", field: "Pumpkin Patch", cd: 36, note: "" },
        { id: "tack_caus", label: "1x Caustic Wax", field: "Bamboo", cd: 36, note: "" },
        { id: "tack_dice", label: "1x Loaded Dice", field: "Mountain Top", cd: 36, note: "" }
    ],
    "Pesticide Planter": [
        { id: "pest_wax", label: "1x Swirled Wax + 100 Bitterberries", field: "Strawberry", cd: 36, note: "Cooldown starts ONLY after Strawberry harvest." },
        { id: "pest_neon", label: "25+ Neonberries", field: "Stump/MT/Coco", cd: 7, note: "Sequence: Stump -> MT -> Coco." }
    ],
    "Heat-Treated Planter": [
        { id: "heat_red", label: "100x Red Extracts", field: "Mush/Straw/Rose/Pepper", cd: 36, note: "Sequence: Mush -> Straw -> Rose -> Pepper." },
        { id: "heat_enz", label: "100x Enzymes", field: "Pineapple", cd: 36, note: "Requires 3x harvests in a row." },
        { id: "heat_wax", label: "1x Swirled Wax", field: "Blue Flower", cd: 36, note: "" },
        { id: "heat_caus", label: "1x Caustic Wax", field: "Coconut", cd: 36, note: "" },
        { id: "heat_dice", label: "1x Loaded Dice", field: "Mushroom", cd: 1, note: "" }
    ],
    "Hydroponic Planter": [
        { id: "hyd_blue", label: "100x Blue Extracts", field: "Blue/Bam/Pine/Stump", cd: 36, note: "Sequence: Blue -> Bam -> Pine -> Stump." },
        { id: "hyd_oil", label: "100x Oils", field: "Sunflower", cd: 36, note: "Requires 3x harvests in a row." },
        { id: "hyd_wax", label: "1x Swirled Wax", field: "Mushroom", cd: 36, note: "" },
        { id: "hyd_caus", label: "1x Caustic Wax", field: "Coconut", cd: 36, note: "" },
        { id: "hyd_dice", label: "1x Loaded Dice", field: "Blue Flower", cd: 1, note: "" }
    ],
    "Petal Planter": [
        { id: "pet_wax", label: "1x Swirled Wax", field: "Strawberry", cd: 36, note: "" },
        { id: "pet_caus", label: "1x Caustic Wax", field: "Dandelion", cd: 36, note: "" }
    ],
    "Planter of Plenty": [
        { id: "plen_smooth", label: "10x Super Smoothies", field: "Bamboo", cd: 36, note: "" },
        { id: "plen_wax", label: "5x Swirled Waxes", field: "Any", cd: 36, note: "" }
    ]
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// --- HELPERS ---
function loadLogs() {
    if (!fs.existsSync(LOG_FILE)) return {};
    try { return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); } catch (e) { return {}; }
}

function saveLog(id, nextDate) {
    const logs = loadLogs();
    logs[id] = nextDate.getTime();
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

function getStatus(id) {
    const logs = loadLogs();
    if (!logs.hasOwnProperty(id)) return { type: "untracked", text: "Untracked" };
    const now = new Date().getTime();
    const target = logs[id];
    if (now >= target) return { type: "ready", text: "Ready!" };
    const diff = target - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { type: "active", text: `${days}d ${hours}h remaining` };
}

// --- CORE UI ---
function showSummary() {
    console.log("\n======= 📊 SUMMARY =======");
    let count = 0;
    Object.keys(planterData).forEach(name => {
        planterData[name].forEach(drop => {
            const status = getStatus(drop.id);
            if (status.type === "active") {
                console.log(`[⏳] ${name} -> ${drop.label}`);
                console.log(`    Time: \x1b[31m${status.text}\x1b[0m`);
                console.log("---------------------------------------");
                count++;
            }
        });
    });
    if (count === 0) console.log("\x1b[90mNo active trackers found.\x1b[0m");
    rl.question("\nPress Enter to return...", () => startLogbook());
}

function resetSystem() {
    console.log("\n\x1b[41m\x1b[37m !!! DANGER ZONE !!! \x1b[0m");
    rl.question("Type 'RESET' to wipe all logs or Enter to cancel: ", (ans) => {
        if (ans === 'RESET') {
            if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);
            console.log("\n\x1b[32mAll records cleared.\x1b[0m");
        }
        startLogbook();
    });
}

function startLogbook() {
    const planters = Object.keys(planterData);
    console.log("\n======= 🐝 PLANTER LOGBOOK =======");
    console.log("[ O ] SUMMARY   [ R ] RESET");
    console.log("---------------------------------------");
    
    planters.forEach((name, index) => {
        const statuses = planterData[name].map(d => getStatus(d.id).type);
        let icon = "⚪"; 
        if (statuses.includes("active")) icon = "⏳";
        else if (statuses.includes("ready")) icon = "✅";
        console.log(`${index + 1}. ${icon} ${name}`);
    });
    console.log("0. Exit");

    rl.question("\nSelection (Number/O/R): ", (choice) => {
        const input = choice.toLowerCase();
        if (input === '0') process.exit();
        if (input === 'o') return showSummary();
        if (input === 'r') return resetSystem();
        
        const selectedPlanter = planters[parseInt(choice) - 1];
        if (!selectedPlanter) return startLogbook();

        const options = planterData[selectedPlanter];
        console.log(`\n--- [ ${selectedPlanter} ] ---`);
        options.forEach((opt, index) => {
            const status = getStatus(opt.id);
            let color = status.type === "active" ? "\x1b[31m" : status.type === "ready" ? "\x1b[32m" : "\x1b[90m";
            console.log(`${index + 1}. ${opt.label} (${color}${status.text}\x1b[0m)`);
            if(opt.note) console.log(`   \x1b[33m└─ REMINDER: ${opt.note}\x1b[0m`);
        });

        rl.question("\nSelect Drop to Check In (0 to back): ", (dropChoice) => {
            if (dropChoice === '0') return startLogbook();
            const selectedDrop = options[parseInt(dropChoice) - 1];
            if (!selectedDrop) return startLogbook();

            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + selectedDrop.cd);
            saveLog(selectedDrop.id, nextDate);
            console.log(`\nSUCCESS: ${selectedDrop.label} is now being tracked.`);
            startLogbook();
        });
    });
}

startLogbook();

const tableBody = document.querySelector("#statsTable tbody");
const table = document.querySelector("#statsTable");

const sheetURL = "https://docs.google.com/spreadsheets/d/1a3i94-Ig89g-mdsXQlQinsYjNSTqdKFyF0ilvbo-gxU/export?format=csv";

let players = [];
let sortDirection = 1;

function safeValue(v){
    if(v === "" || v === undefined){
        return "--";
    }
    return v;
}

fetch(sheetURL)
.then(res => res.text())
.then(csv => {

    const rows = csv.split("\n").slice(1);

    rows.forEach(row => {

        const cols = row.split(",");

        const player = {
            STT: safeValue(cols[0]),
            Team: safeValue(cols[1]),
            Player: safeValue(cols[2]),
            Pos: safeValue(cols[3]),
            No: safeValue(cols[4]),
            Height: safeValue(cols[5]),
            Weight: safeValue(cols[6]),
            Birth: safeValue(cols[7]),
Age: (() => {
    const raw = cols[7] ? cols[7].trim() : "";
    if (!raw || raw === "--") return "--";
    let year;
    if (/^\d{4}$/.test(raw)) {
        year = parseInt(raw);
    } else {
        const parts = raw.split("/");
        if (parts.length === 3) {
            year = parseInt(parts[0]) > 31 ? parseInt(parts[0]) : parseInt(parts[2]);
        }
    }
    if (!year || isNaN(year)) return "--";
    return new Date().getFullYear() - year;
})(),

            G: safeValue(cols[8]),
            OG: safeValue(cols[9]),
            PEN: safeValue(cols[10]),
            YC: safeValue(cols[11]),
            RC: safeValue(cols[12]),

            M: safeValue(cols[13]),
            A: safeValue(cols[14]),
            S: safeValue(cols[15]),
            SOT: safeValue(cols[16]),
            KP: safeValue(cols[17]),
            T: safeValue(cols[18]),
            INT: safeValue(cols[19]),

            G90: safeValue(cols[20]),
            A90: safeValue(cols[21]),
            S90: safeValue(cols[22])
        };

        players.push(player);

    });

    initPositionFilter();
    populateTeamFilter();
    applyFilters();

});

// Các vị trí mặc định hiển thị
const defaultPositions = ["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"];

function initPositionFilter() {
    // Lấy tất cả vị trí unique từ data
    const priority = ["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"];
    const allRaw = [...new Set(players.map(p => p.Pos).filter(p => p && p !== "--"))];
    const allPositions = [
        ...priority.filter(p => allRaw.includes(p)),
        ...allRaw.filter(p => !priority.includes(p)).sort()
    ];

    const menu = document.getElementById("posDropdownMenu");
    menu.innerHTML = "";

    // Nút Select All / Clear All
    const actions = document.createElement("div");
    actions.className = "pos-actions";
    actions.innerHTML = `<span onclick="selectAllPos()">Tất cả</span> / <span onclick="clearAllPos()">Xóa hết</span>`;
    menu.appendChild(actions);

    allPositions.forEach(pos => {
        const label = document.createElement("label");
        const checked = defaultPositions.includes(pos) ? "checked" : "";
        label.innerHTML = `<input type="checkbox" value="${pos}" ${checked} onchange="applyFilters()"> ${pos}`;
        menu.appendChild(label);
    });
}

function getSelectedPositions() {
    return [...document.querySelectorAll("#posDropdownMenu input[type=checkbox]:checked")].map(cb => cb.value);
}

function selectAllPos() {
    document.querySelectorAll("#posDropdownMenu input[type=checkbox]").forEach(cb => cb.checked = true);
    applyFilters();
}

function clearAllPos() {
    document.querySelectorAll("#posDropdownMenu input[type=checkbox]").forEach(cb => cb.checked = false);
    applyFilters();
}

// Toggle dropdown
document.getElementById("posDropdownBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("posDropdownMenu").classList.toggle("open");
});

document.addEventListener("click", () => {
    document.getElementById("posDropdownMenu").classList.remove("open");
});

function applyFilters() {
    const search = document.getElementById("searchPlayer").value.toLowerCase();
    const team = document.getElementById("teamFilter").value;
    const selectedPos = getSelectedPositions();

    const filtered = players.filter(p => {
        const matchSearch = p.Player.toLowerCase().includes(search);
        const matchTeam = team === "all" || p.Team === team;
        const matchPos = selectedPos.includes(p.Pos);
        return matchSearch && matchTeam && matchPos;
    });

    renderTable(filtered);
}

function renderTable(data){

    tableBody.innerHTML = "";

    data.forEach(player => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
<td>${player.Team}</td>
<td>${player.Player}</td>
<td>${player.Pos}</td>
<td>${player.No}</td>

<td>${player.Height}</td>
<td>${player.Weight}</td>
<td>${player.Age}</td>

<td>${player.G}</td>
<td>${player.OG}</td>
<td>${player.PEN}</td>
<td>${player.YC}</td>
<td>${player.RC}</td>

<td>${player.M}</td>
<td>${player.A}</td>
<td>${player.S}</td>
<td>${player.SOT}</td>
<td>${player.KP}</td>
<td>${player.T}</td>
<td>${player.INT}</td>

<td>${player.G90}</td>
<td>${player.A90}</td>
<td>${player.S90}</td>
`;

        tr.addEventListener("click", () => showPlayerDetail(player));

        tableBody.appendChild(tr);

    });

}

const columnKeys = [
"Team",
"Player",
"Pos",
"No",
"Height",
"Weight",
"Age",
"G",
"OG",
"PEN",
"YC",
"RC",
"M",
"A",
"S",
"SOT",
"KP",
"T",
"INT",
"G90",
"A90",
"S90"
];

function showPlayerDetail(player){

alert(
`Player: ${player.Player}

Team: ${player.Team}
Position: ${player.Pos}

Height: ${player.Height}
Weight: ${player.Weight}

Goals: ${player.G}
Assists: ${player.A}

Shots: ${player.S}
Shots on Target: ${player.SOT}

Key Pass: ${player.KP}
Tackles: ${player.T}
Interceptions: ${player.INT}`
);

}

const headers = table.querySelectorAll("thead th");

headers.forEach((header, index) => {

    if(index < 3) return; // 4 cột đầu không sort

    header.style.cursor = "pointer";

    header.addEventListener("click", () => {

        const key = columnKeys[index];

        players.sort((a,b) => {

let A = a[key];
let B = b[key];

// Đẩy "--" xuống cuối
if(A === "--" && B === "--") return 0;
if(A === "--") return 1;
if(B === "--") return -1;

if(!isNaN(A)) A = Number(A);
if(!isNaN(B)) B = Number(B);

if(A > B) return -sortDirection;
if(A < B) return sortDirection;
return 0;

});

sortDirection *= -1;

applyFilters();

    });

});

// Populate team dropdown
function populateTeamFilter() {
    const teams = [...new Set(players.map(p => p.Team).filter(t => t && t !== "--"))].sort();
    const sel = document.getElementById("teamFilter");
    teams.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        sel.appendChild(opt);
    });
}

document.getElementById("searchPlayer").addEventListener("input", applyFilters);
document.getElementById("teamFilter").addEventListener("change", applyFilters);

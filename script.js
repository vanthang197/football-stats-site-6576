const tableBody = document.querySelector("#statsTable tbody");
const table = document.querySelector("#statsTable");

const sheetURL = "https://docs.google.com/spreadsheets/d/1a3i94-Ig89g-mdsXQlQinsYjNSTqdKFyF0ilvbo-gxU/export?format=csv";

let players = [];
let sortDirection = 1;

function safeValue(v){
    if(v === "" || v === undefined || v === null){
        return "--";
    }
    return v.trim();
}


fetch(sheetURL)
.then(res => res.text())
.then(csv => {

    const rows = csv.split("\n").slice(1);

    rows.forEach(row => {
        const cols = row.split(",");

        const player = {
            STT:    safeValue(cols[0]),
            Season: safeValue(cols[1]),
            League: safeValue(cols[2]),
            Team:   safeValue(cols[3]),
            Player: safeValue(cols[4]),
            Pos:    safeValue(cols[5]),
            No:     safeValue(cols[6]),
            Height: safeValue(cols[7]),
            Weight: safeValue(cols[8]),
            Birth:  safeValue(cols[9]),
            Age: (() => {
                const raw = cols[9] ? cols[9].trim() : "";
                if (!raw || raw === "--") return "--";
                let year;
                if (/^\d{4}$/.test(raw)) {
                    year = parseInt(raw);
                } else {
                    const parts = raw.split(/[-\/]/);
                    if (parts.length === 3) {
                        year = parseInt(parts[0]) > 31 ? parseInt(parts[0]) : parseInt(parts[2]);
                    }
                }
                if (!year || isNaN(year)) return "--";
                return new Date().getFullYear() - year;
            })(),
            G:   safeValue(cols[10]),
            OG:  safeValue(cols[11]),
            PEN: safeValue(cols[12]),
            YC:  safeValue(cols[13]),
            RC:  safeValue(cols[14]),
            M:   safeValue(cols[15]),
            A:   safeValue(cols[16]),
            S:   safeValue(cols[17]),
            SOT: safeValue(cols[18]),
            KP:  safeValue(cols[19]),
            T:   safeValue(cols[20]),
            INT: safeValue(cols[21]),
            G90: safeValue(cols[22]),
            A90: safeValue(cols[23]),
            S90: safeValue(cols[24])
        };

        players.push(player);
    });

    initSeasonFilter();
    initLeagueFilter();
    initTeamFilter();
    initPositionFilter();
    applyFilters();
});

// =====================
// SEASON FILTER
// =====================
const defaultSeason = "25/26";

function initSeasonFilter() {
    const seasons = [...new Set(players.map(p => p.Season).filter(s => s && s !== "--"))].sort().reverse();
    const menu = document.getElementById("seasonDropdownMenu");
    menu.innerHTML = "";
    const actions = document.createElement("div");
    actions.className = "pos-actions";
    actions.innerHTML = `<span onclick="selectAllSeason()">Tất cả</span> / <span onclick="clearAllSeason()">Xóa hết</span>`;
    menu.appendChild(actions);
    seasons.forEach(s => {
        const label = document.createElement("label");
        const checked = s === defaultSeason ? "checked" : "";
        label.innerHTML = `<input type="checkbox" value="${s}" ${checked} onchange="applyFilters()"> ${s}`;
        menu.appendChild(label);
    });
}

function getSelectedSeasons() {
    return [...document.querySelectorAll("#seasonDropdownMenu input[type=checkbox]:checked")].map(cb => cb.value);
}

function selectAllSeason() {
    document.querySelectorAll("#seasonDropdownMenu input[type=checkbox]").forEach(cb => cb.checked = true);
    applyFilters();
}
function clearAllSeason() {
    document.querySelectorAll("#seasonDropdownMenu input[type=checkbox]").forEach(cb => cb.checked = false);
    applyFilters();
}

document.getElementById("seasonDropdownBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllDropdowns("seasonDropdownMenu");
    document.getElementById("seasonDropdownMenu").classList.toggle("open");
});

// =====================
// LEAGUE FILTER
// =====================
const defaultLeagues = ["V-League 1", "V-League 2"];

function initLeagueFilter() {
    const leagues = [...new Set(players.map(p => p.League).filter(l => l && l !== "--"))].sort();
    const menu = document.getElementById("leagueDropdownMenu");
    menu.innerHTML = "";
    const actions = document.createElement("div");
    actions.className = "pos-actions";
    actions.innerHTML = `<span onclick="selectAllLeague()">Tất cả</span> / <span onclick="clearAllLeague()">Xóa hết</span>`;
    menu.appendChild(actions);
    leagues.forEach(l => {
        const label = document.createElement("label");
        const checked = defaultLeagues.includes(l) ? "checked" : "";
        label.innerHTML = `<input type="checkbox" value="${l}" ${checked} onchange="applyFilters()"> ${l}`;
        menu.appendChild(label);
    });
}

function getSelectedLeagues() {
    return [...document.querySelectorAll("#leagueDropdownMenu input[type=checkbox]:checked")].map(cb => cb.value);
}

function selectAllLeague() {
    document.querySelectorAll("#leagueDropdownMenu input[type=checkbox]").forEach(cb => cb.checked = true);
    applyFilters();
}
function clearAllLeague() {
    document.querySelectorAll("#leagueDropdownMenu input[type=checkbox]").forEach(cb => cb.checked = false);
    applyFilters();
}

document.getElementById("leagueDropdownBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllDropdowns("leagueDropdownMenu");
    document.getElementById("leagueDropdownMenu").classList.toggle("open");
});

// =====================
// TEAM FILTER
// =====================
function initTeamFilter() {
    const teams = [...new Set(players.map(p => p.Team).filter(t => t && t !== "--"))].sort();
    const menu = document.getElementById("teamDropdownMenu");
    menu.innerHTML = "";
    const actions = document.createElement("div");
    actions.className = "pos-actions";
    actions.innerHTML = `<span onclick="selectAllTeam()">Tất cả</span> / <span onclick="clearAllTeam()">Xóa hết</span>`;
    menu.appendChild(actions);
    teams.forEach(t => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" value="${t}" checked onchange="applyFilters()"> ${t}`;
        menu.appendChild(label);
    });
}

function getSelectedTeams() {
    return [...document.querySelectorAll("#teamDropdownMenu input[type=checkbox]:checked")].map(cb => cb.value);
}

function selectAllTeam() {
    document.querySelectorAll("#teamDropdownMenu input[type=checkbox]").forEach(cb => cb.checked = true);
    applyFilters();
}
function clearAllTeam() {
    document.querySelectorAll("#teamDropdownMenu input[type=checkbox]").forEach(cb => cb.checked = false);
    applyFilters();
}

document.getElementById("teamDropdownBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllDropdowns("teamDropdownMenu");
    document.getElementById("teamDropdownMenu").classList.toggle("open");
});

// =====================
// POSITION FILTER
// =====================
const defaultPositions = ["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"];

function initPositionFilter() {
    const priority = ["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"];
    const allRaw = [...new Set(players.map(p => p.Pos).filter(p => p && p !== "--"))];
    const allPositions = [
        ...priority.filter(p => allRaw.includes(p)),
        ...allRaw.filter(p => !priority.includes(p)).sort()
    ];

    const menu = document.getElementById("posDropdownMenu");
    menu.innerHTML = "";
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

document.getElementById("posDropdownBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllDropdowns("posDropdownMenu");
    document.getElementById("posDropdownMenu").classList.toggle("open");
});

// =====================
// CLOSE ALL DROPDOWNS
// =====================
function closeAllDropdowns(except) {
    ["seasonDropdownMenu","leagueDropdownMenu","teamDropdownMenu","posDropdownMenu"].forEach(id => {
        if (id !== except) document.getElementById(id).classList.remove("open");
    });
}

document.addEventListener("click", () => {
    ["seasonDropdownMenu","leagueDropdownMenu","teamDropdownMenu","posDropdownMenu"].forEach(id => {
        document.getElementById(id).classList.remove("open");
    });
});

// =====================
// APPLY FILTERS
// =====================
function applyFilters() {
    const search = document.getElementById("searchPlayer").value.toLowerCase();
    const selectedSeasons = getSelectedSeasons();
    const selectedLeagues = getSelectedLeagues();
    const selectedTeams = getSelectedTeams();
    const selectedPos = getSelectedPositions();

    const filtered = players.filter(p => {
        const matchSearch = p.Player.toLowerCase().includes(search);
        const matchSeason = selectedSeasons.includes(p.Season);
        const matchLeague = selectedLeagues.includes(p.League);
        const matchTeam = selectedTeams.includes(p.Team);
        const matchPos = selectedPos.includes(p.Pos);
        return matchSearch && matchSeason && matchLeague && matchTeam && matchPos;
    });

    renderTable(filtered);
}

document.getElementById("searchPlayer").addEventListener("input", applyFilters);

// =====================
// RENDER TABLE
// =====================
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

// =====================
// SORT
// =====================
const columnKeys = [
"Team","Player","Pos","No",
"Height","Weight","Age",
"G","OG","PEN","YC","RC",
"M","A","S","SOT","KP","T","INT",
"G90","A90","S90"
];

const headers = table.querySelectorAll("thead th");

headers.forEach((header, index) => {
    if(index < 0) return;
    header.style.cursor = "pointer";
    header.addEventListener("click", () => {
        const key = columnKeys[index];
        players.sort((a,b) => {
            let A = a[key];
            let B = b[key];
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

// =====================
// PLAYER DETAIL
// =====================
function showPlayerDetail(player){
    alert(
`Player: ${player.Player}

Team: ${player.Team}
League: ${player.League}
Season: ${player.Season}
Position: ${player.Pos}

Height: ${player.Height}
Weight: ${player.Weight}
Age: ${player.Age}

Goals: ${player.G}
Assists: ${player.A}

Shots: ${player.S}
Shots on Target: ${player.SOT}

Key Pass: ${player.KP}
Tackles: ${player.T}
Interceptions: ${player.INT}`
    );
}

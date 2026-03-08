const tableBody = document.querySelector("#statsTable tbody");
const table = document.querySelector("#statsTable");

const sheetURL = "https://docs.google.com/spreadsheets/d/1a3i94-Ig89g-mdsXQlQinsYjNSTqdKFyF0ilvbo-gxU/export?format=csv";

let players = [];
let sortDirection = 1;

function safeValue(v){
    if(v === "" || v === undefined || v === null) return "--";
    return v.trim();
}

fetch(sheetURL)
.then(res => res.text())
.then(csv => {

    const allRows = csv.split("\n");
    const headers = allRows[0].split(",").map(h => h.trim());

// Tự render header từ Sheets — bỏ 2 cột đầu
const headerRow = document.getElementById("tableHeader");
headers.slice(2).forEach((h, i, arr) => {
    const th = document.createElement("th");
    th.className = "sortable";
    th.textContent = h;
    headerRow.appendChild(th);


    // Chèn cột Tuổi ngay sau Năm sinh
    if (h === arr.length - 1) {
        const thTuoi = document.createElement("th");
        thTuoi.className = "sortable";
        thTuoi.textContent = "Tuổi";
        headerRow.appendChild(thTuoi);
    }
});

    // Đọc data — mỗi player là object với key = tên cột Sheets
    allRows.slice(1).forEach(row => {
        if (!row.trim()) return;
        const cols = row.split(",");
        const player = {};
        headers.forEach((h, i) => {
            player[h] = safeValue(cols[i]);
        });

        // Tính tuổi từ cột "Năm sinh"
        const birth = player["Năm sinh"] || "";
        player["Tuổi"] = (() => {
            if (!birth || birth === "--") return "--";
            let year;
            if (/^\d{4}$/.test(birth)) year = parseInt(birth);
            else {
                const parts = birth.split(/[-\/]/);
                if (parts.length === 3)
                    year = parseInt(parts[0]) > 31 ? parseInt(parts[0]) : parseInt(parts[2]);
            }
            return (!year || isNaN(year)) ? "--" : new Date().getFullYear() - year;
        })();

        players.push(player);
    });

    initSeasonFilter();
    initLeagueFilter();
    initTeamFilter();
    initPositionFilter();
// Sort mặc định theo Goal giảm dần
// Thêm header Tuổi vào cuối vì data cũng có Tuổi ở cuối
const thTuoi = document.createElement("th");
thTuoi.className = "sortable";
thTuoi.textContent = "Tuổi";
document.getElementById("tableHeader").appendChild(thTuoi);
players.sort((a, b) => {
    const A = isNaN(a["G"]) ? -1 : Number(a["G"]);
    const B = isNaN(b["G"]) ? -1 : Number(b["G"]);
    return B - A;
});

applyFilters();
});

// =====================
// SEASON FILTER
// =====================
const defaultSeason = "25/26";

function initSeasonFilter() {
    const seasons = [...new Set(players.map(p => p["Mùa giải"]).filter(s => s && s !== "--"))].sort().reverse();
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
    const leagues = [...new Set(players.map(p => p["Giải đấu"]).filter(l => l && l !== "--"))].sort();
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
    const teams = [...new Set(players.map(p => p["Team"]).filter(t => t && t !== "--"))].sort();
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
    const allRaw = [...new Set(players.map(p => p["Pos"]).filter(p => p && p !== "--"))];
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
        const matchSearch = (p["Player"] || "").toLowerCase().includes(search);
        const matchSeason = selectedSeasons.includes(p["Mùa giải"]);
        const matchLeague = selectedLeagues.includes(p["Giải đấu"]);
        const matchTeam   = selectedTeams.includes(p["Team"]);
        const matchPos    = selectedPos.includes(p["Pos"]);
        return matchSearch && matchSeason && matchLeague && matchTeam && matchPos;
    });

    renderTable(filtered);
}
document.getElementById("searchPlayer").addEventListener("input", applyFilters);

// =====================
// RENDER TABLE
// =====================
function renderTable(data) {
    tableBody.innerHTML = "";
    if (!data.length) return;
    const hdrs = Object.keys(data[0]).slice(2);   // ← bỏ 2 cột đầu
    data.forEach(player => {
        const tr = document.createElement("tr");
        hdrs.forEach(h => {
            const td = document.createElement("td");
            td.textContent = player[h];
            tr.appendChild(td);
        });
        tr.addEventListener("click", () => showPlayerDetail(player));
        tableBody.appendChild(tr);
    });
}

// =====================
// SORT
// =====================
document.addEventListener("click", e => {
    if (e.target.tagName === "TH") {
        const key = e.target.textContent.trim();
        players.sort((a, b) => {
            let A = a[key], B = b[key];
            if (A === "--" && B === "--") return 0;
            if (A === "--") return 1;
            if (B === "--") return -1;
            if (!isNaN(A) && !isNaN(B)) { A = Number(A); B = Number(B); }
            return A > B ? -sortDirection : A < B ? sortDirection : 0;
        });
        sortDirection *= -1;
        applyFilters();
    }
});

// =====================
// PLAYER DETAIL
// =====================
function showPlayerDetail(player) {
    alert(
`Player: ${player["Player"]}

Team: ${player["Team"]}
League: ${player["Giải đấu"]}
Season: ${player["Mùa giải"]}
Position: ${player["Pos"]}

Height: ${player["Cao (cm)"]}
Weight: ${player["Nặng (kg)"]}
Age: ${player["Tuổi"]}

Goals: ${player["Goal (Bàn thắng)"]}
Assists: ${player["A"]}

Shots: ${player["S"]}
Shots on Target: ${player["SOT"]}

Key Pass: ${player["KP"]}
Tackles: ${player["T"]}
Interceptions: ${player["INT"]}`
    );
}

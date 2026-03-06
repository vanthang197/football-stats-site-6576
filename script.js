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

    renderTable(players);

});

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
<td>${player.Birth}</td>

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
"Birth",
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

if(!isNaN(A)) A = Number(A);
if(!isNaN(B)) B = Number(B);

if(A > B) return -sortDirection;
if(A < B) return sortDirection;
return 0;

});

sortDirection *= -1;

renderTable(players);

    });

});
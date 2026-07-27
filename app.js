// === WuWa Tower Planner ===
// Pick your characters → Get your teams

const ALL_CHARS = [
    // 5-Star DPS
    { name: "Sigrika", element: "spectro", role: "DPS", rarity: 5 },
    { name: "Aemeath", element: "havoc", role: "DPS", rarity: 5 },
    { name: "Augusta", element: "electro", role: "DPS", rarity: 5 },
    { name: "Phrolova", element: "havoc", role: "DPS", rarity: 5 },
    { name: "Hiyuki", element: "glacio", role: "DPS", rarity: 5 },
    { name: "Cartethyia", element: "glacio", role: "DPS", rarity: 5 },
    { name: "Jinhsi", element: "spectro", role: "DPS", rarity: 5 },
    { name: "Camellya", element: "havoc", role: "DPS", rarity: 5 },
    { name: "Changli", element: "fusion", role: "DPS", rarity: 5 },
    { name: "Calcharo", element: "electro", role: "DPS", rarity: 5 },
    { name: "Jiyan", element: "aero", role: "DPS", rarity: 5 },
    { name: "Encore", element: "fusion", role: "DPS", rarity: 5 },
    { name: "Xiangli Yao", element: "electro", role: "DPS", rarity: 5 },
    // 5-Star Sub/Support
    { name: "Ciaccona", element: "aero", role: "SUP", rarity: 5 },
    { name: "Qiuyuan", element: "spectro", role: "SUB", rarity: 5 },
    { name: "Cantarella", element: "havoc", role: "SUB", rarity: 5 },
    { name: "Yinlin", element: "electro", role: "SUB", rarity: 5 },
    { name: "Zhezhi", element: "glacio", role: "SUB", rarity: 5 },
    { name: "Lynae", element: "fusion", role: "SUB", rarity: 5 },
    { name: "Mornye", element: "havoc", role: "SUP", rarity: 5 },
    // 5-Star Healers
    { name: "Shorekeeper", element: "spectro", role: "HEAL", rarity: 5 },
    { name: "Verina", element: "spectro", role: "HEAL", rarity: 5 },
    { name: "Suisui", element: "glacio", role: "HEAL", rarity: 5 },
    // 4-Star
    { name: "Mortefi", element: "fusion", role: "SUB", rarity: 4 },
    { name: "Sanhua", element: "glacio", role: "SUB", rarity: 4 },
    { name: "Baizhi", element: "glacio", role: "HEAL", rarity: 4 },
    { name: "Danjin", element: "havoc", role: "SUB", rarity: 4 },
    { name: "Yangyang", element: "aero", role: "SUP", rarity: 4 },
    { name: "Rover (Havoc)", element: "havoc", role: "DPS", rarity: 4 },
    { name: "Rover (Spectro)", element: "spectro", role: "DPS", rarity: 4 },
    { name: "Taoqi", element: "havoc", role: "SUP", rarity: 4 },
    { name: "Yuanwu", element: "electro", role: "SUP", rarity: 4 },
    { name: "Aalto", element: "aero", role: "SUB", rarity: 4 },
    { name: "Chixia", element: "fusion", role: "DPS", rarity: 4 },
    { name: "Lumi", element: "glacio", role: "SUP", rarity: 4 },
];


// =============================================
// TEAM RECIPES (priority ordered - best first)
// Each recipe: { chars: [...], tip: "..." }
// The builder picks the first recipe where
// the user owns ALL characters in it.
// =============================================
const RECIPES = {
    hazard_12: [
        { chars: ["Sigrika", "Qiuyuan", "Shorekeeper"], tip: "Spam Echo Skills to stack the buff and shred enemy RES." },
        { chars: ["Augusta", "Yinlin", "Shorekeeper"], tip: "Build Majesty stacks, then use Liberation for 7s time-stop." },
        { chars: ["Augusta", "Yinlin", "Verina"], tip: "Same as above but Verina heals. Liberation time-stop is your DPS window." },
        { chars: ["Changli", "Yinlin", "Verina"], tip: "Quickswap burst rotation. Fire Echo Skills constantly for stacking buff." },
        { chars: ["Calcharo", "Yinlin", "Verina"], tip: "Calcharo burst after Yinlin setup. Echo Skill stacking = free damage." },
        { chars: ["Xiangli Yao", "Yinlin", "Verina"], tip: "Electro synergy. Keep spamming Echo Skills for the stacking buff." },
        { chars: ["Xiangli Yao", "Yinlin", "Baizhi"], tip: "Budget healer version. Same game plan - Echo Skill spam." },
        { chars: ["Jiyan", "Mortefi", "Verina"], tip: "Jiyan Liberation sweep for AoE. Mortefi off-field adds damage." },
        { chars: ["Encore", "Sanhua", "Verina"], tip: "Encore burst after Sanhua setup. Good AoE for grouped enemies." },
    ],
    hazard_34: [
        { chars: ["Aemeath", "Lynae", "Mornye"], tip: "Tune Rupture Mode melts bosses. Time burst for stagger windows." },
        { chars: ["Aemeath", "Cantarella", "Shorekeeper"], tip: "Havoc synergy. Aemeath is the #1 single-target nuke." },
        { chars: ["Phrolova", "Cantarella", "Shorekeeper"], tip: "Stackable passive = 100% Crit DMG at full. Sustained beast." },
        { chars: ["Phrolova", "Cantarella", "Verina"], tip: "Same idea, Verina heals. Keep Phrolova on-field for stacks." },
        { chars: ["Cartethyia", "Ciaccona", "Shorekeeper"], tip: "Burst quickswap. Ciaccona buffs into Cartethyia burst." },
        { chars: ["Hiyuki", "Zhezhi", "Shorekeeper"], tip: "Glacio duo. Sustained DPS with Zhezhi off-field." },
        { chars: ["Jinhsi", "Zhezhi", "Verina"], tip: "Jinhsi massive burst + Zhezhi off-field. Save burst for windows." },
        { chars: ["Camellya", "Danjin", "Shorekeeper"], tip: "Havoc sustained damage. Camellya self-heals help too." },
        { chars: ["Camellya", "Danjin", "Verina"], tip: "Budget version. Same Havoc sustained plan." },
        { chars: ["Calcharo", "Yinlin", "Shorekeeper"], tip: "Electro burst. Use Calcharo's deathblade combo after setup." },
    ],
    resonant_12: [
        { chars: ["Rover (Havoc)", "Danjin", "Baizhi"], tip: "Budget team. Save good characters for floors 3-4. Easy clear." },
        { chars: ["Encore", "Sanhua", "Baizhi"], tip: "Encore burst handles these floors easily." },
        { chars: ["Chixia", "Mortefi", "Baizhi"], tip: "All 4-star team. More than enough for early floors." },
        { chars: ["Jiyan", "Mortefi", "Verina"], tip: "Overkill but works. Jiyan Liberation one-shots mobs." },
        { chars: ["Rover (Havoc)", "Danjin", "Verina"], tip: "F2P friendly. Just clear it and move on." },
        { chars: ["Xiangli Yao", "Yuanwu", "Baizhi"], tip: "Electro budget team. Works fine for floors 1-2." },
    ],
    resonant_34: [
        { chars: ["Augusta", "Yinlin", "Shorekeeper"], tip: "Basic ATK buff stacks to 40% — Augusta stays on-field and destroys. Don't swap!" },
        { chars: ["Sigrika", "Qiuyuan", "Verina"], tip: "Sigrika's kit triggers tons of Basic ATK hits. Stacking buff = huge damage." },
        { chars: ["Augusta", "Yinlin", "Verina"], tip: "Same plan. Augusta on-field, don't swap, let ATK buff stack." },
        { chars: ["Jinhsi", "Zhezhi", "Verina"], tip: "Jinhsi on-field carries. Basic ATK buff benefits her combo string." },
        { chars: ["Changli", "Yinlin", "Verina"], tip: "Changli's basic attacks hit hard with the stacking buff." },
        { chars: ["Camellya", "Danjin", "Verina"], tip: "Camellya on-field Havoc carry. Buff stacks as she attacks." },
        { chars: ["Jiyan", "Mortefi", "Verina"], tip: "Jiyan on-field. The buff resets on swap so stay committed." },
        { chars: ["Calcharo", "Yinlin", "Verina"], tip: "Calcharo basic attack chains benefit from the stacking buff." },
    ],
    echoing_12: [
        { chars: ["Rover (Spectro)", "Yangyang", "Baizhi"], tip: "Budget. Keep HP > 75% for free crit stats. Baizhi is key." },
        { chars: ["Rover (Havoc)", "Taoqi", "Baizhi"], tip: "Budget. HP > 75% = free 20% CR + 65% CD. Don't take damage!" },
        { chars: ["Xiangli Yao", "Yuanwu", "Baizhi"], tip: "Electro budget. Baizhi keeps HP up for the crit buff." },
        { chars: ["Encore", "Sanhua", "Baizhi"], tip: "Easy clear. Just keep HP up for the free crit stats." },
        { chars: ["Chixia", "Mortefi", "Baizhi"], tip: "All 4-star. Baizhi heals = permanent crit buff." },
    ],
    echoing_34: [
        { chars: ["Cartethyia", "Ciaccona", "Shorekeeper"], tip: "HP>75% = +20% CR +65% CD permanently. Shorekeeper keeps it up. Burst HARD." },
        { chars: ["Jinhsi", "Zhezhi", "Verina"], tip: "Jinhsi burst with free crit stats is devastating. Verina keeps HP topped." },
        { chars: ["Hiyuki", "Zhezhi", "Shorekeeper"], tip: "Glacio sustained DPS with permanent crit buff. Very strong." },
        { chars: ["Camellya", "Danjin", "Shorekeeper"], tip: "Havoc carry with crit buff. Shorekeeper keeps HP high." },
        { chars: ["Sigrika", "Qiuyuan", "Shorekeeper"], tip: "Sigrika benefits massively from the free crit stats." },
        { chars: ["Phrolova", "Cantarella", "Shorekeeper"], tip: "Phrolova's stacking passive + free crit = insane scaling." },
        { chars: ["Calcharo", "Yinlin", "Verina"], tip: "Electro burst with free crit. Verina keeps HP up." },
        { chars: ["Changli", "Yinlin", "Verina"], tip: "Fusion burst with permanent crit buff active." },
        { chars: ["Jiyan", "Mortefi", "Verina"], tip: "Jiyan Liberation crits with the free stats. Keep HP up!" },
    ],
};


// =============================================
// STATE
// =============================================
let selected = new Set();

// Load saved selection
try {
    const saved = localStorage.getItem('wuwa-owned');
    if (saved) selected = new Set(JSON.parse(saved));
} catch(e) {}

function saveSelection() {
    localStorage.setItem('wuwa-owned', JSON.stringify([...selected]));
}

// =============================================
// RENDER CHARACTER GRID
// =============================================
function renderGrid(filter) {
    const grid = document.getElementById('char-grid');
    let chars = ALL_CHARS;
    if (filter && filter !== 'all') {
        chars = chars.filter(c => c.element === filter);
    }

    grid.innerHTML = chars.map(c => {
        const initials = c.name.split(' ').map(w => w[0]).join('').substring(0, 2);
        const sel = selected.has(c.name) ? 'selected' : '';
        const stars = c.rarity === 5 ? '★★★★★' : '★★★★';
        return `
            <button class="char-btn ${sel}" data-name="${c.name}">
                <div class="char-avatar ${c.element}">${initials}</div>
                <span class="char-btn-name">${c.name}</span>
                <span class="char-rarity">${stars}</span>
            </button>
        `;
    }).join('');

    // Attach click events
    grid.querySelectorAll('.char-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            if (selected.has(name)) {
                selected.delete(name);
                btn.classList.remove('selected');
            } else {
                selected.add(name);
                btn.classList.add('selected');
            }
            saveSelection();
            updateCount();
        });
    });
}

function updateCount() {
    document.getElementById('count').textContent = selected.size;
    document.getElementById('btn-go').disabled = selected.size < 3;
}

// =============================================
// TEAM BUILDER
// =============================================
function buildTeams() {
    const output = document.getElementById('teams-output');

    const sections = [
        { key: "hazard_12", title: "Hazard Tower", sub: "Floors 1-2", tag: "hazard", vigor: "5 each" },
        { key: "hazard_34", title: "Hazard Tower", sub: "Floors 3-4", tag: "hazard", vigor: "5 each" },
        { key: "resonant_12", title: "Resonant Tower", sub: "Floors 1-2", tag: "resonant", vigor: "1+2 = 3" },
        { key: "resonant_34", title: "Resonant Tower", sub: "Floors 3-4", tag: "resonant", vigor: "3+4 = 7" },
        { key: "echoing_12", title: "Echoing Tower", sub: "Floors 1-2", tag: "echoing", vigor: "1+2 = 3" },
        { key: "echoing_34", title: "Echoing Tower", sub: "Floors 3-4", tag: "echoing", vigor: "3+4 = 7" },
    ];

    let html = '';

    sections.forEach(sec => {
        const recipes = RECIPES[sec.key] || [];
        // Find first recipe where user owns all chars
        const match = recipes.find(r => r.chars.every(c => selected.has(c)));

        html += `
            <div class="tower-section">
                <div class="tower-section-header">
                    <h2>${sec.title}</h2>
                    <span class="tower-tag ${sec.tag}">${sec.sub}</span>
                    <span class="vigor-badge">${sec.vigor} vigor</span>
                </div>
        `;

        if (match) {
            html += `<div class="floor-card">
                <div class="team-row">
                    ${match.chars.map(name => {
                        const c = ALL_CHARS.find(x => x.name === name) || { element: "spectro" };
                        return `<div class="team-member">
                            <div class="team-member-dot ${c.element}"></div>
                            <span class="team-member-name">${name}</span>
                        </div>`;
                    }).join('')}
                </div>
                <div class="floor-tip">${match.tip}</div>
            </div>`;
        } else {
            html += `<div class="no-team-msg">No matching team found. Go back and add more characters you own.</div>`;
        }

        html += `</div>`;
    });

    output.innerHTML = html;
}

// =============================================
// NAVIGATION
// =============================================
function showStep(id) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    renderGrid('all');
    updateCount();

    // Filter buttons
    document.querySelectorAll('.filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGrid(btn.dataset.filter);
        });
    });

    // Go button
    document.getElementById('btn-go').addEventListener('click', () => {
        buildTeams();
        showStep('step-teams');
    });

    // Back button
    document.getElementById('btn-back').addEventListener('click', () => {
        showStep('step-pick');
    });
});

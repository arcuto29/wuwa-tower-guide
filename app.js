// === WuWa Tower of Adversity Guide - Interactive App ===

// =============================================
// ROTATION DATA - Update this each reset!
// =============================================
const CURRENT_ROTATION = {
    version: "3.5",
    startDate: "July 20, 2026",
    endDate: "August 27, 2026",
    interference: {
        resonant: "Dealing Basic Attack DMG grants 5% All-Attribute DMG Bonus for 6s, stacking up to 8 times. Effect removed when Resonator is switched off field.",
        hazard: "When Resonators cast Echo Skill, all party members gain 6% All-Attribute DMG, stacking up to 4 times. Same Resonator using identical Echo cannot trigger multiple stacks. At 4 stacks, Crit DMG of all Resonators increases by 36%.",
        echoing: "When Resonators' HP is above 75%, Crit Rate is increased by 20% and Crit DMG by 65%."
    },
    bestTeams: {
        hazard: [
            {
                floor: 1,
                teams: [
                    { name: "Sigrika Hypercarry", chars: ["Sigrika", "Qiuyuan", "Shorekeeper"], note: "Echo Skill spam strips RES stacks. Best AoE clear." },
                    { name: "Augusta Electro Burst", chars: ["Augusta", "Yinlin", "Verina"], note: "7-second time-stop Liberation dominates multi-wave." }
                ],
                enemies: "Mixed mobs with Electro weakness",
                tips: "Use AoE-heavy teams. Group enemies before bursting."
            },
            {
                floor: 2,
                teams: [
                    { name: "Cartethyia Quickswap", chars: ["Cartethyia", "Ciaccona", "Shorekeeper"], note: "Smooth burst rotation, great for two-phase fights." },
                    { name: "Phrolova Havoc Stack", chars: ["Phrolova", "Cantarella", "Verina"], note: "Stackable passive = 100% Crit DMG bonus at full." }
                ],
                enemies: "Boss + adds, Glacio resistant",
                tips: "Kill adds first for uninterrupted boss DPS window."
            },
            {
                floor: 3,
                teams: [
                    { name: "Sigrika RES Shred", chars: ["Sigrika", "Qiuyuan", "Shorekeeper"], note: "Echo Skill chains strip enemy RES stacks fast." },
                    { name: "Hiyuki Glacio Burst", chars: ["Hiyuki", "Zhezhi", "Shorekeeper"], note: "Glacio synergy with massive single-target burst." }
                ],
                enemies: "Tanky elite with Fusion resistance",
                tips: "Focus Echo Skill rotation to shred RES before bursting."
            },
            {
                floor: 4,
                teams: [
                    { name: "Aemeath Tune Rupture", chars: ["Aemeath", "Lynae", "Mornye"], note: "Top single-target nuke. Tune Rupture Mode melts bosses." },
                    { name: "Phrolova + Cantarella", chars: ["Phrolova", "Cantarella", "Shorekeeper"], note: "Smooth sustained damage with self-sufficient Crit scaling." }
                ],
                enemies: "Single boss, Fusion resistant, Basic Attack buff active",
                tips: "Havoc DPS excels here. Time Liberation for stagger windows."
            }
        ],
        resonant: [
            {
                floor: 1,
                teams: [
                    { name: "Any Budget Team", chars: ["Rover (Havoc)", "Danjin", "Baizhi"], note: "Low Vigor cost — save strong teams for later." }
                ],
                enemies: "Weak mobs",
                tips: "Use your weakest viable team here. Save Vigor."
            },
            {
                floor: 2,
                teams: [
                    { name: "Jiyan Aero Cleave", chars: ["Jiyan", "Mortefi", "Verina"], note: "Good AoE with Jiyan's Liberation sweep." }
                ],
                enemies: "Mixed mobs, moderate HP",
                tips: "Basic Attack buff is active — stay on-field with DPS."
            },
            {
                floor: 3,
                teams: [
                    { name: "Encore Fusion Burst", chars: ["Encore", "Sanhua", "Verina"], note: "Encore's Resonance Liberation demolishes grouped enemies." }
                ],
                enemies: "Tanky mobs with shields",
                tips: "Break shields before committing burst damage."
            },
            {
                floor: 4,
                teams: [
                    { name: "Augusta Time-Stop", chars: ["Augusta", "Yinlin", "Shorekeeper"], note: "Full Majesty stacks = time-stop Liberation for max DPS." },
                    { name: "Sigrika Echo Spam", chars: ["Sigrika", "Qiuyuan", "Verina"], note: "Basic Attack stacking buff synergizes perfectly." }
                ],
                enemies: "Elite boss, high HP",
                tips: "On-field DPS benefits from Basic Attack stacking buff. Don't swap too much."
            }
        ],
        echoing: [
            {
                floor: 1,
                teams: [
                    { name: "Budget Electro", chars: ["Xiangli Yao", "Yinlin", "Baizhi"], note: "Cheap team, more than enough for Floor 1." }
                ],
                enemies: "Weak mobs",
                tips: "Save your good teams. Anything works here."
            },
            {
                floor: 2,
                teams: [
                    { name: "Calcharo Burst", chars: ["Calcharo", "Yinlin", "Verina"], note: "Quick burst rotation handles moderate enemies." }
                ],
                enemies: "Mixed mobs",
                tips: "Keep HP above 75% for the Crit buff from interference."
            },
            {
                floor: 3,
                teams: [
                    { name: "Camellya Havoc", chars: ["Camellya", "Danjin", "Shorekeeper"], note: "Strong sustained damage with Havoc synergy." }
                ],
                enemies: "Tanky enemies, Aero resistant",
                tips: "HP > 75% gives +20% Crit Rate and +65% Crit DMG. Use healer."
            },
            {
                floor: 4,
                teams: [
                    { name: "Cartethyia + Ciaccona", chars: ["Cartethyia", "Ciaccona", "Shorekeeper"], note: "Burst quickswap dominates with Crit buff active." },
                    { name: "Jinhsi Spectro Burst", chars: ["Jinhsi", "Zhezhi", "Verina"], note: "Massive burst with HP-conditional Crit bonus." }
                ],
                enemies: "Boss encounter",
                tips: "CRITICAL: Keep HP above 75% at all times for +20% CR / +65% CD. Bring sustain."
            }
        ]
    }
};


// =============================================
// CHARACTER DATABASE
// =============================================
const CHARACTERS = [
    // 5-star DPS
    { name: "Sigrika", element: "Spectro", role: "Main DPS", rarity: 5 },
    { name: "Aemeath", element: "Havoc", role: "Main DPS", rarity: 5 },
    { name: "Augusta", element: "Electro", role: "Main DPS", rarity: 5 },
    { name: "Phrolova", element: "Havoc", role: "Main DPS", rarity: 5 },
    { name: "Hiyuki", element: "Glacio", role: "Main DPS", rarity: 5 },
    { name: "Cartethyia", element: "Glacio", role: "Main DPS", rarity: 5 },
    { name: "Jinhsi", element: "Spectro", role: "Main DPS", rarity: 5 },
    { name: "Camellya", element: "Havoc", role: "Main DPS", rarity: 5 },
    { name: "Changli", element: "Fusion", role: "Main DPS", rarity: 5 },
    { name: "Calcharo", element: "Electro", role: "Main DPS", rarity: 5 },
    { name: "Jiyan", element: "Aero", role: "Main DPS", rarity: 5 },
    { name: "Encore", element: "Fusion", role: "Main DPS", rarity: 5 },
    { name: "Xiangli Yao", element: "Electro", role: "Main DPS", rarity: 5 },
    // 5-star Support/Sub DPS
    { name: "Ciaccona", element: "Aero", role: "Support", rarity: 5 },
    { name: "Qiuyuan", element: "Spectro", role: "Sub DPS", rarity: 5 },
    { name: "Cantarella", element: "Havoc", role: "Sub DPS", rarity: 5 },
    { name: "Yinlin", element: "Electro", role: "Sub DPS", rarity: 5 },
    { name: "Zhezhi", element: "Glacio", role: "Sub DPS", rarity: 5 },
    { name: "Lynae", element: "Fusion", role: "Sub DPS", rarity: 5 },
    { name: "Mornye", element: "Havoc", role: "Support", rarity: 5 },
    { name: "Mortefi", element: "Fusion", role: "Sub DPS", rarity: 5 },
    { name: "Sanhua", element: "Glacio", role: "Sub DPS", rarity: 4 },
    // Healers
    { name: "Shorekeeper", element: "Spectro", role: "Healer", rarity: 5 },
    { name: "Verina", element: "Spectro", role: "Healer", rarity: 5 },
    { name: "Baizhi", element: "Glacio", role: "Healer", rarity: 4 },
    // 4-star / F2P
    { name: "Rover (Havoc)", element: "Havoc", role: "Main DPS", rarity: 4 },
    { name: "Rover (Spectro)", element: "Spectro", role: "Main DPS", rarity: 4 },
    { name: "Danjin", element: "Havoc", role: "Sub DPS", rarity: 4 },
    { name: "Yangyang", element: "Aero", role: "Support", rarity: 4 },
    { name: "Taoqi", element: "Havoc", role: "Support", rarity: 4 },
    { name: "Aalto", element: "Aero", role: "Sub DPS", rarity: 4 },
    { name: "Chixia", element: "Fusion", role: "Main DPS", rarity: 4 },
    { name: "Yuanwu", element: "Electro", role: "Support", rarity: 4 },
    { name: "Lumi", element: "Glacio", role: "Support", rarity: 4 }
];

const ELEMENT_COLORS = {
    Glacio: "#7ec8e3",
    Fusion: "#ff6b35",
    Electro: "#c77dff",
    Aero: "#70e000",
    Spectro: "#ffea00",
    Havoc: "#9d4edd"
};


// =============================================
// APP STATE
// =============================================
let appState = {
    roster: [],
    assignments: {}, // { "resonant-1": ["CharName", ...], ... }
    checklist: {}
};

// Load saved state
function loadState() {
    try {
        const saved = localStorage.getItem('wuwa-toa-state');
        if (saved) {
            appState = JSON.parse(saved);
        }
    } catch(e) {
        console.log('No saved state found');
    }
}

function saveState() {
    try {
        localStorage.setItem('wuwa-toa-state', JSON.stringify(appState));
    } catch(e) {
        console.log('Could not save state');
    }
}

// =============================================
// TAB NAVIGATION
// =============================================
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// =============================================
// ROTATION BANNER (inject into Overview)
// =============================================
function renderRotationBanner() {
    const overviewTab = document.getElementById('overview');
    const banner = document.createElement('div');
    banner.className = 'rotation-banner';
    banner.innerHTML = `
        <h2>Current Rotation: Version ${CURRENT_ROTATION.version}</h2>
        <p class="rotation-dates">${CURRENT_ROTATION.startDate} - ${CURRENT_ROTATION.endDate}</p>
        <p style="position:relative; margin-top:0.75rem; color: var(--text-secondary); font-size:0.9rem;">
            Check the <strong>Floor Strategies</strong> tab for this rotation's best teams per floor!
        </p>
    `;
    overviewTab.insertBefore(banner, overviewTab.firstChild);
}


// =============================================
// VIGOR PLANNER
// =============================================
function initVigorPlanner() {
    // Populate character suggestions datalist
    const datalist = document.getElementById('character-suggestions');
    CHARACTERS.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.name;
        datalist.appendChild(opt);
    });

    // Add character button
    document.getElementById('add-char-btn').addEventListener('click', addCharacter);
    document.getElementById('char-name-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCharacter();
    });

    // Render existing roster
    renderRoster();
    renderAssignments();
    updateVigorSummary();
}

function addCharacter() {
    const nameInput = document.getElementById('char-name-input');
    const roleInput = document.getElementById('char-role-input');
    const elementInput = document.getElementById('char-element-input');

    const name = nameInput.value.trim();
    if (!name) return;

    // Check if already in roster
    if (appState.roster.find(c => c.name.toLowerCase() === name.toLowerCase())) {
        nameInput.value = '';
        return;
    }

    // Check if in database for auto-fill
    const dbChar = CHARACTERS.find(c => c.name.toLowerCase() === name.toLowerCase());
    const character = dbChar || {
        name: name,
        element: elementInput.value,
        role: roleInput.value,
        rarity: 4
    };

    appState.roster.push(character);
    nameInput.value = '';
    saveState();
    renderRoster();
    updateVigorSummary();
}

function removeCharacter(name) {
    appState.roster = appState.roster.filter(c => c.name !== name);
    // Remove from assignments too
    Object.keys(appState.assignments).forEach(key => {
        appState.assignments[key] = appState.assignments[key].filter(n => n !== name);
    });
    saveState();
    renderRoster();
    renderAssignments();
    updateVigorSummary();
}

function renderRoster() {
    const container = document.getElementById('roster-list');
    container.innerHTML = '';

    appState.roster.forEach(char => {
        const chip = document.createElement('div');
        chip.className = 'roster-chip';
        chip.draggable = true;
        chip.dataset.charName = char.name;
        chip.innerHTML = `
            <span class="element-dot" style="background: ${ELEMENT_COLORS[char.element] || '#888'}"></span>
            <span>${char.name}</span>
            <span class="role-tag" style="font-size:0.75rem; color: var(--text-secondary)">(${char.role})</span>
            <span class="remove-char" onclick="removeCharacter('${char.name}')">&times;</span>
        `;
        container.appendChild(chip);
    });
}


function renderAssignments() {
    const allSlots = document.querySelectorAll('.stage-slots');
    allSlots.forEach(slot => {
        const tower = slot.dataset.tower;
        const stage = slot.dataset.stage;
        const key = `${tower}-${stage}`;
        slot.innerHTML = '';

        const assigned = appState.assignments[key] || [];
        assigned.forEach(charName => {
            const charChip = document.createElement('span');
            charChip.className = 'slot-char';
            charChip.textContent = charName;
            charChip.title = 'Click to remove';
            charChip.addEventListener('click', () => {
                appState.assignments[key] = appState.assignments[key].filter(n => n !== charName);
                saveState();
                renderAssignments();
                updateVigorSummary();
            });
            slot.appendChild(charChip);
        });

        // Add button for assigning
        const addBtn = document.createElement('span');
        addBtn.className = 'slot-char';
        addBtn.textContent = '+ Assign';
        addBtn.style.borderColor = 'var(--accent)';
        addBtn.style.color = 'var(--accent)';
        addBtn.addEventListener('click', () => showAssignDropdown(slot, key));
        slot.appendChild(addBtn);
    });
}

function showAssignDropdown(container, key) {
    // Remove existing dropdowns
    document.querySelectorAll('.assign-dropdown').forEach(d => d.remove());

    const dropdown = document.createElement('div');
    dropdown.className = 'assign-dropdown';
    dropdown.style.cssText = `
        position: absolute; z-index: 1000; background: var(--bg-secondary);
        border: 1px solid var(--accent); border-radius: 8px; padding: 0.5rem;
        max-height: 200px; overflow-y: auto; min-width: 150px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;

    const assigned = appState.assignments[key] || [];
    const available = appState.roster.filter(c => !assigned.includes(c.name));

    if (available.length === 0) {
        dropdown.innerHTML = '<p style="padding:0.5rem;color:var(--text-secondary);font-size:0.8rem;">No characters available. Add some in the roster above.</p>';
    } else {
        available.forEach(char => {
            const option = document.createElement('div');
            option.style.cssText = `
                padding: 0.4rem 0.8rem; cursor: pointer; border-radius: 4px;
                font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;
            `;
            option.innerHTML = `
                <span style="width:8px;height:8px;border-radius:50%;background:${ELEMENT_COLORS[char.element] || '#888'}"></span>
                ${char.name}
            `;
            option.addEventListener('mouseenter', () => option.style.background = 'rgba(233,69,96,0.2)');
            option.addEventListener('mouseleave', () => option.style.background = 'transparent');
            option.addEventListener('click', () => {
                if (!appState.assignments[key]) appState.assignments[key] = [];
                appState.assignments[key].push(char.name);
                saveState();
                renderAssignments();
                updateVigorSummary();
                dropdown.remove();
            });
            dropdown.appendChild(option);
        });
    }

    container.style.position = 'relative';
    container.appendChild(dropdown);

    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 10);
}


function updateVigorSummary() {
    const container = document.getElementById('vigor-summary-content');

    if (appState.roster.length === 0) {
        container.innerHTML = '<p class="empty-state">Add characters and assign them to stages to see Vigor usage.</p>';
        return;
    }

    // Calculate vigor usage per character
    const vigorUsage = {};
    appState.roster.forEach(c => { vigorUsage[c.name] = 0; });

    const vigorCosts = {
        'resonant-1': 1, 'resonant-2': 2, 'resonant-3': 3, 'resonant-4': 4,
        'hazard-1': 5, 'hazard-2': 5, 'hazard-3': 5, 'hazard-4': 5,
        'echoing-1': 1, 'echoing-2': 2, 'echoing-3': 3, 'echoing-4': 4
    };

    Object.entries(appState.assignments).forEach(([key, chars]) => {
        const cost = vigorCosts[key] || 0;
        chars.forEach(charName => {
            if (vigorUsage[charName] !== undefined) {
                vigorUsage[charName] += cost;
            }
        });
    });

    let html = '';
    appState.roster.forEach(char => {
        const used = vigorUsage[char.name] || 0;
        const percent = Math.min((used / 10) * 100, 100);
        let barClass = 'vigor-ok';
        if (used > 10) barClass = 'vigor-over';
        else if (used >= 8) barClass = 'vigor-warn';

        const statusIcon = used > 10 ? ' !! OVER !!' : '';

        html += `
            <div class="vigor-char-row">
                <span style="display:flex;align-items:center;gap:0.5rem;">
                    <span style="width:8px;height:8px;border-radius:50%;background:${ELEMENT_COLORS[char.element] || '#888'}"></span>
                    ${char.name}
                </span>
                <span style="display:flex;align-items:center;gap:0.75rem;">
                    <span style="font-size:0.85rem;${used > 10 ? 'color:var(--accent);font-weight:bold' : 'color:var(--text-secondary)'}">${used}/10${statusIcon}</span>
                    <div class="vigor-bar">
                        <div class="vigor-bar-fill ${barClass}" style="width:${percent}%"></div>
                    </div>
                </span>
            </div>
        `;
    });

    container.innerHTML = html;
}

// =============================================
// FLOOR STRATEGY DISPLAY
// =============================================
function initFloorStrategy() {
    document.getElementById('show-strategy-btn').addEventListener('click', showFloorStrategy);
    // Also show on select change
    document.getElementById('tower-select').addEventListener('change', showFloorStrategy);
    document.getElementById('floor-select').addEventListener('change', showFloorStrategy);
}

function showFloorStrategy() {
    const tower = document.getElementById('tower-select').value;
    const floor = parseInt(document.getElementById('floor-select').value);
    const display = document.getElementById('strategy-display');

    const towerData = CURRENT_ROTATION.bestTeams[tower];
    if (!towerData) {
        display.innerHTML = '<div class="strategy-placeholder"><p>No data for this tower yet.</p></div>';
        return;
    }

    const floorData = towerData.find(f => f.floor === floor);
    if (!floorData) {
        display.innerHTML = '<div class="strategy-placeholder"><p>No data for this floor yet.</p></div>';
        return;
    }

    const towerNames = { resonant: "Resonant", hazard: "Hazard", echoing: "Echoing" };
    const interference = CURRENT_ROTATION.interference[tower];

    let teamsHTML = floorData.teams.map(team => `
        <div style="margin-bottom:1rem; padding:1rem; background:rgba(0,0,0,0.2); border-radius:8px; border:1px solid var(--border);">
            <h5 style="color:var(--accent); margin-bottom:0.5rem;">${team.name}</h5>
            <div class="recommended-teams">
                ${team.chars.map(c => `<span class="team-tag">${c}</span>`).join('')}
            </div>
            <p style="margin-top:0.5rem; font-size:0.85rem; color:var(--text-secondary);">${team.note}</p>
        </div>
    `).join('');

    display.innerHTML = `
        <div class="strategy-content">
            <h3>${towerNames[tower]} Tower - Floor ${floor}</h3>

            <h4>Rotation Interference Effect</h4>
            <p style="color:var(--success);font-size:0.9rem;padding:0.75rem;background:rgba(78,205,196,0.1);border-radius:6px;border:1px solid var(--success);">${interference}</p>

            <h4>Enemies</h4>
            <p style="color:var(--text-secondary);font-size:0.9rem;">${floorData.enemies}</p>

            <h4>Recommended Teams (This Rotation)</h4>
            ${teamsHTML}

            <h4>Strategy Tips</h4>
            <p style="color:var(--warning);font-size:0.9rem;padding:0.75rem;background:rgba(255,217,61,0.1);border-radius:6px;border:1px solid var(--warning);">${floorData.tips}</p>
        </div>
    `;
}


// =============================================
// CHECKLIST
// =============================================
function initChecklist() {
    const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');

    // Load saved checklist state
    checkboxes.forEach(cb => {
        const key = cb.dataset.save;
        if (appState.checklist[key]) {
            cb.checked = true;
        }

        cb.addEventListener('change', () => {
            appState.checklist[key] = cb.checked;
            saveState();
            updateChecklistProgress();
        });
    });

    // Reset button
    document.getElementById('reset-checklist').addEventListener('click', () => {
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
        appState.checklist = {};
        saveState();
        updateChecklistProgress();
    });

    updateChecklistProgress();
}

function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
    const total = checkboxes.length;
    const checked = document.querySelectorAll('.check-item input[type="checkbox"]:checked').length;
    const percent = total > 0 ? (checked / total) * 100 : 0;

    document.getElementById('checklist-progress-fill').style.width = `${percent}%`;
    document.getElementById('checklist-progress-text').textContent = `${checked} / ${total} completed`;
}

// =============================================
// QUICK CLEAR GUIDE (injected into Overview)
// =============================================
function renderQuickClearGuide() {
    const overviewTab = document.getElementById('overview');

    const quickGuide = document.createElement('div');
    quickGuide.className = 'card';
    quickGuide.innerHTML = `
        <h2>Quick Clear Order (This Rotation)</h2>
        <p class="card-desc">Follow this order for the smoothest clear experience:</p>
        <div style="display:flex;flex-direction:column;gap:1rem;">
            <div style="padding:1rem;background:rgba(0,0,0,0.2);border-radius:8px;border-left:4px solid var(--success);">
                <h4 style="color:var(--success);">Step 1: Resonant Tower (Stages 1+2)</h4>
                <p style="color:var(--text-secondary);font-size:0.9rem;margin-top:0.25rem;">Use budget/weaker team. Only costs 3 Vigor total. Basic Attack buff = stay on one DPS.</p>
            </div>
            <div style="padding:1rem;background:rgba(0,0,0,0.2);border-radius:8px;border-left:4px solid var(--success);">
                <h4 style="color:var(--success);">Step 2: Echoing Tower (Stages 1+2)</h4>
                <p style="color:var(--text-secondary);font-size:0.9rem;margin-top:0.25rem;">Another budget team. 3 Vigor. Keep HP > 75% for free Crit stats.</p>
            </div>
            <div style="padding:1rem;background:rgba(0,0,0,0.2);border-radius:8px;border-left:4px solid var(--warning);">
                <h4 style="color:var(--warning);">Step 3: Resonant Tower (Stages 3+4)</h4>
                <p style="color:var(--text-secondary);font-size:0.9rem;margin-top:0.25rem;">Bring a strong team (7 Vigor). Augusta or Sigrika shine here with Basic Attack stacking.</p>
            </div>
            <div style="padding:1rem;background:rgba(0,0,0,0.2);border-radius:8px;border-left:4px solid var(--warning);">
                <h4 style="color:var(--warning);">Step 4: Echoing Tower (Stages 3+4)</h4>
                <p style="color:var(--text-secondary);font-size:0.9rem;margin-top:0.25rem;">Strong team (7 Vigor). Cartethyia or Jinhsi with healers to keep the Crit buff active.</p>
            </div>
            <div style="padding:1rem;background:rgba(0,0,0,0.2);border-radius:8px;border-left:4px solid var(--accent);">
                <h4 style="color:var(--accent);">Step 5: Hazard Tower (All 4 Floors)</h4>
                <p style="color:var(--text-secondary);font-size:0.9rem;margin-top:0.25rem;">Your 2 BEST teams here. Echo Skill spam for stacking buff + RES shred. Sigrika/Aemeath/Phrolova dominate.</p>
            </div>
        </div>
    `;

    // Insert after the rotation banner and first card
    const cards = overviewTab.querySelectorAll('.card');
    if (cards.length >= 1) {
        cards[0].after(quickGuide);
    } else {
        overviewTab.appendChild(quickGuide);
    }
}

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initTabs();
    renderRotationBanner();
    renderQuickClearGuide();
    initVigorPlanner();
    initFloorStrategy();
    initChecklist();
    initAstriteCalc();

    // Show strategy immediately if on floors tab
    showFloorStrategy();
});


// =============================================
// ASTRITE CALCULATOR
// =============================================
function initAstriteCalc() {
    const sources = {
        'calc-dailies': 1800,    // 60/day x 30
        'calc-toa': 700,         // per 28-day reset (normalize to monthly)
        'calc-events': 3000,     // average per patch (~42 days), normalize to monthly: ~2140
        'calc-bp': 650,          // free BP per patch, normalize to monthly: ~464
        'calc-codes': 200,       // redemption codes per month
        'calc-maintenance': 300, // per patch, normalize to monthly: ~214
        'calc-lunite': 2520      // 90/day x 28 = 2520 from monthly sub
    };

    // Monthly normalization factors (patch = ~42 days, reset = 28 days)
    const monthlyNorm = {
        'calc-dailies': 1,
        'calc-toa': 30/28,          // slightly more than 1 reset per month
        'calc-events': 30/42,       // portion of patch that fits in a month
        'calc-bp': 30/42,
        'calc-codes': 1,
        'calc-maintenance': 30/42,
        'calc-lunite': 1
    };

    function updateCalc() {
        let totalMonthly = 0;

        Object.entries(sources).forEach(([id, amount]) => {
            const checkbox = document.getElementById(id);
            if (checkbox && checkbox.checked) {
                totalMonthly += Math.round(amount * (monthlyNorm[id] || 1));
            }
        });

        const totalAstrite = document.getElementById('calc-total-astrite');
        const totalPulls = document.getElementById('calc-total-pulls');

        if (totalAstrite) totalAstrite.textContent = totalMonthly.toLocaleString();
        if (totalPulls) totalPulls.textContent = Math.floor(totalMonthly / 160);
    }

    // Attach listeners
    Object.keys(sources).forEach(id => {
        const cb = document.getElementById(id);
        if (cb) {
            cb.addEventListener('change', updateCalc);
        }
    });

    // Initial calc
    updateCalc();
}

// =============================================
// UPDATED INITIALIZATION
// =============================================
// Override the DOMContentLoaded from earlier - this adds Astrite calc
const originalInit = document.addEventListener;
document.addEventListener('DOMContentLoaded', () => {
    // Astrite calc init (other inits already registered)
    initAstriteCalc();
});

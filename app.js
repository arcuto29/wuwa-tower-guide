// === WuWa Tower Companion - Ultimate App ===

// =============================================
// CHARACTER DATABASE
// =============================================
const CHARS = {
    // SS-Tier DPS
    "Sigrika": { element: "spectro", role: "DPS", rarity: 5 },
    "Aemeath": { element: "havoc", role: "DPS", rarity: 5 },
    "Augusta": { element: "electro", role: "DPS", rarity: 5 },
    "Phrolova": { element: "havoc", role: "DPS", rarity: 5 },
    "Hiyuki": { element: "glacio", role: "DPS", rarity: 5 },
    "Cartethyia": { element: "glacio", role: "DPS", rarity: 5 },
    "Jinhsi": { element: "spectro", role: "DPS", rarity: 5 },
    "Camellya": { element: "havoc", role: "DPS", rarity: 5 },
    "Changli": { element: "fusion", role: "DPS", rarity: 5 },
    "Calcharo": { element: "electro", role: "DPS", rarity: 5 },
    "Jiyan": { element: "aero", role: "DPS", rarity: 5 },
    "Encore": { element: "fusion", role: "DPS", rarity: 5 },
    "Xiangli Yao": { element: "electro", role: "DPS", rarity: 5 },
    // Sub DPS / Support
    "Ciaccona": { element: "aero", role: "SUP", rarity: 5 },
    "Qiuyuan": { element: "spectro", role: "SUB", rarity: 5 },
    "Cantarella": { element: "havoc", role: "SUB", rarity: 5 },
    "Yinlin": { element: "electro", role: "SUB", rarity: 5 },
    "Zhezhi": { element: "glacio", role: "SUB", rarity: 5 },
    "Lynae": { element: "fusion", role: "SUB", rarity: 5 },
    "Mornye": { element: "havoc", role: "SUP", rarity: 5 },
    "Mortefi": { element: "fusion", role: "SUB", rarity: 4 },
    "Sanhua": { element: "glacio", role: "SUB", rarity: 4 },
    // Healers
    "Shorekeeper": { element: "spectro", role: "HEAL", rarity: 5 },
    "Verina": { element: "spectro", role: "HEAL", rarity: 5 },
    "Baizhi": { element: "glacio", role: "HEAL", rarity: 4 },
    // F2P
    "Rover (Havoc)": { element: "havoc", role: "DPS", rarity: 4 },
    "Danjin": { element: "havoc", role: "SUB", rarity: 4 },
    "Yangyang": { element: "aero", role: "SUP", rarity: 4 },
};

// =============================================
// BEST TEAMS PER TOWER (THIS ROTATION)
// =============================================
const TOWER_TEAMS = {
    hazard: [
        {
            floor: 1, title: "Sigrika Hypercarry",
            chars: ["Sigrika", "Qiuyuan", "Shorekeeper"],
            note: "Echo Skill spam strips enemy RES stacks. Sigrika fires multiple Echo Skills per rotation = insane buff stacking with this rotation's interference.",
            strategy: "Group enemies first, then chain Echo Skills before bursting. Keep Shorekeeper heals up for survivability."
        },
        {
            floor: 2, title: "Cartethyia Quickswap",
            chars: ["Cartethyia", "Ciaccona", "Shorekeeper"],
            note: "Smooth burst rotation with Glacio synergy. Ciaccona buffs + Cartethyia's burst hits like a truck.",
            strategy: "Kill adds first for uninterrupted boss DPS window. Use Ciaccona Outro into Cartethyia for max burst."
        },
        {
            floor: 3, title: "Hiyuki Glacio Burst",
            chars: ["Hiyuki", "Zhezhi", "Shorekeeper"],
            note: "Hiyuki's sustained Glacio DPS with Zhezhi off-field support. Echo stacking shreds RES fast.",
            strategy: "Focus Echo Skill rotation to shred RES before committing Hiyuki's full combo. Zhezhi provides constant off-field damage."
        },
        {
            floor: 4, title: "Aemeath Tune Rupture",
            chars: ["Aemeath", "Lynae", "Mornye"],
            note: "Top single-target nuke in the game. Tune Rupture Mode melts bosses. Lynae provides Fusion sub-DPS, Mornye sustains.",
            strategy: "Time Liberation for stagger windows. Havoc DPS excels on Floor 4 since enemies are Fusion resistant. Save Aemeath burst for vulnerability phase."
        },
        {
            floor: "1-2", title: "Augusta Time-Stop (Alt)",
            chars: ["Augusta", "Yinlin", "Verina"],
            note: "7-second time-stop Liberation buys rotation breathing room. Yinlin's Electro coordination completes echo stacking.",
            strategy: "Build full Majesty stacks before Liberation. The time-stop lets you realign buffs without pressure."
        },
        {
            floor: "3-4", title: "Phrolova Havoc Stack (Alt)",
            chars: ["Phrolova", "Cantarella", "Shorekeeper"],
            note: "Stackable passive grants up to 100% Crit DMG. Self-sufficient damage with smooth sustained rotation.",
            strategy: "Keep Phrolova on-field as much as possible to maintain stacks. Cantarella provides off-field Havoc amplification."
        }
    ],
    resonant: [
        {
            floor: "1-2", title: "Budget Aero Team",
            chars: ["Jiyan", "Mortefi", "Verina"],
            note: "Save your best teams for later. Jiyan's AoE Liberation handles mobs easily. Only 3 Vigor total!",
            strategy: "Use Jiyan Liberation to sweep grouped enemies. Basic ATK buff means staying on-field with one DPS is optimal."
        },
        {
            floor: "3-4", title: "Augusta On-Field Carry",
            chars: ["Augusta", "Yinlin", "Shorekeeper"],
            note: "Basic ATK stacking buff (5% x8 = 40%) is PERFECT for Augusta who stays on-field. Don't swap too much!",
            strategy: "Build Basic ATK stacks early, then unleash Liberation at full Majesty. The buff resets on swap so commit to Augusta."
        },
        {
            floor: "3-4", title: "Sigrika Echo Spam (Alt)",
            chars: ["Sigrika", "Qiuyuan", "Verina"],
            note: "Sigrika's kit naturally triggers tons of Basic ATK hits. Stacking buff synergizes perfectly.",
            strategy: "Basic ATK stacking buff stays as long as you don't swap. Keep Sigrika on-field and fire Echo Skills for bonus damage."
        },
        {
            floor: "1-2", title: "F2P Option",
            chars: ["Rover (Havoc)", "Danjin", "Baizhi"],
            note: "Completely F2P friendly. Rover (Havoc) does solid damage even as a free unit. Save premium characters for harder floors.",
            strategy: "Use Danjin for burst windows, Rover for sustained. Baizhi keeps you alive. Just clear it and move on."
        }
    ],
    echoing: [
        {
            floor: "1-2", title: "Budget Electro",
            chars: ["Xiangli Yao", "Yinlin", "Baizhi"],
            note: "Easy clear for early floors. Keep HP above 75% to activate the Crit buff from interference.",
            strategy: "The interference gives free 20% CR + 65% CD when HP > 75%. Baizhi healing is critical — never let HP drop."
        },
        {
            floor: "3-4", title: "Cartethyia + Ciaccona",
            chars: ["Cartethyia", "Ciaccona", "Shorekeeper"],
            note: "Burst quickswap dominates with the free Crit stats. Shorekeeper keeps HP topped for permanent buff uptime.",
            strategy: "CRITICAL: HP > 75% at ALL TIMES. That's free +20% CR / +65% CD. Shorekeeper makes this trivial. Burst hard during windows."
        },
        {
            floor: "3-4", title: "Jinhsi Spectro Burst (Alt)",
            chars: ["Jinhsi", "Zhezhi", "Verina"],
            note: "Jinhsi's massive burst benefits enormously from the conditional Crit bonus. Zhezhi provides consistent off-field.",
            strategy: "Keep HP up, stack Jinhsi's resonance energy, then unleash burst with full Crit bonus active. Verina heals + buffs."
        },
        {
            floor: "3-4", title: "Camellya Havoc (Alt)",
            chars: ["Camellya", "Danjin", "Shorekeeper"],
            note: "Strong sustained Havoc damage. Camellya's self-sustain + Shorekeeper means HP stays high for free Crit.",
            strategy: "Camellya's Havoc burst benefits massively from the Crit buff. Keep HP up and she'll shred through everything."
        }
    ]
};

// =============================================
// NAVIGATION
// =============================================
function initNavigation() {
    const allNavBtns = document.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll('.tab-panel');

    allNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            // Update nav active state
            document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(b => b.classList.remove('active'));
            document.querySelectorAll(`[data-tab="${target}"]`).forEach(b => b.classList.add('active'));

            // Switch panels
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });
}

// =============================================
// RENDER CHARACTER AVATAR
// =============================================
function renderCharAvatar(name) {
    const char = CHARS[name] || { element: "spectro", role: "DPS", rarity: 4 };
    const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2);

    return `
        <div class="char-card">
            <div class="char-avatar ${char.element}">
                <span class="avatar-initials">${initials}</span>
            </div>
            <span class="char-name">${name}</span>
            <span class="char-role">${char.role}</span>
        </div>
    `;
}

// =============================================
// ROSTER TAB
// =============================================
function initRoster() {
    const container = document.getElementById('team-cards-container');
    const pills = document.querySelectorAll('.pill[data-tower-filter]');

    function renderTeams(tower) {
        const teams = TOWER_TEAMS[tower] || [];
        container.innerHTML = `
            <div class="team-cards-grid">
                ${teams.map(team => `
                    <div class="team-card">
                        <div class="team-card-header">
                            <h3>${team.title}</h3>
                            <span class="floor-badge">Floor ${team.floor}</span>
                        </div>
                        <div class="team-card-body">
                            <div class="team-members">
                                ${team.chars.map(c => renderCharAvatar(c)).join('')}
                            </div>
                            <div class="team-note">${team.note}</div>
                            <div class="team-strategy"><strong>Strategy:</strong> ${team.strategy}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderTeams(pill.dataset.towerFilter);
        });
    });

    // Initial render
    renderTeams('hazard');
}

// =============================================
// VIGOR PLANNER TAB
// =============================================
function initPlanner() {
    const container = document.getElementById('planner-content');
    container.innerHTML = `
        <div class="planner-explanation glass">
            <h3>How Vigor Works</h3>
            <p>Every character has <strong>10 Vigor</strong>. Using them in a stage costs Vigor based on the stage number. Plan wisely to clear all towers!</p>
            <div class="vigor-formula">
                <div class="formula-item"><span class="formula-label">Stages 1+4</span><span class="formula-value">= 5 Vigor</span></div>
                <div class="formula-item"><span class="formula-label">Stages 2+3</span><span class="formula-value">= 5 Vigor</span></div>
                <div class="formula-item"><span class="formula-label">Hazard (any)</span><span class="formula-value">= 5 Vigor</span></div>
            </div>
            <p class="tip-text">💡 <strong>Pro tip:</strong> Use the same team for Stages 1+4 and another for Stages 2+3. This splits each side tower into exactly 5 Vigor per team!</p>
        </div>

        <h3 class="section-title" style="margin-top:2rem;">Vigor Map</h3>
        <div class="vigor-map">
            <div class="vigor-tower-col">
                <h4 class="vigor-tower-label">Resonant</h4>
                <div class="vigor-slots">
                    <div class="vigor-slot"><span class="slot-stage">S1</span><span class="slot-cost">1</span></div>
                    <div class="vigor-slot"><span class="slot-stage">S2</span><span class="slot-cost">2</span></div>
                    <div class="vigor-slot"><span class="slot-stage">S3</span><span class="slot-cost">3</span></div>
                    <div class="vigor-slot"><span class="slot-stage">S4</span><span class="slot-cost">4</span></div>
                </div>
                <div class="vigor-total">Total: 10</div>
            </div>
            <div class="vigor-tower-col hazard-col">
                <h4 class="vigor-tower-label">Hazard</h4>
                <div class="vigor-slots">
                    <div class="vigor-slot"><span class="slot-stage">F1</span><span class="slot-cost">5</span></div>
                    <div class="vigor-slot"><span class="slot-stage">F2</span><span class="slot-cost">5</span></div>
                    <div class="vigor-slot"><span class="slot-stage">F3</span><span class="slot-cost">5</span></div>
                    <div class="vigor-slot"><span class="slot-stage">F4</span><span class="slot-cost">5</span></div>
                </div>
                <div class="vigor-total">Total: 20</div>
            </div>
            <div class="vigor-tower-col">
                <h4 class="vigor-tower-label">Echoing</h4>
                <div class="vigor-slots">
                    <div class="vigor-slot"><span class="slot-stage">S1</span><span class="slot-cost">1</span></div>
                    <div class="vigor-slot"><span class="slot-stage">S2</span><span class="slot-cost">2</span></div>
                    <div class="vigor-slot"><span class="slot-stage">S3</span><span class="slot-cost">3</span></div>
                    <div class="vigor-slot"><span class="slot-stage">S4</span><span class="slot-cost">4</span></div>
                </div>
                <div class="vigor-total">Total: 10</div>
            </div>
        </div>
        <p style="text-align:center;color:var(--text-3);margin-top:1rem;font-size:0.8rem;">Grand Total: 40 Vigor needed for full clear (minimum 4 characters at 10 each)</p>
    `;
}

// =============================================
// PULL CALCULATOR TAB
// =============================================
function initCalc() {
    const container = document.getElementById('calc-container');
    container.innerHTML = `
        <div class="calc-inputs glass">
            <div class="calc-grid">
                <div class="calc-field">
                    <label>Current Astrite</label>
                    <input type="number" id="c-astrite" value="0" min="0">
                </div>
                <div class="calc-field">
                    <label>Radiant Tides</label>
                    <input type="number" id="c-tides" value="0" min="0">
                </div>
                <div class="calc-field">
                    <label>Current Pity (0-79)</label>
                    <input type="number" id="c-pity" value="0" min="0" max="79">
                </div>
                <div class="calc-field">
                    <label>Guarantee Status</label>
                    <select id="c-guarantee">
                        <option value="5050">50/50</option>
                        <option value="guaranteed">Guaranteed</option>
                    </select>
                </div>
                <div class="calc-field">
                    <label>Days Until Banner Ends</label>
                    <input type="number" id="c-days" value="24" min="1">
                </div>
                <div class="calc-field">
                    <label>Do Daily Quests?</label>
                    <select id="c-dailies">
                        <option value="yes">Yes (60/day)</option>
                        <option value="no">No</option>
                    </select>
                </div>
            </div>
            <button class="calc-btn" onclick="runCalc()">Calculate My Odds</button>
        </div>
        <div id="calc-result" class="calc-result"></div>
    `;
}

function runCalc() {
    const astrite = parseInt(document.getElementById('c-astrite').value) || 0;
    const tides = parseInt(document.getElementById('c-tides').value) || 0;
    const pity = parseInt(document.getElementById('c-pity').value) || 0;
    const guaranteed = document.getElementById('c-guarantee').value === 'guaranteed';
    const days = parseInt(document.getElementById('c-days').value) || 0;
    const dailies = document.getElementById('c-dailies').value === 'yes';

    // Income
    let income = 0;
    if (dailies) income += days * 60;
    income += 700; // Tower of Adversity
    income += 500; // Events estimate
    income += 300; // Codes + misc

    const totalPulls = Math.floor((astrite + income) / 160) + tides;
    const pullsToSoftPity = Math.max(0, 64 - pity);
    const pullsToHardPity = 80 - pity;

    // Scenarios
    const best = pullsToSoftPity;
    const avg = Math.ceil(pullsToHardPity * (guaranteed ? 0.7 : 1.1));
    const worst = guaranteed ? pullsToHardPity : pullsToHardPity + 80;

    let verdict, verdictClass;
    if (totalPulls >= worst) { verdict = "✅ GUARANTEED — You're safe!"; verdictClass = "verdict-safe"; }
    else if (totalPulls >= avg) { verdict = "⚠️ GOOD CHANCE — Likely but not certain"; verdictClass = "verdict-risky"; }
    else if (totalPulls >= best) { verdict = "🎲 RISKY — Need luck"; verdictClass = "verdict-risky"; }
    else { verdict = "❌ SHORT — Need more resources"; verdictClass = "verdict-short"; }

    const resultDiv = document.getElementById('calc-result');
    resultDiv.innerHTML = `
        <div class="result-verdict ${verdictClass}">${verdict}</div>
        <div class="result-grid">
            <div class="result-card">
                <span class="result-label">Your Pulls</span>
                <span class="result-num">${totalPulls}</span>
            </div>
            <div class="result-card">
                <span class="result-label">Best Case</span>
                <span class="result-num green">${best}</span>
            </div>
            <div class="result-card">
                <span class="result-label">Average</span>
                <span class="result-num yellow">${avg}</span>
            </div>
            <div class="result-card">
                <span class="result-label">Worst Case</span>
                <span class="result-num red">${worst}</span>
            </div>
        </div>
        <div class="result-breakdown glass">
            <h4>Income Breakdown (${days} days)</h4>
            <div class="breakdown-row"><span>Current Astrite</span><span>${astrite.toLocaleString()}</span></div>
            ${dailies ? `<div class="breakdown-row"><span>Daily Quests (${days}d × 60)</span><span>+${(days*60).toLocaleString()}</span></div>` : ''}
            <div class="breakdown-row"><span>Tower of Adversity</span><span>+700</span></div>
            <div class="breakdown-row"><span>Events + Codes</span><span>+800</span></div>
            <div class="breakdown-row"><span>Radiant Tides</span><span>+${tides} pulls</span></div>
            <div class="breakdown-row total"><span>Total Pulls Available</span><span>${totalPulls}</span></div>
        </div>
    `;
}

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initRoster();
    initPlanner();
    initCalc();
});

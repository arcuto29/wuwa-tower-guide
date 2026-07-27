// === WuWa Pull Calculator - Core Logic ===

// =============================================
// PITY SYSTEM CONSTANTS
// =============================================
const PITY = {
    HARD_PITY: 80,          // Guaranteed 5-star at pull 80
    SOFT_PITY_START: 64,    // Rate starts increasing here
    SOFT_PITY_RATE: 0.06,   // ~6% increase per pull after soft pity
    BASE_RATE: 0.008,       // 0.8% base 5-star rate
    FIFTY_FIFTY: 0.5,       // 50% chance to get featured character
    ASTRITE_PER_PULL: 160   // 160 Astrite = 1 Radiant Tide
};

// =============================================
// PROBABILITY CALCULATIONS
// =============================================

/**
 * Calculate probability of getting a 5-star at exactly pull N
 * given you haven't gotten one yet (conditional probability).
 * Uses soft pity ramp from pull 64 onwards.
 */
function getPullRate(pullNumber) {
    if (pullNumber < 1) return 0;
    if (pullNumber >= PITY.HARD_PITY) return 1;
    if (pullNumber < PITY.SOFT_PITY_START) return PITY.BASE_RATE;
    // Soft pity: rate increases linearly from pull 64 to 80
    return PITY.BASE_RATE + (pullNumber - PITY.SOFT_PITY_START + 1) * PITY.SOFT_PITY_RATE;
}

/**
 * Calculate expected pulls to get a 5-star given current pity.
 * Returns { best, average, worst } scenarios.
 */
function calculatePullsNeeded(currentPity, isGuaranteed, copies) {
    const results = {
        best: 0,
        average: 0,
        worst: 0
    };

    // For each copy needed:
    // Best case: hit 5-star early in soft pity and always win 50/50
    // Average: hit around pull 64-70 range, 50/50 factored in
    // Worst: go to hard pity 80 and lose every 50/50

    for (let copy = 0; copy < copies; copy++) {
        const pityForThisCopy = (copy === 0) ? currentPity : 0;
        const guaranteedForThisCopy = (copy === 0) ? isGuaranteed : false;

        // BEST CASE: Early soft pity hit + win 50/50
        const bestPulls = Math.max(1, PITY.SOFT_PITY_START - pityForThisCopy);
        results.best += bestPulls;

        // AVERAGE CASE: Expected value calculation
        // Average pulls to hit 5-star from current pity
        const avgPullsToFiveStar = calculateAveragePulls(pityForThisCopy);
        if (guaranteedForThisCopy) {
            results.average += avgPullsToFiveStar;
        } else {
            // 50% chance we need to go through another pity cycle
            results.average += avgPullsToFiveStar * 1.5;
        }

        // WORST CASE: Hard pity + lose 50/50 every time
        const worstPulls = PITY.HARD_PITY - pityForThisCopy;
        if (guaranteedForThisCopy) {
            results.worst += worstPulls;
        } else {
            // Lose 50/50, then go to hard pity again
            results.worst += worstPulls + PITY.HARD_PITY;
        }
    }

    results.best = Math.ceil(results.best);
    results.average = Math.ceil(results.average);
    results.worst = Math.ceil(results.worst);

    return results;
}

/**
 * Calculate average pulls to hit a 5-star from given pity count.
 * Uses weighted probability based on soft pity rates.
 */
function calculateAveragePulls(currentPity) {
    let expectedPulls = 0;
    let survivingProb = 1.0; // Probability of NOT having gotten 5-star yet

    for (let pull = currentPity + 1; pull <= PITY.HARD_PITY; pull++) {
        const rate = getPullRate(pull);
        const pullsFromStart = pull - currentPity;
        expectedPulls += pullsFromStart * rate * survivingProb;
        survivingProb *= (1 - rate);
    }

    // If somehow still surviving at hard pity (shouldn't happen since rate = 1 at 80)
    if (survivingProb > 0) {
        expectedPulls += (PITY.HARD_PITY - currentPity) * survivingProb;
    }

    return expectedPulls;
}


// =============================================
// INCOME CALCULATION
// =============================================

/**
 * Calculate total Astrite income between today and banner end date.
 * Factors in daily sources, one-time sources, and patch events.
 */
function calculateIncome(bannerEndDate) {
    const today = new Date();
    const endDate = new Date(bannerEndDate);
    const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

    let totalAstrite = 0;
    let totalFreeTides = 0;
    const breakdown = [];

    // Daily sources
    const checkboxes = document.querySelectorAll('.income-item input[type="checkbox"]:checked');

    checkboxes.forEach(cb => {
        const source = cb.dataset.source;
        const perDay = parseInt(cb.dataset.perDay) || 0;
        const flat = parseInt(cb.dataset.flat) || 0;

        if (perDay > 0) {
            const earned = perDay * daysRemaining;
            totalAstrite += earned;
            breakdown.push({
                name: cb.closest('.income-item').querySelector('.income-name').textContent,
                amount: earned,
                detail: `${perDay}/day x ${daysRemaining} days`
            });
        } else if (flat > 0) {
            totalAstrite += flat;
            breakdown.push({
                name: cb.closest('.income-item').querySelector('.income-name').textContent,
                amount: flat,
                detail: 'Flat amount'
            });
        } else {
            // Custom input sources
            let customAmount = 0;
            if (source === 'unclaimed-explore') {
                customAmount = parseInt(document.getElementById('explore-custom').value) || 0;
            } else if (source === 'unclaimed-quests') {
                customAmount = parseInt(document.getElementById('quest-custom').value) || 0;
            } else if (source === 'unclaimed-achievements') {
                customAmount = parseInt(document.getElementById('achieve-custom').value) || 0;
            }
            if (customAmount > 0) {
                totalAstrite += customAmount;
                breakdown.push({
                    name: cb.closest('.income-item').querySelector('.income-name').textContent,
                    amount: customAmount,
                    detail: 'Custom estimate'
                });
            }
        }
    });

    return {
        totalAstrite,
        totalFreeTides,
        daysRemaining,
        breakdown
    };
}


// =============================================
// MAIN CALCULATION & RESULTS DISPLAY
// =============================================

function calculate() {
    // Gather inputs
    const currentAstrite = parseInt(document.getElementById('current-astrite').value) || 0;
    const currentTides = parseInt(document.getElementById('current-tides').value) || 0;
    const currentPity = parseInt(document.getElementById('current-pity').value) || 0;
    const guaranteeStatus = document.getElementById('guarantee-status').value;
    const isGuaranteed = guaranteeStatus === 'guaranteed';

    const targetName = document.getElementById('target-name').value || 'Target Character';
    const targetEndDate = document.getElementById('target-end-date').value;
    const targetCopies = parseInt(document.getElementById('target-copies').value) || 1;

    // Calculate pulls needed (scenarios)
    const scenarios = calculatePullsNeeded(currentPity, isGuaranteed, targetCopies);

    // Calculate income
    const income = calculateIncome(targetEndDate);

    // Calculate total pulls available
    const currentPulls = Math.floor(currentAstrite / PITY.ASTRITE_PER_PULL) + currentTides;
    const incomePulls = Math.floor(income.totalAstrite / PITY.ASTRITE_PER_PULL) + income.totalFreeTides;
    const totalPulls = currentPulls + incomePulls;

    // Determine verdict
    let verdict, verdictClass, verdictIcon;
    if (totalPulls >= scenarios.worst) {
        verdict = `You can GUARANTEE ${targetName}!`;
        verdictClass = 'can-do';
        verdictIcon = '&#10004;';
    } else if (totalPulls >= scenarios.average) {
        verdict = `You have a GOOD CHANCE at ${targetName}`;
        verdictClass = 'risky';
        verdictIcon = '&#9888;';
    } else if (totalPulls >= scenarios.best) {
        verdict = `It's RISKY but possible for ${targetName}`;
        verdictClass = 'risky';
        verdictIcon = '&#9888;';
    } else {
        verdict = `You're SHORT for ${targetName}`;
        verdictClass = 'cant-do';
        verdictIcon = '&#10008;';
    }

    // Calculate deficit or surplus
    const surplusWorst = totalPulls - scenarios.worst;
    const surplusAvg = totalPulls - scenarios.average;
    const surplusBest = totalPulls - scenarios.best;

    // Render results
    renderResults({
        targetName,
        scenarios,
        income,
        currentPulls,
        incomePulls,
        totalPulls,
        currentAstrite,
        currentTides,
        verdict,
        verdictClass,
        verdictIcon,
        surplusWorst,
        surplusAvg,
        surplusBest,
        isGuaranteed,
        currentPity,
        targetCopies
    });
}


// =============================================
// RENDER RESULTS
// =============================================

function renderResults(data) {
    const section = document.getElementById('results-section');
    const content = document.getElementById('results-content');
    section.style.display = 'block';

    // Scroll to results
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const barPercent = Math.min(100, (data.totalPulls / data.scenarios.worst) * 100);
    let barClass = 'enough';
    if (data.totalPulls < data.scenarios.best) barClass = 'short';
    else if (data.totalPulls < data.scenarios.worst) barClass = 'partial';

    // Build action plan
    const actions = buildActionPlan(data);

    content.innerHTML = `
        <!-- VERDICT -->
        <div class="verdict ${data.verdictClass}">
            <div class="verdict-icon">${data.verdictIcon}</div>
            <h3>${data.verdict}</h3>
            <p>You'll have <strong>${data.totalPulls} pulls</strong> by banner end (${data.income.daysRemaining} days away)</p>
        </div>

        <!-- PULL MATH -->
        <div class="pull-math">
            <h3>Pull Breakdown</h3>
            <div class="math-row">
                <span class="math-label">Current Astrite (${data.currentAstrite.toLocaleString()})</span>
                <span class="math-value neutral">${Math.floor(data.currentAstrite / PITY.ASTRITE_PER_PULL)} pulls</span>
            </div>
            <div class="math-row">
                <span class="math-label">Current Radiant Tides</span>
                <span class="math-value neutral">${data.currentTides} pulls</span>
            </div>
            <div class="math-row">
                <span class="math-label">Astrite Income (${data.income.totalAstrite.toLocaleString()} over ${data.income.daysRemaining} days)</span>
                <span class="math-value positive">+${Math.floor(data.income.totalAstrite / PITY.ASTRITE_PER_PULL)} pulls</span>
            </div>
            <div class="math-row total">
                <span class="math-label">TOTAL AVAILABLE</span>
                <span class="math-value neutral">${data.totalPulls} pulls (${(data.totalPulls * PITY.ASTRITE_PER_PULL).toLocaleString()} Astrite equiv.)</span>
            </div>
        </div>

        <!-- SCENARIOS -->
        <div class="scenarios">
            <h3>Pulls Needed for ${data.targetName} (${data.targetCopies > 1 ? 'S' + (data.targetCopies - 1) : 'S0'})</h3>
            <div class="scenario-cards">
                <div class="scenario-card best">
                    <h4>Best Case</h4>
                    <div class="scenario-pulls">${data.scenarios.best}</div>
                    <div class="scenario-cost">${(data.scenarios.best * PITY.ASTRITE_PER_PULL).toLocaleString()} Astrite</div>
                    <div class="scenario-cost" style="margin-top:0.3rem;color:${data.surplusBest >= 0 ? 'var(--success)' : 'var(--danger)'}">
                        ${data.surplusBest >= 0 ? '+' + data.surplusBest + ' surplus' : data.surplusBest + ' deficit'}
                    </div>
                </div>
                <div class="scenario-card average">
                    <h4>Average</h4>
                    <div class="scenario-pulls">${data.scenarios.average}</div>
                    <div class="scenario-cost">${(data.scenarios.average * PITY.ASTRITE_PER_PULL).toLocaleString()} Astrite</div>
                    <div class="scenario-cost" style="margin-top:0.3rem;color:${data.surplusAvg >= 0 ? 'var(--success)' : 'var(--danger)'}">
                        ${data.surplusAvg >= 0 ? '+' + data.surplusAvg + ' surplus' : data.surplusAvg + ' deficit'}
                    </div>
                </div>
                <div class="scenario-card worst">
                    <h4>Worst Case</h4>
                    <div class="scenario-pulls">${data.scenarios.worst}</div>
                    <div class="scenario-cost">${(data.scenarios.worst * PITY.ASTRITE_PER_PULL).toLocaleString()} Astrite</div>
                    <div class="scenario-cost" style="margin-top:0.3rem;color:${data.surplusWorst >= 0 ? 'var(--success)' : 'var(--danger)'}">
                        ${data.surplusWorst >= 0 ? '+' + data.surplusWorst + ' surplus' : data.surplusWorst + ' deficit'}
                    </div>
                </div>
            </div>
            <p style="margin-top:1rem;font-size:0.8rem;color:var(--text-secondary);">
                ${data.isGuaranteed ? '&#10004; Your next 5-star IS the featured character (guaranteed)' : '&#9888; You are on 50/50 - there\'s a 50% chance of getting a non-featured 5-star first'}
                | Pity: ${data.currentPity}/80
            </p>
        </div>

        <!-- PROGRESS BAR -->
        <div class="income-breakdown">
            <h3>Progress to Guaranteed</h3>
            <div class="income-bar-container">
                <div class="income-bar">
                    <div class="income-bar-fill ${barClass}" style="width:${barPercent}%">
                        ${Math.round(barPercent)}%
                    </div>
                </div>
                <div class="bar-labels">
                    <span>0 pulls</span>
                    <span>Best: ${data.scenarios.best}</span>
                    <span>Avg: ${data.scenarios.average}</span>
                    <span>Worst: ${data.scenarios.worst}</span>
                </div>
            </div>
        </div>

        <!-- INCOME SOURCES BREAKDOWN -->
        <div class="pull-math">
            <h3>Income Sources Detail</h3>
            ${data.income.breakdown.map(src => `
                <div class="math-row">
                    <span class="math-label">${src.name} <em style="color:var(--text-secondary);font-size:0.75rem;">(${src.detail})</em></span>
                    <span class="math-value positive">+${src.amount.toLocaleString()}</span>
                </div>
            `).join('')}
            <div class="math-row total">
                <span class="math-label">TOTAL INCOME</span>
                <span class="math-value positive">${data.income.totalAstrite.toLocaleString()} Astrite = ${Math.floor(data.income.totalAstrite / PITY.ASTRITE_PER_PULL)} pulls</span>
            </div>
        </div>

        <!-- ACTION PLAN -->
        <div class="action-plan">
            <h3>Your Action Plan</h3>
            <div class="action-steps">
                ${actions.map((action, i) => `
                    <div class="action-step">
                        <div class="step-number">${i + 1}</div>
                        <div class="step-content">
                            <strong>${action.title}</strong>
                            <p>${action.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}


// =============================================
// ACTION PLAN BUILDER
// =============================================

function buildActionPlan(data) {
    const actions = [];
    const deficit = data.scenarios.worst - data.totalPulls;

    // Always: Do dailies
    actions.push({
        title: `Do Daily Quests every single day (${data.income.daysRemaining} days left)`,
        desc: `This alone gives you ${data.income.daysRemaining * 60} Astrite = ${Math.floor(data.income.daysRemaining * 60 / 160)} pulls. Never skip a day.`
    });

    // Tower of Adversity
    actions.push({
        title: 'Clear Tower of Adversity every reset',
        desc: '700 Astrite per 28-day reset. Full clear all 3 towers (Resonant + Echoing + Hazard). Check the Tower Guide for team recommendations!'
    });

    // If they have enough
    if (data.surplusWorst >= 0) {
        actions.push({
            title: 'You are SET - just maintain daily income',
            desc: `Even in the worst case scenario, you have ${data.surplusWorst} pulls to spare. Stay disciplined and don't pull on other banners!`
        });
    } else if (data.surplusAvg >= 0) {
        // They can probably get it but not guaranteed
        actions.push({
            title: 'Save EVERY Astrite - do not pull on other banners',
            desc: `You have a good chance (surplus in average case: +${data.surplusAvg} pulls) but you'd fall short in the worst case by ${Math.abs(data.surplusWorst)} pulls. Discipline is key.`
        });

        actions.push({
            title: 'Hunt extra Astrite sources',
            desc: 'Check for unclaimed exploration chests, side quests, achievements, and Pioneer Association rewards. Every chest counts.'
        });
    } else {
        // They're short even on average
        const deficitAstrite = Math.abs(data.surplusAvg) * PITY.ASTRITE_PER_PULL;

        actions.push({
            title: `You need ~${Math.abs(data.surplusAvg)} more pulls (${deficitAstrite.toLocaleString()} Astrite)`,
            desc: 'Consider the following options to close the gap:'
        });

        // Suggest free options first
        actions.push({
            title: 'Exploration Sprint',
            desc: 'Each region has thousands of Astrite in chests and puzzles. Use an interactive map to find unclaimed rewards. Resonance Nexuses = 30 each, Sonance Caskets give bulk rewards.'
        });

        if (deficit > 20) {
            actions.push({
                title: 'Consider Lunite Subscription ($5/month)',
                desc: `Gives 90 Astrite/day. Over ${data.income.daysRemaining} days = ${data.income.daysRemaining * 90} Astrite = ${Math.floor(data.income.daysRemaining * 90 / 160)} extra pulls. Best value paid option.`
            });
        }

        if (deficit > 40) {
            const topUpNeeded = Math.abs(data.surplusAvg) * PITY.ASTRITE_PER_PULL;
            actions.push({
                title: `Last resort: Top-up (~$${Math.ceil(topUpNeeded / 130)} estimated)`,
                desc: `If you want to guarantee it with money, you'd need approximately ${topUpNeeded.toLocaleString()} more Astrite. First-time top-ups give double value. Check if it's worth it for your budget.`
            });
        }
    }

    // Timing advice
    actions.push({
        title: 'Pull Strategy: Wait until last day if possible',
        desc: 'By waiting until the banner\'s final days, you maximize free Astrite collection and can make an informed decision. Pull single after reaching soft pity (pull 64+) for efficiency.'
    });

    return actions;
}

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Set default date to today for reference
    const today = new Date().toISOString().split('T')[0];

    // Calculate button
    document.getElementById('calculate-btn').addEventListener('click', calculate);

    // Auto-calculate on Enter key in inputs
    document.querySelectorAll('input[type="number"], select').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculate();
        });
    });

    // Banner item click to auto-fill dates
    document.querySelectorAll('.banner-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const start = item.dataset.start;
            const end = item.dataset.end;
            if (start) document.getElementById('target-date').value = start;
            if (end) document.getElementById('target-end-date').value = end;
            // Flash highlight
            item.style.background = 'rgba(240, 160, 48, 0.2)';
            setTimeout(() => item.style.background = '', 500);
        });
    });

    // Pity input validation
    document.getElementById('current-pity').addEventListener('input', (e) => {
        let val = parseInt(e.target.value);
        if (val > 79) e.target.value = 79;
        if (val < 0) e.target.value = 0;
    });
});

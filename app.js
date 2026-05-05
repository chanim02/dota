// =============================================
// DOTA 2 COUNTER PICKER — app.js
// =============================================

const OPENDOTA = 'https://api.opendota.com/api';
const CDN = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react';

// =============================================
// ITEM DATABASE  (img = CDN filename)
// =============================================
const ITEMS = {
  // ---- DEFENSIVE / UTILITY ----
  black_king_bar:  { name: 'Black King Bar',     img: 'black_king_bar',    reason: 'Magic immunity — essential vs. stun/magic-heavy lineups', priority: 3 },
  ghost:           { name: 'Ghost Scepter',       img: 'ghost',             reason: 'Untargetable by physical attacks — survive burst carries', priority: 3 },
  heavens_halberd: { name: "Heaven's Halberd",    img: 'heavens_halberd',   reason: 'Disarms carry — stops physical attacks for 3-4s',          priority: 2 },
  pipe:            { name: 'Pipe of Insight',     img: 'pipe',              reason: 'AOE magic barrier for team vs. magic burst',               priority: 2 },
  hood_of_defiance:{ name: 'Hood of Defiance',   img: 'hood_of_defiance',  reason: 'Magic resistance — core vs. magic damage heroes',          priority: 2 },
  eternal_shroud:  { name: 'Eternal Shroud',      img: 'eternal_shroud',    reason: 'High magic resist + converts damage to mana shield',       priority: 2 },
  lotus_orb:       { name: 'Lotus Orb',           img: 'lotus_orb',         reason: 'Reflects single-target spells back at the caster',         priority: 2 },
  sphere:          { name: "Linken's Sphere",      img: 'sphere',            reason: 'Blocks one targeted spell every 14s',                      priority: 2 },
  blade_mail:      { name: 'Blade Mail',           img: 'blade_mail',        reason: 'Returns damage — punishes right-click carries',            priority: 2 },
  crimson_guard:   { name: 'Crimson Guard',        img: 'crimson_guard',     reason: 'Blocks physical damage per hit — counters physical teams', priority: 1 },
  force_staff:     { name: 'Force Staff',          img: 'force_staff',       reason: 'Reposition out of initiations / pull allies to safety',    priority: 2 },
  aeon_disk:       { name: 'Aeon Disk',            img: 'aeon_disk',         reason: 'Saves from burst kill — vs. high nuke/AOE teams',          priority: 2 },
  cyclone:         { name: "Eul's Scepter",        img: 'cyclone',           reason: 'Dispels debuffs + interrupts channeling spells',           priority: 1 },
  glimmer_cape:    { name: 'Glimmer Cape',         img: 'glimmer_cape',      reason: 'Invisibility + magic resistance mid-fight for self/ally',  priority: 1 },
  hurricane_pike:  { name: 'Hurricane Pike',       img: 'hurricane_pike',    reason: 'Push away melee heroes + grants bonus range attack',       priority: 2 },

  // ---- OFFENSIVE ----
  blink:           { name: 'Blink Dagger',         img: 'blink',             reason: 'Instant gap-closer — get on squishy heroes fast',         priority: 3 },
  sheepstick:      { name: 'Scythe of Vyse',       img: 'sheepstick',        reason: 'Hard hex 3.5s — removes any threat instantly',            priority: 2 },
  orchid:          { name: 'Orchid Malevolence',   img: 'orchid',            reason: 'Silence + damage amp — shut down casters/escapes',        priority: 2 },
  bloodthorn:      { name: 'Bloodthorn',           img: 'bloodthorn',        reason: 'Silence + guaranteed crits — upgraded Orchid, kill fast',  priority: 2 },
  nullifier:       { name: 'Nullifier',            img: 'nullifier',         reason: 'Strips BKB, Force Staff, Glimmer off targets before kill', priority: 2 },
  desolator:       { name: 'Desolator',            img: 'desolator',         reason: 'Reduces armor — melts tanky/high-armor enemies',          priority: 2 },
  daedalus:        { name: 'Daedalus',             img: 'daedalus',          reason: 'Huge crit damage — burst squishies before they react',    priority: 2 },
  monkey_king_bar: { name: 'Monkey King Bar',      img: 'monkey_king_bar',   reason: 'True Strike — bypasses evasion (PA, Windranger, etc.)',   priority: 3 },
  silver_edge:     { name: 'Silver Edge',          img: 'silver_edge',       reason: 'Breaks passives on attack — PA evasion, AM shield, etc.', priority: 3 },
  diffusal_blade:  { name: 'Diffusal Blade',       img: 'diffusal_blade',    reason: 'Mana burn + slow — destroys mana-dependent heroes',       priority: 2 },
  abyssal_blade:   { name: 'Abyssal Blade',        img: 'abyssal_blade',     reason: 'Stun + bash — locks down any carry reliably',             priority: 2 },
  skadi:           { name: 'Eye of Skadi',         img: 'skadi',             reason: 'Strong slow + reduces healing — kite or chase anyone',    priority: 2 },
  maelstrom:       { name: 'Maelstrom',            img: 'maelstrom',         reason: 'Chain lightning — efficient vs. grouped or illusion teams',priority: 1 },
  mjollnir:        { name: 'Mjollnir',             img: 'mjollnir',          reason: 'Chain lightning + static shield — upgraded Maelstrom',    priority: 2 },
  manta:           { name: 'Manta Style',          img: 'manta',             reason: 'Dispels silences/slows + illusions to confuse/split',     priority: 2 },
  shadow_blade:    { name: 'Shadow Blade',         img: 'invis_sword',       reason: 'Invisibility for initiation or escaping after a kill',    priority: 1 },
  ethereal_blade:  { name: 'Ethereal Blade',       img: 'ethereal_blade',    reason: 'Amplifies magic damage — combo with nukes for burst kill', priority: 2 },
  assault:         { name: 'Assault Cuirass',      img: 'assault',           reason: 'Reduces enemy armor — more physical damage output',       priority: 1 },
  solar_crest:     { name: 'Solar Crest',          img: 'solar_crest',       reason: 'Apply to enemy to shred armor — great on supports',       priority: 1 },
  radiance:        { name: 'Radiance',             img: 'radiance',          reason: 'Burn damage + miss chance — counters illusion/push teams', priority: 1 },
};

// ---- DEFENSIVE items per role ----
const DEF_ROLE_ITEMS = {
  Disabler:  ['black_king_bar', 'sphere', 'lotus_orb', 'cyclone', 'force_staff'],
  Nuker:     ['hood_of_defiance', 'pipe', 'eternal_shroud', 'aeon_disk', 'black_king_bar', 'glimmer_cape'],
  Carry:     ['ghost', 'heavens_halberd', 'blade_mail', 'crimson_guard', 'hurricane_pike'],
  Durable:   ['blade_mail', 'aeon_disk', 'ghost', 'pipe'],
  Escape:    ['force_staff', 'hurricane_pike', 'cyclone'],
  Initiator: ['black_king_bar', 'aeon_disk', 'force_staff', 'glimmer_cape'],
  Support:   ['force_staff', 'glimmer_cape', 'lotus_orb'],
  Pusher:    ['crimson_guard', 'blade_mail'],
};

// ---- OFFENSIVE items per role ----
const OFF_ROLE_ITEMS = {
  Disabler:  ['blink', 'sheepstick', 'nullifier', 'orchid', 'ethereal_blade'],
  Nuker:     ['blink', 'sheepstick', 'ethereal_blade', 'nullifier', 'manta'],
  Carry:     ['desolator', 'daedalus', 'monkey_king_bar', 'silver_edge', 'abyssal_blade', 'mjollnir', 'skadi'],
  Durable:   ['desolator', 'diffusal_blade', 'silver_edge', 'abyssal_blade', 'daedalus', 'skadi'],
  Escape:    ['orchid', 'bloodthorn', 'nullifier', 'shadow_blade', 'blink'],
  Initiator: ['blink', 'sheepstick', 'shadow_blade', 'nullifier'],
  Support:   ['sheepstick', 'orchid', 'nullifier', 'ethereal_blade'],
  Pusher:    ['maelstrom', 'mjollnir', 'radiance', 'assault', 'solar_crest'],
};

// ---- Hero-specific items (hero_id → {defensive[], offensive[], note}) ----
const HERO_SPECIFIC = {
  1:  { defensive: ['sphere','force_staff','ghost'],         offensive: ['orchid','diffusal_blade','skadi'],        note: 'Silence before he blinks; Diffusal burns his mana shield; Skadi slows his chase' },
  2:  { defensive: ['ghost','force_staff','blade_mail'],     offensive: ['blink','sheepstick','orchid'],            note: "Ghost Scepter — untargetable during Berserker's Call; Blink to stay out of range" },
  5:  { defensive: ['black_king_bar','force_staff','pipe'],  offensive: ['orchid','blink','sheepstick'],            note: 'BKB blocks Freezing Field; Orchid interrupts her ult channel; Blink to close fast' },
  8:  { defensive: ['ghost','heavens_halberd','blade_mail'], offensive: ['orchid','abyssal_blade','sheepstick'],    note: "Ghost Scepter during Omnislash; Orchid silences so he can't pop BKB" },
  11: { defensive: ['black_king_bar','pipe','aeon_disk'],    offensive: ['blink','sheepstick','nullifier'],         note: 'BKB + Pipe survives Requiem; Blink out of his Shadowraze zones; Sheep before ult' },
  25: { defensive: ['black_king_bar','sphere','aeon_disk'],  offensive: ['blink','sheepstick','ethereal_blade'],   note: "BKB blocks Laguna Blade; Linken's blocks Dragon Slave targeting; Blink to gap-close" },
  26: { defensive: ['black_king_bar','aeon_disk','sphere'],  offensive: ['blink','sheepstick','blink'],             note: "BKB blocks Finger + Hex; Aeon Disk survives his burst combo" },
  35: { defensive: ['force_staff','ghost','blade_mail'],     offensive: ['blink','sheepstick','orchid'],            note: 'Force Staff pushes you out of hook range; stay spread to deny easy hooks' },
  41: { defensive: ['black_king_bar','sphere','force_staff'],offensive: ['monkey_king_bar','orchid','silver_edge'], note: 'MKB removes Blur evasion; Orchid silences her Windrun; Silver Edge also breaks Blur' },
  44: { defensive: ['blade_mail','ghost','aeon_disk'],       offensive: ['monkey_king_bar','silver_edge','desolator'],note: 'MKB true strike through Blur; Silver Edge breaks evasion; fight her before Dagger' },
  74: { defensive: ['black_king_bar','sphere','pipe'],       offensive: ['blink','sheepstick','nullifier'],         note: 'BKB blocks most Invocations; Linken blocks single-target; jump him before he invokes' },
  75: { defensive: ['black_king_bar','sphere','pipe'],       offensive: ['blink','sheepstick','nullifier'],         note: 'BKB blocks most Invocations; Linken blocks single-target; jump him before he invokes' },
  86: { defensive: ['black_king_bar','force_staff','aeon_disk'],offensive: ['blink','orchid','sheepstick'],        note: 'BKB blocks Lasso + Reverse Polarity; Force Staff to escape; Orchid before he ults' },
  89: { defensive: ['sphere','force_staff','ghost'],         offensive: ['orchid','sheepstick','blink'],           note: "Linken's blocks Fiend's Grip; Orchid to silence him before he sleeps you" },
  104:{ defensive: ['blade_mail','ghost','aeon_disk'],       offensive: ['monkey_king_bar','silver_edge','desolator'],note: 'MKB through Blur; Silver Edge breaks passives; burst her before Phantom Strike' },
};

// =============================================
// STATE
// =============================================
const state = {
  allHeroes: [],
  heroesMap: {},
  radiantTeam: [],
  direTeam: [],
  matchupsCache: {},
  search: '',
  attrFilter: 'all',
  pickingFor: 'radiant',
  selectedEnemyHero: null,
  activeItemTab: 'team',
  computingCounters: false,
};

// =============================================
// API
// =============================================
async function fetchHeroes() {
  const res = await fetch(`${OPENDOTA}/heroes`);
  if (!res.ok) throw new Error('Failed to fetch heroes');
  return res.json();
}

async function fetchMatchups(heroId) {
  if (state.matchupsCache[heroId]) return state.matchupsCache[heroId];
  const res = await fetch(`${OPENDOTA}/heroes/${heroId}/matchups`);
  if (!res.ok) throw new Error(`Matchup fetch failed for ${heroId}`);
  const data = await res.json();
  state.matchupsCache[heroId] = data;
  return data;
}

// =============================================
// HELPERS
// =============================================
function heroImgUrl(hero) {
  return `${CDN}/heroes/${hero.name.replace('npc_dota_hero_', '')}.png`;
}

function heroImgFallback() {
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><rect width='100' height='60' fill='%23131b2e'/></svg>`;
}

function itemImgUrl(imgKey) {
  return `${CDN}/items/${imgKey}.png`;
}

function getFilteredHeroes() {
  let heroes = state.allHeroes;
  if (state.attrFilter !== 'all') heroes = heroes.filter(h => h.primary_attr === state.attrFilter);
  if (state.search) {
    const q = state.search.toLowerCase();
    heroes = heroes.filter(h => h.localized_name.toLowerCase().includes(q));
  }
  return heroes;
}

function isInAnyTeam(heroId) {
  return state.radiantTeam.some(h => h.id === heroId) || state.direTeam.some(h => h.id === heroId);
}

// =============================================
// ITEM RECOMMENDATIONS
// Returns { defensive: [...], offensive: [...] }
// =============================================
function scoreItems(roleMap, enemies) {
  const scores = {};
  for (const enemy of enemies) {
    for (const role of (enemy.roles || [])) {
      const list = roleMap[role] || [];
      list.forEach((key, i) => {
        scores[key] = (scores[key] || 0) + (list.length - i + 1);
      });
    }
  }
  return scores;
}

function topFromScores(scores, limit = 6) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key]) => ({ key, ...ITEMS[key] }))
    .filter(item => item.name);
}

function computeTeamItems() {
  if (state.direTeam.length === 0) return { defensive: [], offensive: [] };
  const defScores = scoreItems(DEF_ROLE_ITEMS, state.direTeam);
  const offScores = scoreItems(OFF_ROLE_ITEMS, state.direTeam);
  // Melee enemy bonus
  for (const e of state.direTeam) {
    if (e.attack_type === 'Melee') {
      defScores['hurricane_pike'] = (defScores['hurricane_pike'] || 0) + 4;
    }
  }
  return { defensive: topFromScores(defScores, 6), offensive: topFromScores(offScores, 6) };
}

function computeHeroItems(heroId) {
  const hero = state.heroesMap[heroId];
  if (!hero) return { defensive: [], offensive: [] };

  const specific = HERO_SPECIFIC[heroId];

  if (specific) {
    const defensive = specific.defensive
      .map(key => ({ key, ...ITEMS[key] })).filter(i => i.name);
    const offensive = specific.offensive
      .map(key => ({ key, ...ITEMS[key] })).filter(i => i.name);
    return { defensive, offensive };
  }

  // Fallback: role-based
  const enemies = [hero];
  const defScores = scoreItems(DEF_ROLE_ITEMS, enemies);
  const offScores = scoreItems(OFF_ROLE_ITEMS, enemies);
  if (hero.attack_type === 'Melee') defScores['hurricane_pike'] = (defScores['hurricane_pike'] || 0) + 4;

  return { defensive: topFromScores(defScores, 5), offensive: topFromScores(offScores, 5) };
}

// =============================================
// COUNTER ANALYSIS
// =============================================
async function computeAndDisplayCounters() {
  if (state.direTeam.length === 0) { displayCounters([]); return; }

  state.computingCounters = true;
  showCounterLoading();

  try {
    await Promise.all(state.direTeam.map(h => fetchMatchups(h.id)));
  } catch (err) { console.error('Matchup fetch error:', err); }

  state.computingCounters = false;

  const scores = {};
  for (const potential of state.allHeroes) {
    if (isInAnyTeam(potential.id)) continue;
    let totalWr = 0, count = 0;
    for (const enemy of state.direTeam) {
      const matchups = state.matchupsCache[enemy.id];
      if (!matchups) continue;
      const m = matchups.find(x => x.hero_id === potential.id);
      if (!m || m.games_played < 100) continue;
      totalWr += (m.games_played - m.wins) / m.games_played;
      count++;
    }
    if (count >= Math.max(1, state.direTeam.length * 0.5)) {
      scores[potential.id] = { hero: potential, avgWr: totalWr / count, count };
    }
  }

  displayCounters(Object.values(scores).sort((a, b) => b.avgWr - a.avgWr).slice(0, 10));
}

// =============================================
// RENDERING
// =============================================
function renderHeroGrid() {
  const grid = document.getElementById('hero-grid');
  const heroes = getFilteredHeroes();

  if (heroes.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-dim);font-size:13px;padding:20px">No heroes found</p>`;
    return;
  }

  grid.innerHTML = heroes.map(hero => {
    const inRadiant = state.radiantTeam.some(h => h.id === hero.id);
    const inDire    = state.direTeam.some(h => h.id === hero.id);
    const cls = inRadiant ? 'in-radiant' : inDire ? 'in-dire' : '';
    return `<div class="hero-card ${cls}" data-id="${hero.id}" title="${hero.localized_name}">
      <img src="${heroImgUrl(hero)}" alt="${hero.localized_name}" loading="lazy" onerror="this.src='${heroImgFallback()}'">
      <div class="attr-pip ${hero.primary_attr}"></div>
      <div class="hero-name">${hero.localized_name}</div>
    </div>`;
  }).join('');

  grid.onclick = e => {
    const card = e.target.closest('.hero-card');
    if (!card) return;
    const hero = state.heroesMap[parseInt(card.dataset.id)];
    if (hero) handleHeroClick(hero);
  };
}

function renderTeams() {
  renderSlots('radiant-slots', state.radiantTeam, false);
  renderSlots('dire-slots', state.direTeam, true);
  document.getElementById('radiant-count').textContent = `${state.radiantTeam.length}/5`;
  document.getElementById('dire-count').textContent    = `${state.direTeam.length}/5`;
}

function renderSlots(containerId, team, isDire) {
  const el = document.getElementById(containerId);
  let html = team.map(hero => `
    <div class="hero-slot ${isDire ? 'clickable-slot' : ''}" data-id="${hero.id}">
      <img src="${heroImgUrl(hero)}" alt="${hero.localized_name}" onerror="this.src='${heroImgFallback()}'">
      <div class="slot-name">${hero.localized_name}</div>
      <button class="remove-btn" data-id="${hero.id}" data-dire="${isDire}">✕</button>
    </div>`).join('');
  for (let i = team.length; i < 5; i++) html += `<div class="hero-slot empty"></div>`;
  el.innerHTML = html;

  el.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = e => { e.stopPropagation(); removeHero(parseInt(btn.dataset.id), btn.dataset.dire === 'true'); };
  });

  if (isDire) {
    el.querySelectorAll('.hero-slot:not(.empty)').forEach(slot => {
      slot.onclick = e => {
        if (e.target.closest('.remove-btn')) return;
        const heroId = parseInt(slot.dataset.id);
        state.selectedEnemyHero = state.selectedEnemyHero === heroId ? null : heroId;
        state.activeItemTab = 'hero';
        document.querySelectorAll('.item-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('[data-tab="hero"]').classList.add('active');
        el.querySelectorAll('.hero-slot').forEach(s => s.classList.remove('selected-for-items'));
        if (state.selectedEnemyHero === heroId) slot.classList.add('selected-for-items');
        renderItems();
      };
    });
    if (state.selectedEnemyHero) {
      const slot = el.querySelector(`[data-id="${state.selectedEnemyHero}"]`);
      if (slot) slot.classList.add('selected-for-items');
    }
  }
}

function showCounterLoading() {
  document.getElementById('counters-content').innerHTML =
    `<div class="panel-loading"><div class="mini-loader"></div>Fetching matchup data...</div>`;
}

function displayCounters(counters) {
  const el = document.getElementById('counters-content');
  if (state.direTeam.length === 0) { el.innerHTML = `<p class="placeholder-text">Add heroes to the enemy team to see counters</p>`; return; }
  if (!counters || counters.length === 0) { el.innerHTML = `<p class="placeholder-text">Loading counter data...</p>`; return; }

  el.innerHTML = counters.map((c, i) => {
    const pct  = Math.round(c.avgWr * 100);
    const barW = Math.max(0, Math.min(100, (pct - 48) / 8 * 100));
    const cls  = pct >= 54 ? 'great' : 'good';
    return `<div class="counter-hero">
      <span class="counter-rank">#${i + 1}</span>
      <img src="${heroImgUrl(c.hero)}" alt="${c.hero.localized_name}" onerror="this.src='${heroImgFallback()}'">
      <div class="counter-info">
        <div class="counter-name">${c.hero.localized_name}</div>
        <div class="counter-bar-wrap"><div class="counter-bar ${cls}" style="width:${barW}%"></div></div>
      </div>
      <span class="counter-winrate ${cls}">${pct}%</span>
    </div>`;
  }).join('');
}

function renderItems() {
  const el = document.getElementById('items-content');
  if (state.direTeam.length === 0) {
    el.innerHTML = `<p class="placeholder-text">Add heroes to the enemy team to see item recommendations</p>`;
    return;
  }

  if (state.activeItemTab === 'team') {
    const { defensive, offensive } = computeTeamItems();
    el.innerHTML = renderItemSections(defensive, offensive, 'vs Enemy Team');

  } else {
    const chipHtml = buildChipHtml();

    if (!state.selectedEnemyHero) {
      el.innerHTML = `
        <div class="enemy-hero-select">${chipHtml}</div>
        <p class="placeholder-text" style="padding-top:10px">Click an enemy hero above</p>`;
    } else {
      const hero = state.heroesMap[state.selectedEnemyHero];
      const { defensive, offensive } = computeHeroItems(state.selectedEnemyHero);
      const specific = HERO_SPECIFIC[state.selectedEnemyHero];
      el.innerHTML = `
        <div class="enemy-hero-select">${chipHtml}</div>
        ${specific ? `<div class="hero-note">${specific.note}</div>` : ''}
        ${renderItemSections(defensive, offensive, hero ? `vs ${hero.localized_name}` : '')}`;
    }

    el.querySelectorAll('.enemy-hero-chip').forEach(chip => {
      chip.onclick = () => {
        state.selectedEnemyHero = parseInt(chip.dataset.id);
        document.querySelectorAll('#dire-slots .hero-slot').forEach(s => s.classList.remove('selected-for-items'));
        const slot = document.querySelector(`#dire-slots [data-id="${state.selectedEnemyHero}"]`);
        if (slot) slot.classList.add('selected-for-items');
        renderItems();
      };
    });
  }
}

function buildChipHtml() {
  return state.direTeam.map(h => `
    <div class="enemy-hero-chip ${h.id === state.selectedEnemyHero ? 'active' : ''}" data-id="${h.id}">
      <img src="${heroImgUrl(h)}" alt="${h.localized_name}" onerror="this.src='${heroImgFallback()}'">
      ${h.localized_name}
    </div>`).join('');
}

function renderItemSections(defensive, offensive, label) {
  return `
    <div class="items-section-header defensive-header">🛡 DEFENSIVE / UTILITY — ${label}</div>
    <div class="items-list">${defensive.map(renderItemEntry).join('')}</div>
    <div class="items-section-header offensive-header" style="margin-top:10px">⚔ OFFENSIVE — ${label}</div>
    <div class="items-list">${offensive.map(renderItemEntry).join('')}</div>`;
}

function renderItemEntry(item) {
  const prio = item.priority || 1;
  const dots = [1,2,3].map(d => `<div class="priority-dot ${d <= prio ? 'active' : ''}"></div>`).join('');
  return `<div class="item-entry">
    <img src="${itemImgUrl(item.img)}" alt="${item.name}" onerror="this.style.opacity='0.25'">
    <div class="item-info">
      <div class="item-name">${item.name}</div>
      <div class="item-reason">${item.reason}</div>
    </div>
    <div class="item-priority">${dots}</div>
  </div>`;
}

// =============================================
// EVENT HANDLERS
// =============================================
function handleHeroClick(hero) {
  if (isInAnyTeam(hero.id)) return;

  if (state.pickingFor === 'radiant') {
    if (state.radiantTeam.length >= 5) return;
    state.radiantTeam.push(hero);
  } else {
    if (state.direTeam.length >= 5) return;
    state.direTeam.push(hero);
    computeAndDisplayCounters();
  }

  // Auto-clear search so next hero is ready to search immediately
  const searchEl = document.getElementById('search-input');
  state.search = '';
  searchEl.value = '';
  searchEl.focus();

  renderHeroGrid();
  renderTeams();
  renderItems();
}

function removeHero(heroId, isDire) {
  if (isDire) {
    state.direTeam = state.direTeam.filter(h => h.id !== heroId);
    if (state.selectedEnemyHero === heroId) state.selectedEnemyHero = null;
  } else {
    state.radiantTeam = state.radiantTeam.filter(h => h.id !== heroId);
  }
  renderHeroGrid();
  renderTeams();
  renderItems();
  if (state.direTeam.length > 0) computeAndDisplayCounters(); else displayCounters([]);
}

function setPickingFor(team) {
  state.pickingFor = team;
  const btn = document.getElementById('team-toggle');
  if (team === 'radiant') {
    btn.className = 'team-toggle radiant';
    btn.innerHTML = 'Picking for <strong>RADIANT</strong>';
  } else {
    btn.className = 'team-toggle dire';
    btn.innerHTML = 'Picking for <strong>DIRE</strong>';
  }
}

// =============================================
// INIT
// =============================================
async function init() {
  try {
    const heroes = await fetchHeroes();
    heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name));
    state.allHeroes  = heroes;
    state.heroesMap  = Object.fromEntries(heroes.map(h => [h.id, h]));

    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';

    renderHeroGrid();
    renderTeams();
    renderItems();

    const searchEl = document.getElementById('search-input');
    searchEl.addEventListener('input', e => { state.search = e.target.value; renderHeroGrid(); });
    searchEl.focus();

    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== searchEl) { e.preventDefault(); searchEl.focus(); searchEl.select(); }
      if (e.key === 'Tab' && document.activeElement !== searchEl) { e.preventDefault(); setPickingFor(state.pickingFor === 'radiant' ? 'dire' : 'radiant'); }
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.attrFilter = btn.dataset.attr;
        renderHeroGrid();
      });
    });

    document.getElementById('team-toggle').addEventListener('click', () => {
      setPickingFor(state.pickingFor === 'radiant' ? 'dire' : 'radiant');
    });

    document.querySelectorAll('.item-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.item-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.activeItemTab = tab.dataset.tab;
        if (state.activeItemTab === 'team') state.selectedEnemyHero = null;
        renderItems();
      });
    });

  } catch (err) {
    console.error(err);
    document.getElementById('loading-screen').innerHTML =
      `<p style="color:var(--dire);font-size:14px;text-align:center;padding:20px">Failed to load hero data.<br>Check your internet connection and refresh.</p>`;
  }
}

init();

// =============================================
// DOTA 2 COUNTER PICKER — app.js
// =============================================

const OPENDOTA = 'https://api.opendota.com/api';
const CDN = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react';

// =============================================
// ITEM DATABASE
// key: internal name used for CDN image URL
// img: the exact filename on the CDN
// =============================================
const ITEMS = {
  black_king_bar: {
    name: 'Black King Bar',
    img: 'black_king_bar',
    reason: 'Magic immunity — essential vs. stun/magic-heavy lineups',
    tags: ['Disabler', 'Nuker'],
    priority: 3
  },
  ghost: {
    name: 'Ghost Scepter',
    img: 'ghost',
    reason: 'Untargetable by physical attacks — survive right-click carries',
    tags: ['Carry'],
    priority: 3
  },
  heavens_halberd: {
    name: "Heaven's Halberd",
    img: 'heavens_halberd',
    reason: 'Disarm stops carry from attacking for 3-4s',
    tags: ['Carry'],
    priority: 2
  },
  pipe: {
    name: 'Pipe of Insight',
    img: 'pipe',
    reason: 'AOE magic barrier for your team vs. magic burst',
    tags: ['Nuker'],
    priority: 2
  },
  hood_of_defiance: {
    name: 'Hood of Defiance',
    img: 'hood_of_defiance',
    reason: 'Magic resistance — core vs. magic damage heroes',
    tags: ['Nuker'],
    priority: 2
  },
  eternal_shroud: {
    name: 'Eternal Shroud',
    img: 'eternal_shroud',
    reason: 'High magic resist + converts damage to mana shield',
    tags: ['Nuker'],
    priority: 2
  },
  lotus_orb: {
    name: 'Lotus Orb',
    img: 'lotus_orb',
    reason: 'Reflects single-target spells back at the caster',
    tags: ['Disabler'],
    priority: 2
  },
  sphere: {
    name: "Linken's Sphere",
    img: 'sphere',
    reason: 'Blocks one targeted spell every 14s',
    tags: ['Disabler'],
    priority: 2
  },
  blade_mail: {
    name: 'Blade Mail',
    img: 'blade_mail',
    reason: 'Returns damage — punishes right-click carries hard',
    tags: ['Carry', 'Durable'],
    priority: 2
  },
  crimson_guard: {
    name: 'Crimson Guard',
    img: 'crimson_guard',
    reason: 'Blocks physical damage per hit — counters physical teams',
    tags: ['Carry'],
    priority: 1
  },
  silver_edge: {
    name: 'Silver Edge',
    img: 'silver_edge',
    reason: 'Breaks passives — counters PA evasion, AM shield, Bristle, etc.',
    tags: ['Carry', 'Durable'],
    priority: 3
  },
  monkey_king_bar: {
    name: 'Monkey King Bar',
    img: 'monkey_king_bar',
    reason: 'True Strike — bypasses evasion (PA, Windranger, Brewmaster)',
    tags: ['Carry'],
    priority: 3
  },
  diffusal_blade: {
    name: 'Diffusal Blade',
    img: 'diffusal_blade',
    reason: 'Burns mana + slow — vs. mana-dependent or durable heroes',
    tags: ['Durable', 'Escape'],
    priority: 2
  },
  orchid: {
    name: 'Orchid Malevolence',
    img: 'orchid',
    reason: 'Silence prevents mobile/escape heroes from using spells',
    tags: ['Escape', 'Support', 'Nuker'],
    priority: 2
  },
  bloodthorn: {
    name: 'Bloodthorn',
    img: 'bloodthorn',
    reason: 'Silence + guaranteed crits — upgraded Orchid for carry-killers',
    tags: ['Escape', 'Support'],
    priority: 2
  },
  hurricane_pike: {
    name: 'Hurricane Pike',
    img: 'hurricane_pike',
    reason: 'Push away melee heroes + grants extra attack range temporarily',
    tags: ['Carry'],
    attackType: 'Melee',
    priority: 2
  },
  force_staff: {
    name: 'Force Staff',
    img: 'force_staff',
    reason: 'Reposition yourself or teammates out of initiations',
    tags: ['Initiator', 'Disabler'],
    priority: 2
  },
  nullifier: {
    name: 'Nullifier',
    img: 'nullifier',
    reason: 'Dispels Force Staff, Glimmer Cape, BKB — stops defensive itemsing',
    tags: ['Support', 'Escape'],
    priority: 2
  },
  skadi: {
    name: 'Eye of Skadi',
    img: 'skadi',
    reason: 'Strong slow + reduces healing/regeneration on enemies',
    tags: ['Durable', 'Support'],
    priority: 2
  },
  aeon_disk: {
    name: 'Aeon Disk',
    img: 'aeon_disk',
    reason: 'Saves you from burst kill — vs. high nuke/AOE teams',
    tags: ['Nuker', 'Initiator'],
    priority: 2
  },
  sheepstick: {
    name: 'Scythe of Vyse',
    img: 'sheepstick',
    reason: 'Hard hex 3.5s — removes any threat temporarily',
    tags: ['Carry', 'Durable', 'Initiator'],
    priority: 1
  },
  assault: {
    name: 'Assault Cuirass',
    img: 'assault',
    reason: 'Armor aura — reduces enemy armor for your team',
    tags: ['Carry', 'Durable'],
    priority: 1
  },
  cyclone: {
    name: "Eul's Scepter",
    img: 'cyclone',
    reason: 'Dispels debuffs on yourself + interrupts channeling spells',
    tags: ['Disabler', 'Nuker'],
    priority: 1
  },
  glimmer_cape: {
    name: 'Glimmer Cape',
    img: 'glimmer_cape',
    reason: 'Invisibility + magic resistance for you or an ally mid-fight',
    tags: ['Nuker', 'Initiator'],
    priority: 1
  },
  solar_crest: {
    name: 'Solar Crest',
    img: 'solar_crest',
    reason: 'Reduces enemy armor — great vs. physical carry on enemy team',
    tags: ['Carry'],
    priority: 1
  }
};

// Role → recommended items
const ROLE_ITEMS = {
  Disabler:  ['black_king_bar', 'sphere', 'lotus_orb', 'cyclone', 'force_staff'],
  Nuker:     ['hood_of_defiance', 'pipe', 'eternal_shroud', 'aeon_disk', 'black_king_bar', 'glimmer_cape'],
  Carry:     ['ghost', 'heavens_halberd', 'blade_mail', 'crimson_guard', 'silver_edge', 'monkey_king_bar', 'solar_crest'],
  Durable:   ['diffusal_blade', 'silver_edge', 'skadi', 'sheepstick', 'blade_mail', 'assault'],
  Escape:    ['orchid', 'bloodthorn', 'hurricane_pike', 'nullifier', 'monkey_king_bar'],
  Initiator: ['black_king_bar', 'aeon_disk', 'force_staff', 'glimmer_cape'],
  Support:   ['orchid', 'nullifier', 'skadi'],
  Pusher:    ['assault', 'crimson_guard']
};

// Hero-specific item overrides (hero_id → items + notes)
const HERO_SPECIFIC = {
  1:  { items: ['orchid','force_staff','skadi'],           note: 'Silence before he blinks; Skadi slows his mana burn spam' },       // Anti-Mage
  2:  { items: ['ghost','force_staff','blade_mail'],        note: "Ghost Scepter — you can't be attacked during Berserker's Call" },  // Axe
  5:  { items: ['black_king_bar','force_staff','glimmer_cape'], note: 'BKB blocks Frostbite + Freezing Field; Force Staff to interrupt ult' }, // Crystal Maiden
  8:  { items: ['ghost','heavens_halberd','blade_mail'],    note: "Ghost Scepter negates his physical damage during Omnislash" },     // Juggernaut
  11: { items: ['black_king_bar','pipe','aeon_disk'],       note: 'BKB + Pipe survive his Shadowraze + Requiem combo' },              // Shadow Fiend
  25: { items: ['black_king_bar','sphere','force_staff'],   note: 'BKB blocks Laguna Blade; Force Staff to interrupt Fiends Gate' }, // Lina
  26: { items: ['black_king_bar','aeon_disk','pipe'],       note: "BKB blocks most of Lion's kit; Aeon Disk if they finger you" },   // Lion
  35: { items: ['force_staff','ghost','blade_mail'],        note: 'Force Staff pushes you out of his hook range' },                   // Pudge
  41: { items: ['black_king_bar','sphere','pipe'],          note: 'BKB during Epicenter; Linken blocks Shackleshot' },               // Windranger/WR — also evasion
  44: { items: ['monkey_king_bar','blade_mail','ghost'],    note: 'MKB removes her Blur evasion; Ghost while she Dagger focuses you' }, // Phantom Assassin
  74: { items: ['pipe','hood_of_defiance','aeon_disk'],     note: 'Magic resist is key — Invoker has high magic burst in all forms' }, // Invoker
  75: { items: ['black_king_bar','sphere','pipe'],          note: 'BKB blocks Invoke spells; Linken blocks single-target spells' },   // Invoker (id check)
  86: { items: ['black_king_bar','force_staff','aeon_disk'],note: 'BKB blocks Lasso and Reverse Polarity; Force Staff to escape' },  // Enigma
  89: { items: ['sphere','force_staff','ghost'],            note: "Linken's blocks Fiend's Grip; Force Staff to escape" },            // Bane
  104:{ items: ['silver_edge','orchid','monkey_king_bar'],  note: 'Silver Edge breaks Blur; Orchid silences before he blinks' },     // Phantom Assassin alt id check
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
  computingCounters: false
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
  if (!res.ok) throw new Error(`Failed to fetch matchups for hero ${heroId}`);
  const data = await res.json();
  state.matchupsCache[heroId] = data;
  return data;
}

// =============================================
// HELPERS
// =============================================
function heroImgUrl(hero) {
  const key = hero.name.replace('npc_dota_hero_', '');
  return `${CDN}/heroes/${key}.png`;
}

function heroImgFallback() {
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><rect width='100' height='60' fill='%23131b2e'/></svg>`;
}

function itemImgUrl(imgKey) {
  return `${CDN}/items/${imgKey}.png`;
}

function getFilteredHeroes() {
  let heroes = state.allHeroes;
  if (state.attrFilter !== 'all') {
    heroes = heroes.filter(h => h.primary_attr === state.attrFilter);
  }
  if (state.search) {
    const q = state.search.toLowerCase();
    heroes = heroes.filter(h => h.localized_name.toLowerCase().includes(q));
  }
  return heroes;
}

function isInAnyTeam(heroId) {
  return state.radiantTeam.some(h => h.id === heroId) ||
         state.direTeam.some(h => h.id === heroId);
}

// =============================================
// ITEM RECOMMENDATIONS
// =============================================
function computeTeamItems() {
  if (state.direTeam.length === 0) return [];

  const scores = {};

  for (const enemy of state.direTeam) {
    const roles = enemy.roles || [];
    for (const role of roles) {
      const roleItemList = ROLE_ITEMS[role] || [];
      roleItemList.forEach((key, i) => {
        // Earlier in list = higher score
        scores[key] = (scores[key] || 0) + (roleItemList.length - i + 1);
      });
    }
    // Bonus for melee enemy
    if (enemy.attack_type === 'Melee') {
      scores['hurricane_pike'] = (scores['hurricane_pike'] || 0) + 3;
    }
  }

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 9)
    .map(([key]) => ({ key, ...ITEMS[key] }))
    .filter(item => item.name);
}

function computeHeroItems(heroId) {
  const hero = state.heroesMap[heroId];
  if (!hero) return [];

  const specific = HERO_SPECIFIC[heroId];
  const scores = {};

  // Role-based scoring
  const roles = hero.roles || [];
  for (const role of roles) {
    const roleItemList = ROLE_ITEMS[role] || [];
    roleItemList.forEach((key, i) => {
      scores[key] = (scores[key] || 0) + (roleItemList.length - i + 1) * 2;
    });
  }

  if (hero.attack_type === 'Melee') {
    scores['hurricane_pike'] = (scores['hurricane_pike'] || 0) + 4;
  }

  let roleItems = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([key]) => ({ key, ...ITEMS[key] }))
    .filter(item => item.name);

  if (specific) {
    const specKeys = new Set(specific.items);
    const specItems = specific.items
      .map(key => ({ key, ...ITEMS[key], heroSpecific: true, note: specific.note }))
      .filter(item => item.name);
    // Merge: specific first, then role-based (no duplicates), limit to 8
    roleItems = [...specItems, ...roleItems.filter(r => !specKeys.has(r.key))].slice(0, 8);
  }

  return roleItems;
}

// =============================================
// COUNTER ANALYSIS
// =============================================
async function computeAndDisplayCounters() {
  if (state.direTeam.length === 0) {
    displayCounters([]);
    return;
  }

  state.computingCounters = true;
  showCounterLoading();

  try {
    // Fetch matchups for all enemy heroes in parallel
    await Promise.all(state.direTeam.map(h => fetchMatchups(h.id)));
  } catch (err) {
    console.error('Matchup fetch error:', err);
  }

  state.computingCounters = false;

  // Score each hero not already picked
  const scores = {};

  for (const potential of state.allHeroes) {
    if (isInAnyTeam(potential.id)) continue;

    let totalWr = 0;
    let count = 0;

    for (const enemy of state.direTeam) {
      const matchups = state.matchupsCache[enemy.id];
      if (!matchups) continue;

      const m = matchups.find(x => x.hero_id === potential.id);
      if (!m || m.games_played < 100) continue;

      // m.wins = wins of enemy hero against potential
      // so potential win rate = (games_played - wins) / games_played
      const wr = (m.games_played - m.wins) / m.games_played;
      totalWr += wr;
      count++;
    }

    // Require data vs at least half the enemy team
    if (count >= Math.max(1, state.direTeam.length * 0.5)) {
      scores[potential.id] = { hero: potential, avgWr: totalWr / count, count };
    }
  }

  const sorted = Object.values(scores)
    .sort((a, b) => b.avgWr - a.avgWr)
    .slice(0, 10);

  displayCounters(sorted);
}

// =============================================
// RENDERING
// =============================================
function renderHeroGrid() {
  const grid = document.getElementById('hero-grid');
  const heroes = getFilteredHeroes();

  if (heroes.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-dim);font-size:13px;padding:20px;">No heroes found</p>`;
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

  for (let i = team.length; i < 5; i++) {
    html += `<div class="hero-slot empty"></div>`;
  }

  el.innerHTML = html;

  // Remove buttons
  el.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation();
      removeHero(parseInt(btn.dataset.id), btn.dataset.dire === 'true');
    };
  });

  // Click on enemy slot to select for items
  if (isDire) {
    el.querySelectorAll('.hero-slot:not(.empty)').forEach(slot => {
      slot.onclick = e => {
        if (e.target.closest('.remove-btn')) return;
        const heroId = parseInt(slot.dataset.id);
        state.selectedEnemyHero = state.selectedEnemyHero === heroId ? null : heroId;
        state.activeItemTab = 'hero';
        document.querySelectorAll('.item-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('[data-tab="hero"]').classList.add('active');
        // Update selected highlight
        el.querySelectorAll('.hero-slot').forEach(s => s.classList.remove('selected-for-items'));
        if (state.selectedEnemyHero === heroId) slot.classList.add('selected-for-items');
        renderItems();
      };
    });

    // Re-apply highlight if still selected
    if (state.selectedEnemyHero) {
      const slot = el.querySelector(`[data-id="${state.selectedEnemyHero}"]`);
      if (slot) slot.classList.add('selected-for-items');
    }
  }
}

function showCounterLoading() {
  document.getElementById('counters-content').innerHTML = `
    <div class="panel-loading"><div class="mini-loader"></div>Fetching matchup data...</div>`;
}

function displayCounters(counters) {
  const el = document.getElementById('counters-content');

  if (state.direTeam.length === 0) {
    el.innerHTML = `<p class="placeholder-text">Add heroes to the enemy team to see counters</p>`;
    return;
  }

  if (!counters || counters.length === 0) {
    el.innerHTML = `<p class="placeholder-text">Loading counter data...</p>`;
    return;
  }

  el.innerHTML = counters.map((c, i) => {
    const pct = Math.round(c.avgWr * 100);
    // Bar scale: 48% = 0%, 56% = 100%
    const barW = Math.max(0, Math.min(100, (pct - 48) / 8 * 100));
    const colorCls = pct >= 54 ? 'great' : 'good';

    return `<div class="counter-hero">
      <span class="counter-rank">#${i + 1}</span>
      <img src="${heroImgUrl(c.hero)}" alt="${c.hero.localized_name}" onerror="this.src='${heroImgFallback()}'">
      <div class="counter-info">
        <div class="counter-name">${c.hero.localized_name}</div>
        <div class="counter-bar-wrap">
          <div class="counter-bar ${colorCls}" style="width:${barW}%"></div>
        </div>
      </div>
      <span class="counter-winrate ${colorCls}">${pct}%</span>
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
    const items = computeTeamItems();
    el.innerHTML = `
      <div class="items-section-header">Recommended vs. Enemy Team</div>
      <div class="items-list">${items.map(renderItemEntry).join('')}</div>`;
  } else {
    // Build hero chip row
    const chipHtml = state.direTeam.map(h => `
      <div class="enemy-hero-chip ${h.id === state.selectedEnemyHero ? 'active' : ''}" data-id="${h.id}">
        <img src="${heroImgUrl(h)}" alt="${h.localized_name}" onerror="this.src='${heroImgFallback()}'">
        ${h.localized_name}
      </div>`).join('');

    if (!state.selectedEnemyHero) {
      el.innerHTML = `
        <div class="enemy-hero-select">${chipHtml}</div>
        <p class="placeholder-text" style="padding-top:10px">Click an enemy hero to see specific counters</p>`;
    } else {
      const hero  = state.heroesMap[state.selectedEnemyHero];
      const items = computeHeroItems(state.selectedEnemyHero);
      const specific = HERO_SPECIFIC[state.selectedEnemyHero];

      el.innerHTML = `
        <div class="enemy-hero-select">${chipHtml}</div>
        <div class="items-section-header">Items against ${hero ? hero.localized_name : ''}</div>
        ${specific ? `<div style="font-size:10px;color:var(--text-secondary);margin-bottom:8px;line-height:1.4">${specific.note}</div>` : ''}
        <div class="items-list">${items.map(renderItemEntry).join('')}</div>`;
    }

    // Chip click handlers
    el.querySelectorAll('.enemy-hero-chip').forEach(chip => {
      chip.onclick = () => {
        state.selectedEnemyHero = parseInt(chip.dataset.id);
        // Sync slot highlight
        document.querySelectorAll('#dire-slots .hero-slot').forEach(s => s.classList.remove('selected-for-items'));
        const slot = document.querySelector(`#dire-slots [data-id="${state.selectedEnemyHero}"]`);
        if (slot) slot.classList.add('selected-for-items');
        renderItems();
      };
    });
  }
}

function renderItemEntry(item) {
  const prio = item.priority || 1;
  const dots = [1, 2, 3].map(d =>
    `<div class="priority-dot ${d <= prio ? 'active' : ''}"></div>`).join('');

  return `<div class="item-entry">
    <img src="${itemImgUrl(item.img)}" alt="${item.name}" onerror="this.style.opacity='0.3'">
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

  if (state.direTeam.length > 0) {
    computeAndDisplayCounters();
  } else {
    displayCounters([]);
  }
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

    state.allHeroes = heroes;
    state.heroesMap = Object.fromEntries(heroes.map(h => [h.id, h]));

    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';

    renderHeroGrid();
    renderTeams();
    renderItems();

    // --- EVENTS ---

    // Search
    const searchEl = document.getElementById('search-input');
    searchEl.addEventListener('input', e => {
      state.search = e.target.value;
      renderHeroGrid();
    });

    // Press / to focus search
    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== searchEl) {
        e.preventDefault();
        searchEl.focus();
        searchEl.select();
      }
      // Tab to toggle team
      if (e.key === 'Tab' && document.activeElement !== searchEl) {
        e.preventDefault();
        setPickingFor(state.pickingFor === 'radiant' ? 'dire' : 'radiant');
      }
    });

    searchEl.focus();

    // Attr filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.attrFilter = btn.dataset.attr;
        renderHeroGrid();
      });
    });

    // Team toggle button
    document.getElementById('team-toggle').addEventListener('click', () => {
      setPickingFor(state.pickingFor === 'radiant' ? 'dire' : 'radiant');
    });

    // Item tabs
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
    document.getElementById('loading-screen').innerHTML = `
      <p style="color:var(--dire);font-size:14px;text-align:center;padding:20px">
        Failed to load hero data.<br>Check your internet connection and refresh the page.
      </p>`;
  }
}

init();

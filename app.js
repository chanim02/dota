// =============================================
// DOTA 2 COUNTER PICKER — app.js
// =============================================

const OPENDOTA = 'https://api.opendota.com/api';
const CDN = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react';

// =============================================
// ITEM DATABASE  (img = CDN filename)
// Priorities tuned for TURBO: cheap early-impact
// items ranked higher, expensive late-game lower.
// =============================================
const ITEMS = {
  // ---- DEFENSIVE / UTILITY ----
  // Cheap & high impact in turbo (under ~2500g) → priority 3
  ghost:           { name: 'Ghost Scepter',        img: 'ghost',             reason: 'Only 1500g — instant physical immunity, huge early value in turbo', priority: 3 },
  glimmer_cape:    { name: 'Glimmer Cape',         img: 'glimmer_cape',      reason: '1850g — invisible + magic resist mid-fight, cheap teamfight tool',  priority: 3 },
  blade_mail:      { name: 'Blade Mail',           img: 'blade_mail',        reason: '2100g — returns damage early when enemy carry is not yet tanky',     priority: 3 },
  force_staff:     { name: 'Force Staff',          img: 'force_staff',       reason: '2200g — cheap reposition out of initiations, core utility in turbo', priority: 3 },
  hood_of_defiance:{ name: 'Hood of Defiance',    img: 'hood_of_defiance',  reason: '2250g — best early magic resist item, core vs any magic lineup',     priority: 3 },
  eternal_shroud:  { name: 'Eternal Shroud',       img: 'eternal_shroud',    reason: '2750g — magic resist + mana barrier, great value for int heroes',    priority: 3 },
  aeon_disk:       { name: 'Aeon Disk',            img: 'aeon_disk',         reason: '3000g — saves from burst combos, very relevant in short turbo fights',priority: 2 },
  crimson_guard:   { name: 'Crimson Guard',        img: 'crimson_guard',     reason: '3100g — cheap block aura, efficient vs physical lineups',            priority: 2 },
  solar_crest:     { name: 'Solar Crest',          img: 'solar_crest',       reason: '2625g — apply to enemy to shred armor, good support pick',           priority: 2 },
  pipe:            { name: 'Pipe of Insight',      img: 'pipe',              reason: '3475g — AOE magic barrier, worth it if enemies have mass magic AOE',  priority: 2 },
  lotus_orb:       { name: 'Lotus Orb',            img: 'lotus_orb',         reason: '3500g — reflects single-target spells, punishes targeted disablers',  priority: 2 },
  heavens_halberd: { name: "Heaven's Halberd",     img: 'heavens_halberd',   reason: '3500g — disarms carry for 3-4s, efficient when enemy has one hard carry', priority: 2 },
  hurricane_pike:  { name: 'Hurricane Pike',       img: 'hurricane_pike',    reason: '4200g — push away melee heroes, bonus range attack',                 priority: 2 },
  black_king_bar:  { name: 'Black King Bar',       img: 'black_king_bar',    reason: '3975g — magic immunity, must-have vs heavy stun/magic lineups',       priority: 3 },
  cyclone:         { name: "Eul's Scepter",        img: 'cyclone',           reason: '2750g — cheap dispel + interrupts channeling spells',                priority: 2 },
  sphere:          { name: "Linken's Sphere",       img: 'sphere',            reason: '4600g — blocks one targeted spell, pricier so lower priority in turbo', priority: 1 },

  // ---- OFFENSIVE ----
  // Very cheap offensive items → priority 3
  blink:           { name: 'Blink Dagger',         img: 'blink',             reason: '2250g — instant gap-closer, best early initiation item in turbo',    priority: 3 },
  shadow_blade:    { name: 'Shadow Blade',         img: 'invis_sword',       reason: '2000g — cheap invis for initiation or escape after a kill',           priority: 3 },
  diffusal_blade:  { name: 'Diffusal Blade',       img: 'diffusal_blade',    reason: '2500g — mana burn + slow early, destroys mana-dependent heroes fast', priority: 3 },
  maelstrom:       { name: 'Maelstrom',            img: 'maelstrom',         reason: '2700g — chain lightning is efficient and cheap, great first item',    priority: 3 },
  orchid:          { name: 'Orchid Malevolence',   img: 'orchid',            reason: '3475g — silence + damage amp early, shuts down casters before they cast', priority: 3 },
  desolator:       { name: 'Desolator',            img: 'desolator',         reason: '3500g — -7 armor on hit, melts enemies fast in short turbo games',   priority: 3 },
  monkey_king_bar: { name: 'Monkey King Bar',      img: 'monkey_king_bar',   reason: '4200g — True Strike through evasion (PA, Windranger) — get this early', priority: 3 },
  silver_edge:     { name: 'Silver Edge',          img: 'silver_edge',       reason: '5050g — breaks passives, pricier but worth it vs PA/AM/Bristle',     priority: 2 },
  manta:           { name: 'Manta Style',          img: 'manta',             reason: '3800g — dispels silences/slows, illusions to split and confuse',      priority: 2 },
  ethereal_blade:  { name: 'Ethereal Blade',       img: 'ethereal_blade',    reason: '4900g — amplifies magic damage, combo with nuker for burst kill',     priority: 1 },
  nullifier:       { name: 'Nullifier',            img: 'nullifier',         reason: '4700g — strips BKB/Force Staff/Glimmer before kill, situational',     priority: 1 },
  assault:         { name: 'Assault Cuirass',      img: 'assault',           reason: '5400g — armor shred aura, expensive but strong vs full physical team', priority: 1 },
  sheepstick:      { name: 'Scythe of Vyse',       img: 'sheepstick',        reason: '5200g — hard hex, expensive for turbo but game-changing if reached',  priority: 1 },
  abyssal_blade:   { name: 'Abyssal Blade',        img: 'abyssal_blade',     reason: '6250g — stun + bash, rarely reached in turbo — luxury item',         priority: 1 },
  bloodthorn:      { name: 'Bloodthorn',           img: 'bloodthorn',        reason: '6275g — silence + crits, too expensive for turbo — buy Orchid instead', priority: 1 },
  skadi:           { name: 'Eye of Skadi',         img: 'skadi',             reason: '5100g — slow + anti-heal, expensive for turbo — situational luxury',  priority: 1 },
  daedalus:        { name: 'Daedalus',             img: 'daedalus',          reason: '5150g — huge crit, expensive — only if game goes longer than usual',  priority: 1 },
  mjollnir:        { name: 'Mjollnir',             img: 'mjollnir',          reason: '5700g — upgraded Maelstrom, expensive — stick to Maelstrom in turbo', priority: 1 },
  radiance:        { name: 'Radiance',             img: 'radiance',          reason: '5150g — burn + miss chance, too farm-dependent for turbo',            priority: 1 },
};

// ---- Items only suitable for INT/spell heroes ----
// (added to ITEMS DB inline below the main block — added here as new entries)
Object.assign(ITEMS, {
  veil_of_discord: { name: 'Veil of Discord',   img: 'veil_of_discord',   reason: '1475g — reduces enemy magic resistance, multiplies all your spells',      priority: 3 },
  phylactery:      { name: 'Phylactery',         img: 'phylactery',        reason: '2000g — adds a slow burst on your next spell, cheap spell amp for nukers', priority: 3 },
  rod_of_atos:     { name: 'Rod of Atos',        img: 'rod_of_atos',       reason: '2750g — roots a target for 2s, great setup for your follow-up spells',    priority: 2 },
  aghanims_scepter:{ name: "Aghanim's Scepter",  img: 'aghanims_scepter',  reason: '4200g — upgrades your ultimate, usually core on most int casters',        priority: 3 },
  kaya:            { name: 'Kaya',               img: 'kaya',              reason: '2050g — pure spell amp + mana cost reduction, cheap core for nukers',       priority: 3 },
  gleipnir:        { name: 'Gleipnir',           img: 'gleipnir',          reason: '4350g — AOE root for 1.6s, great teamfight setup for casters',             priority: 2 },
  octarine_core:   { name: 'Octarine Core',      img: 'octarine_core',     reason: '5900g — spell amp + lifesteal + CDR, strong if game goes long in turbo',   priority: 1 },
  refresher:       { name: 'Refresher Orb',      img: 'refresher',         reason: '5000g — double your ultimate, game-changing on Zeus/Enigma/etc.',          priority: 1 },
  witch_blade:     { name: 'Witch Blade',        img: 'witch_blade',       reason: '2800g — int-to-attack conversion, good on int heroes who want right-click',priority: 2 },
});

// ---- Which defensive items are valid per hero attribute ----
const ATTR_DEFENSIVE = {
  int:      ['ghost', 'glimmer_cape', 'force_staff', 'hood_of_defiance', 'eternal_shroud',
             'aeon_disk', 'cyclone', 'black_king_bar', 'lotus_orb', 'pipe', 'solar_crest', 'sphere'],
  agi:      ['ghost', 'blade_mail', 'heavens_halberd', 'black_king_bar', 'force_staff',
             'crimson_guard', 'hurricane_pike', 'aeon_disk', 'sphere', 'glimmer_cape', 'solar_crest'],
  str:      ['black_king_bar', 'blade_mail', 'crimson_guard', 'force_staff', 'heavens_halberd',
             'aeon_disk', 'lotus_orb', 'pipe', 'solar_crest', 'ghost'],
  all_attr: ['ghost', 'glimmer_cape', 'force_staff', 'black_king_bar', 'blade_mail',
             'hood_of_defiance', 'eternal_shroud', 'aeon_disk', 'cyclone', 'lotus_orb', 'solar_crest'],
};

// ---- Which offensive items are valid per hero attribute ----
const ATTR_OFFENSIVE = {
  int: ['blink','veil_of_discord','phylactery','kaya','rod_of_atos','aghanims_scepter','orchid',
        'gleipnir','sheepstick','octarine_core','refresher','witch_blade','ethereal_blade'],
  agi: ['maelstrom','desolator','monkey_king_bar','diffusal_blade','silver_edge','manta','abyssal_blade',
        'daedalus','skadi','mjollnir','blink','orchid','bloodthorn','nullifier','shadow_blade'],
  str: ['blink','desolator','abyssal_blade','silver_edge','orchid','sheepstick','skadi','nullifier',
        'maelstrom','shadow_blade','diffusal_blade'],
  all_attr: ['blink','desolator','maelstrom','orchid','silver_edge','monkey_king_bar','diffusal_blade',
             'sheepstick','ethereal_blade','manta','nullifier','shadow_blade','veil_of_discord'],
};

// ---- DEFENSIVE items per role (cheap first = higher score in turbo) ----
const DEF_ROLE_ITEMS = {
  Disabler:  ['blade_mail', 'force_staff', 'glimmer_cape', 'black_king_bar', 'cyclone', 'lotus_orb', 'sphere'],
  Nuker:     ['hood_of_defiance', 'glimmer_cape', 'eternal_shroud', 'black_king_bar', 'aeon_disk', 'pipe'],
  Carry:     ['ghost', 'blade_mail', 'solar_crest', 'crimson_guard', 'heavens_halberd', 'hurricane_pike'],
  Durable:   ['blade_mail', 'ghost', 'aeon_disk', 'crimson_guard', 'pipe'],
  Escape:    ['force_staff', 'cyclone', 'glimmer_cape', 'hurricane_pike'],
  Initiator: ['force_staff', 'glimmer_cape', 'black_king_bar', 'aeon_disk'],
  Support:   ['force_staff', 'glimmer_cape', 'cyclone', 'lotus_orb'],
  Pusher:    ['blade_mail', 'crimson_guard', 'solar_crest'],
};

// ---- OFFENSIVE items per role (cheap first = higher score in turbo) ----
const OFF_ROLE_ITEMS = {
  Disabler:  ['blink', 'orchid', 'diffusal_blade', 'nullifier', 'sheepstick', 'ethereal_blade'],
  Nuker:     ['blink', 'orchid', 'diffusal_blade', 'manta', 'nullifier', 'ethereal_blade'],
  Carry:     ['maelstrom', 'desolator', 'monkey_king_bar', 'diffusal_blade', 'silver_edge', 'skadi', 'daedalus', 'abyssal_blade'],
  Durable:   ['diffusal_blade', 'desolator', 'maelstrom', 'silver_edge', 'monkey_king_bar', 'skadi'],
  Escape:    ['shadow_blade', 'orchid', 'blink', 'nullifier', 'bloodthorn'],
  Initiator: ['blink', 'shadow_blade', 'orchid', 'sheepstick', 'nullifier'],
  Support:   ['orchid', 'blink', 'sheepstick', 'nullifier', 'ethereal_blade'],
  Pusher:    ['maelstrom', 'desolator', 'assault', 'radiance', 'mjollnir'],
};

// ============================================================
// HERO ARCHETYPES — recommended build for MY hero
// Used by getMyHeroBuild() when no MY_HERO_SPECIFIC entry found
// ============================================================
const HERO_ARCHETYPES = {
  agi_carry: {
    defensive: ['ghost','blade_mail','manta','black_king_bar','hurricane_pike','heavens_halberd'],
    offensive: ['maelstrom','desolator','diffusal_blade','blink','silver_edge','monkey_king_bar','skadi'],
    note: 'Rush Maelstrom — chain lightning is extremely gold-efficient in turbo. Black King Bar vs magic-heavy lineups.'
  },
  agi_utility: {
    defensive: ['ghost','force_staff','blade_mail','black_king_bar','glimmer_cape','manta'],
    offensive: ['blink','orchid','diffusal_blade','shadow_blade','desolator'],
    note: 'Blink or Shadow Blade for gap-close/escape. Orchid for silence lockdown. Manta to dispel slows.'
  },
  agi_support: {
    defensive: ['glimmer_cape','force_staff','ghost','solar_crest','lotus_orb'],
    offensive: ['blink','orchid','shadow_blade'],
    note: 'Glimmer Cape + Force Staff are core every game. Solar Crest on carry or enemy to boost fights.'
  },
  int_nuker: {
    defensive: ['ghost','force_staff','cyclone','black_king_bar','aeon_disk','eternal_shroud'],
    offensive: ['blink','kaya','veil_of_discord','phylactery','orchid','aghanims_scepter','sheepstick','octarine_core'],
    note: 'Veil of Discord + Kaya amplify all spell damage. Blink in, burst, blink out. Aghanim\'s is usually core.'
  },
  int_support: {
    defensive: ['glimmer_cape','force_staff','ghost','cyclone','pipe','lotus_orb','solar_crest'],
    offensive: ['blink','orchid','rod_of_atos','gleipnir','aghanims_scepter','sheepstick'],
    note: 'Force Staff + Glimmer Cape are must-buys every game. Aghanim\'s upgrades your toolkit. Pipe vs magic lineups.'
  },
  str_initiator: {
    defensive: ['black_king_bar','blade_mail','aeon_disk','crimson_guard','force_staff'],
    offensive: ['blink','shadow_blade','orchid','sheepstick','desolator'],
    note: 'Blink Dagger is your #1 item — buy it first every game. BKB for magic-heavy lineups. Orchid to silence key heroes.'
  },
  str_carry: {
    defensive: ['black_king_bar','blade_mail','heavens_halberd','aeon_disk'],
    offensive: ['blink','desolator','abyssal_blade','silver_edge','skadi','monkey_king_bar'],
    note: 'Black King Bar + Blink are core in turbo. Desolator shreds armor. Heaven\'s Halberd vs ranged carries.'
  },
  str_tank: {
    defensive: ['blade_mail','black_king_bar','crimson_guard','pipe','lotus_orb','aeon_disk'],
    offensive: ['blink','desolator','sheepstick','nullifier'],
    note: 'Blade Mail punishes right-clickers hard. Crimson Guard blocks all chip damage in turbo fights.'
  },
  str_support: {
    defensive: ['force_staff','glimmer_cape','pipe','lotus_orb','aeon_disk','solar_crest'],
    offensive: ['blink','orchid','sheepstick'],
    note: 'Pipe of Insight is excellent vs magic-heavy lineups. Solar Crest buffs carry or debuffs tanky enemies.'
  },
  universal: {
    defensive: ['ghost','force_staff','black_king_bar','blade_mail','aeon_disk','manta'],
    offensive: ['blink','desolator','orchid','sheepstick','nullifier','diffusal_blade'],
    note: 'Universal heroes scale with all stats. Blink + Orchid works on most universals. Flexible build.'
  },
};

// ---- MY hero-specific overrides (exceptions where archetype gives wrong items) ----
const MY_HERO_SPECIFIC = {
  74: { // Invoker — has Ghost Walk, so no Shadow Blade; specific spell-caster build
    defensive: ['black_king_bar','force_staff','cyclone','aeon_disk','ghost'],
    offensive: ['blink','orchid','aghanims_scepter','octarine_core','sheepstick','refresher'],
    note: 'Never buy Shadow Blade — you have Ghost Walk. Rush Blink + Orchid. Octarine Core gives 25% CDR on all spells and abilities. Refresher for double ult.'
  },
  82: { // Meepo — all items must work for all copies
    defensive: ['ghost','force_staff','aeon_disk','black_king_bar'],
    offensive: ['blink','diffusal_blade','maelstrom','aghanims_scepter','sheepstick'],
    note: 'Items affect all Meepos. Diffusal Blade poof-combo is devastating. Blink + Poof = instant burst. Aghanim\'s gives all Meepos their ult upgrade.'
  },
  80: { // Lone Druid — items go on the bear
    defensive: ['ghost','aeon_disk','blade_mail','black_king_bar'],
    offensive: ['desolator','maelstrom','orchid','silver_edge','aghanims_scepter'],
    note: 'Items like Desolator/Maelstrom go on the Spirit Bear. Orchid silences targets. Aghanim\'s upgrades the bear. You are fragile — stay back.'
  },
  67: { // Spectre — Radiance is core even in turbo
    defensive: ['blade_mail','ghost','manta','black_king_bar'],
    offensive: ['radiance','desolator','skadi','diffusal_blade','silver_edge'],
    note: 'Radiance is core for farm and Haunt illusion burn. Blade Mail + Dispersion return all damage dealt to you. Manta dispels slows and silences.'
  },
  61: { // Broodmother — spiderlings are your damage
    defensive: ['blade_mail','ghost','black_king_bar','force_staff'],
    offensive: ['orchid','desolator','maelstrom','silver_edge'],
    note: 'Maelstrom chain-hits all spiderlings for huge AOE. Orchid silences enemies who try to kite. Blade Mail punishes anyone who hits you.'
  },
};

// ---- Counter items vs specific ENEMY heroes (hero_id → what to buy to beat them) ----
const HERO_SPECIFIC = {
  // Anti-Mage
  1:  { defensive: ['sphere','force_staff','ghost'],            offensive: ['orchid','diffusal_blade','skadi'],
        note: 'Silence him before he blinks; Diffusal burns his mana shield; Skadi slows his escape' },
  // Axe
  2:  { defensive: ['ghost','force_staff','blade_mail'],        offensive: ['blink','sheepstick','orchid'],
        note: "Ghost Scepter — untargetable during Berserker's Call; Blade Mail returns his Call damage; Blink out of range" },
  // Bane
  3:  { defensive: ['sphere','aeon_disk','black_king_bar'],     offensive: ['orchid','blink','sheepstick'],
        note: "Linken's blocks Fiend's Grip; BKB breaks Nightmare; Orchid silences before he casts; Aeon Disk saves from burst combo" },
  // Bloodseeker
  4:  { defensive: ['ghost','force_staff','black_king_bar'],    offensive: ['orchid','blink','desolator'],
        note: 'Stand still when low HP — Rupture damages you for moving; BKB blocks Rupture; Ghost Scepter while rupturing' },
  // Crystal Maiden
  5:  { defensive: ['black_king_bar','pipe','aeon_disk'],       offensive: ['orchid','blink','sheepstick'],
        note: 'BKB blocks Freezing Field; Pipe for team magic resist; Orchid interrupts her ult channel; Blink in to kill her' },
  // Drow Ranger
  6:  { defensive: ['ghost','force_staff','blade_mail'],        offensive: ['blink','desolator','shadow_blade'],
        note: 'Get a melee hero close — her aura breaks; Ghost Scepter blocks her right-click; Blink/Shadow Blade to close gap fast' },
  // Earthshaker
  7:  { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','sheepstick'],
        note: 'Spread out wide to minimize Echo Slam bounce damage; Force Staff out of Fissure range; Orchid before he channels' },
  // Juggernaut
  8:  { defensive: ['ghost','heavens_halberd','blade_mail'],    offensive: ['orchid','abyssal_blade','sheepstick'],
        note: "Ghost Scepter during Omnislash makes you untargetable; Heaven's Halberd disarms between spins; Orchid silences BKB" },
  // Mirana
  9:  { defensive: ['ghost','force_staff','glimmer_cape'],      offensive: ['orchid','blink','monkey_king_bar'],
        note: 'MKB hits through Moonlight Shadow invis; Orchid cancels Sacred Arrow channel; Force Staff out of Arrow range' },
  // Morphling
  10: { defensive: ['sphere','force_staff','ghost'],            offensive: ['orchid','sheepstick','blink'],
        note: "Linken's blocks Waveform targeting; Orchid during Attribute Shift so he can't sustain; burst him before Replicate" },
  // Shadow Fiend
  11: { defensive: ['black_king_bar','pipe','aeon_disk'],       offensive: ['blink','sheepstick','nullifier'],
        note: 'BKB + Pipe survives Requiem of Souls; Blink out of his Shadowraze zone before ult lands; Sheep cancels Requiem' },
  // Phantom Lancer
  12: { defensive: ['ghost','blade_mail','heavens_halberd'],    offensive: ['maelstrom','desolator','silver_edge'],
        note: 'Maelstrom chain lightning hits ALL illusions at once; Blade Mail returns illusion damage back; kill real PL fast' },
  // Puck
  13: { defensive: ['force_staff','black_king_bar','aeon_disk'],offensive: ['orchid','blink','sheepstick'],
        note: 'Force Staff out of Dream Coil before it snaps; BKB prevents Phase Shift disable; Orchid during Phase Shift' },
  // Pudge
  14: { defensive: ['force_staff','ghost','blade_mail'],        offensive: ['blink','sheepstick','orchid'],
        note: 'Force Staff pushes you out of hook range; stay spread so he cannot isolate you; Blade Mail returns Rot damage' },
  // Razor
  15: { defensive: ['force_staff','ghost','aeon_disk'],         offensive: ['orchid','blink','nullifier'],
        note: 'Force Staff breaks Plasma Field link immediately; stay mobile to avoid Static Link stacks building up' },
  // Sand King
  16: { defensive: ['force_staff','black_king_bar','pipe'],     offensive: ['orchid','blink','sheepstick'],
        note: 'Spread out to reduce Epicenter pulses; BKB + Pipe for his AOE combo; Force Staff out of Burrowstrike range' },
  // Storm Spirit
  17: { defensive: ['ghost','black_king_bar','aeon_disk'],      offensive: ['orchid','sheepstick','rod_of_atos'],
        note: 'Orchid early before he has mana to ball out; Rod of Atos roots him in place; Ghost to survive burst' },
  // Sven
  18: { defensive: ['ghost','heavens_halberd','blade_mail'],    offensive: ['orchid','blink','sheepstick'],
        note: "Ghost Scepter during God's Strength makes you untargetable; Heaven's Halberd disarms him; Orchid before he ults" },
  // Tiny
  19: { defensive: ['force_staff','ghost','aeon_disk'],         offensive: ['blink','sheepstick','orchid'],
        note: 'Force Staff repositions after being Tossed; Aeon Disk saves from Avalanche+Toss combo burst; Orchid silences him' },
  // Vengeful Spirit
  20: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','desolator'],
        note: 'Force Staff prevents Swap positioning; Ghost Scepter vs her magic damage; Orchid silences before she Swaps' },
  // Windranger
  21: { defensive: ['black_king_bar','sphere','force_staff'],   offensive: ['monkey_king_bar','orchid','silver_edge'],
        note: 'MKB true strike removes Focus Fire evasion; Silver Edge also breaks evasion; Orchid cancels Windrun + silences' },
  // Zeus
  22: { defensive: ['hood_of_defiance','eternal_shroud','pipe'],offensive: ['blink','orchid','sheepstick'],
        note: 'Stack magic resist — Hood + Eternal Shroud reduces his nuke to almost nothing; Orchid when he has no mana' },
  // Kunkka
  23: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','sheepstick'],
        note: 'Force Staff to reposition after Torrent; Ghost Scepter vs Tidebringer cleave; spread vs Ghost Ship AOE' },
  // Lina
  25: { defensive: ['black_king_bar','sphere','aeon_disk'],     offensive: ['blink','sheepstick','orchid'],
        note: "BKB blocks Laguna Blade; Linken's blocks Dragon Slave targeting; Aeon Disk survives her burst combo" },
  // Lion
  26: { defensive: ['black_king_bar','aeon_disk','sphere'],     offensive: ['blink','sheepstick','orchid'],
        note: "BKB blocks Finger of Death + Hex; Linken's blocks Hex targeting; Aeon Disk saves from full combo" },
  // Shadow Shaman
  27: { defensive: ['black_king_bar','force_staff','sphere'],   offensive: ['blink','orchid','sheepstick'],
        note: "BKB breaks Shackles channel immediately; Linken's blocks Hex; Force Staff escapes Hex/Shackles" },
  // Slardar
  28: { defensive: ['ghost','force_staff','black_king_bar'],    offensive: ['orchid','blink','desolator'],
        note: 'Ghost Scepter vs his physical damage; BKB blocks Slithereen Crush; Force Staff out of Bash range' },
  // Tidehunter
  29: { defensive: ['force_staff','black_king_bar','pipe'],     offensive: ['orchid','blink','sheepstick'],
        note: 'BKB breaks Ravage stun; Force Staff out before he ults; Orchid silences before he channels Ravage' },
  // Witch Doctor
  30: { defensive: ['force_staff','black_king_bar','aeon_disk'],offensive: ['orchid','blink','sheepstick'],
        note: 'BKB blocks Death Ward targeting; Force Staff out of Paralyzing Cask bounces; Orchid cancels his ult cast' },
  // Lich
  31: { defensive: ['force_staff','ghost','pipe'],              offensive: ['blink','orchid','sheepstick'],
        note: 'Spread out so Chain Frost bounces fewer times; Force Staff out of Sinister Gaze; Pipe blocks Chain Frost magic' },
  // Riki
  32: { defensive: ['glimmer_cape','ghost','force_staff'],      offensive: ['orchid','desolator','blink'],
        note: 'Orchid reveals him from Smoke Screen invis; Glimmer Cape lets you invis too; ward the area to track him' },
  // Enigma
  33: { defensive: ['force_staff','black_king_bar','pipe'],     offensive: ['orchid','blink','sheepstick'],
        note: 'BKB breaks Black Hole; Force Staff out before his ult lands; Orchid silences the channel immediately' },
  // Tinker
  34: { defensive: ['sphere','black_king_bar','force_staff'],   offensive: ['orchid','blink','sheepstick'],
        note: "Linken's blocks Laser blind; BKB resists his nuke combo; Orchid during Rearm channel to deny another rotation" },
  // Sniper
  35: { defensive: ['ghost','force_staff','black_king_bar'],    offensive: ['blink','shadow_blade','desolator'],
        note: 'Blink or Shadow Blade to close gap instantly; Ghost Scepter blocks Assassinate; force him off his perch' },
  // Necrophos
  36: { defensive: ['ghost','aeon_disk','black_king_bar'],      offensive: ['orchid','blink','nullifier'],
        note: "Ghost Scepter blocks Reaper's Scythe; don't use lifesteal vs Sadist stacks; Nullifier dispels Heartstopper" },
  // Warlock
  37: { defensive: ['force_staff','black_king_bar','pipe'],     offensive: ['orchid','blink','sheepstick'],
        note: 'Force Staff escapes Fatal Bonds; BKB blocks Upheaval; focus Warlock first — kill him before the Golem wrecks you' },
  // Beastmaster
  38: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','desolator'],
        note: 'Orchid cancels Primal Roar before it lands; Force Staff out of roar range; kill the Hawk for vision denial' },
  // Queen of Pain
  39: { defensive: ['black_king_bar','aeon_disk','force_staff'],offensive: ['orchid','blink','sheepstick'],
        note: 'BKB blocks Sonic Wave; Aeon Disk saves from her burst combo; Orchid silences Blink dagger escape' },
  // Venomancer
  40: { defensive: ['hood_of_defiance','pipe','eternal_shroud'],offensive: ['orchid','blink','desolator'],
        note: 'Stack magic resist — Poison Nova is pure magic; Pipe for team protection; Orchid before he casts Nova' },
  // Faceless Void
  41: { defensive: ['ghost','force_staff','black_king_bar'],    offensive: ['orchid','sheepstick','blink'],
        note: 'Ghost Scepter INSIDE Chronosphere makes you untargetable; Force Staff out before Chrono; Orchid after Chrono ends' },
  // Wraith King
  42: { defensive: ['ghost','heavens_halberd','blade_mail'],    offensive: ['orchid','desolator','blink'],
        note: "Orchid during Reincarnation channel to deny revive; Heaven's Halberd disarms him; kill him twice fast in turbo" },
  // Death Prophet
  43: { defensive: ['black_king_bar','pipe','force_staff'],     offensive: ['orchid','blink','sheepstick'],
        note: 'Orchid silences Exorcism channel; BKB + Pipe survive her spirit barrage; Force Staff out of Silence range' },
  // Phantom Assassin
  44: { defensive: ['blade_mail','ghost','aeon_disk'],          offensive: ['monkey_king_bar','silver_edge','desolator'],
        note: 'MKB true strike through Blur evasion; Silver Edge breaks evasion + Coup de Grace; Blade Mail during her burst' },
  // Pugna
  45: { defensive: ['ghost','force_staff','black_king_bar'],    offensive: ['orchid','blink','sheepstick'],
        note: 'Ghost Scepter avoids Decrepify amplification; Force Staff out of Nether Ward radius; Orchid interrupts Life Drain' },
  // Templar Assassin
  46: { defensive: ['sphere','force_staff','blade_mail'],       offensive: ['orchid','monkey_king_bar','blink'],
        note: "Orchid silences so she can't use Psionic Traps; Linken's blocks Meld targeting; MKB for her evasion" },
  // Viper
  47: { defensive: ['black_king_bar','hood_of_defiance','eternal_shroud'], offensive: ['orchid','blink','sheepstick'],
        note: 'BKB purges Viper Strike slow; magic resist cuts his poison significantly; Orchid silences; Blink in to kill him' },
  // Luna
  48: { defensive: ['ghost','blade_mail','black_king_bar'],     offensive: ['blink','desolator','orchid'],
        note: 'Ghost Scepter during Eclipse; Blade Mail returns Moon Glaive cleave damage; BKB blocks Eclipse stun' },
  // Dragon Knight
  49: { defensive: ['ghost','heavens_halberd','force_staff'],   offensive: ['orchid','blink','desolator'],
        note: "Heaven's Halberd disarms him effectively; Ghost Scepter vs his melee Dragon Form; Orchid before Dragon Form activates" },
  // Dazzle
  50: { defensive: ['force_staff','ghost','glimmer_cape'],      offensive: ['nullifier','orchid','blink'],
        note: 'Nullifier dispels Shallow Grave — save your burst for after Grave; Orchid prevents him from healing teammates' },
  // Clockwerk
  51: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','sheepstick'],
        note: 'Force Staff escapes Hookshot pin; Ghost Scepter vs Battery Assault; BKB resists his power cog disables' },
  // Leshrac
  52: { defensive: ['black_king_bar','pipe','hood_of_defiance'],offensive: ['orchid','blink','sheepstick'],
        note: 'BKB + Pipe + Hood stack vs his massive AOE magic damage; Orchid before Diabolic Edict; Blink out of Split Earth stun' },
  // Nature's Prophet
  53: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','sheepstick'],
        note: "Orchid during Teleportation channel; Blink to close gap before he can escape; spread vs Sprout zones" },
  // Lifestealer
  54: { defensive: ['ghost','heavens_halberd','blade_mail'],    offensive: ['orchid','sheepstick','blink'],
        note: "Ghost Scepter makes you untargetable while Infest is inside you; Heaven's Halberd disarms his right-click hard" },
  // Dark Seer
  55: { defensive: ['force_staff','black_king_bar','pipe'],     offensive: ['orchid','blink','sheepstick'],
        note: 'Force Staff out of Ion Shell; BKB during Wall of Replica; Orchid cancels Surge before it activates on him' },
  // Clinkz
  56: { defensive: ['glimmer_cape','ghost','force_staff'],      offensive: ['orchid','desolator','blink'],
        note: 'Orchid cancels Skeleton Walk invis; Ghost Scepter blocks his burst combo; Glimmer Cape for invis counter-play' },
  // Omniknight
  57: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['nullifier','orchid','sheepstick'],
        note: 'Nullifier dispels Guardian Angel armor buff; time magic damage for after Guardian Angel; Orchid silences heals' },
  // Enchantress
  58: { defensive: ['ghost','force_staff','glimmer_cape'],      offensive: ['orchid','blink','desolator'],
        note: 'Orchid prevents enchanting your allies; Blink to close the ranged gap; Ghost Scepter vs Impetus damage burst' },
  // Huskar
  59: { defensive: ['blade_mail','ghost','black_king_bar'],     offensive: ['orchid','desolator','sheepstick'],
        note: 'Blade Mail returns Burning Spear stack damage; Ghost Scepter vs his right-click burst; BKB blocks his disable' },
  // Night Stalker
  60: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','desolator'],
        note: 'Force Staff out of Void; Ghost Scepter vs his night-time physical burst; Orchid silences Hunter in the Night' },
  // Broodmother
  61: { defensive: ['blade_mail','ghost','force_staff'],        offensive: ['orchid','desolator','maelstrom'],
        note: 'Maelstrom chain lightning kills spiderlings instantly; Blade Mail returns spider damage; Orchid silences Web movement' },
  // Bounty Hunter
  62: { defensive: ['ghost','force_staff','glimmer_cape'],      offensive: ['orchid','blink','desolator'],
        note: 'Orchid cancels Shadow Walk and prevents Track bonus gold; Ghost Scepter vs his burst; Glimmer for invis counter' },
  // Weaver
  63: { defensive: ['sphere','ghost','force_staff'],            offensive: ['orchid','desolator','blink'],
        note: "Linken's blocks Shukuchi targeting; Orchid before Time Lapse so he can't escape; Ghost Scepter vs right-click burst" },
  // Jakiro
  64: { defensive: ['force_staff','black_king_bar','pipe'],     offensive: ['orchid','blink','sheepstick'],
        note: 'BKB resists Dual Breath slow; Force Staff out of Macropyre flame patch; Pipe for magic resist; Orchid interrupts ult' },
  // Batrider
  65: { defensive: ['black_king_bar','force_staff','aeon_disk'],offensive: ['orchid','blink','sheepstick'],
        note: 'BKB breaks Flaming Lasso instantly; Force Staff before he drags you away; Orchid cancels Flamebreak channel' },
  // Chen
  66: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','sheepstick'],
        note: "Orchid silences Heal and Divine Favor; spread vs creep AOE; kill Chen's creeps first to remove his power" },
  // Spectre
  67: { defensive: ['ghost','force_staff','blade_mail'],        offensive: ['desolator','blink','sheepstick'],
        note: "Ghost Scepter during Haunt illusions; Blade Mail returns Spectral Dagger damage; fight her before Radiance power spike" },
  // Ancient Apparition
  68: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','sheepstick'],
        note: 'Force Staff escapes Cold Feet; DO NOT use lifesteal when Ice Blast debuff is active — it prevents healing' },
  // Doom
  69: { defensive: ['sphere','black_king_bar','lotus_orb'],     offensive: ['orchid','blink','sheepstick'],
        note: "Linken's blocks Doom targeting; Lotus Orb reflects Doom back; BKB does NOT block Doom — use Linken's or Lotus Orb" },
  // Ursa
  70: { defensive: ['ghost','heavens_halberd','blade_mail'],    offensive: ['orchid','blink','desolator'],
        note: "Ghost Scepter during Earthshock; Heaven's Halberd disarms his Fury Swipes; Blade Mail returns stacked Fury damage" },
  // Spirit Breaker
  71: { defensive: ['ghost','force_staff','aeon_disk'],         offensive: ['orchid','blink','sheepstick'],
        note: 'Ghost Scepter after Charge impact; Force Staff before he reaches you; Aeon Disk saves from his bash-into-ult combo' },
  // Gyrocopter
  72: { defensive: ['force_staff','ghost','pipe'],              offensive: ['orchid','blink','sheepstick'],
        note: 'Force Staff out of Flak Cannon range; Pipe vs Call Down magic AOE; Orchid interrupts his Rocket Barrage' },
  // Alchemist
  73: { defensive: ['ghost','blade_mail','heavens_halberd'],    offensive: ['orchid','blink','desolator'],
        note: "Ghost Scepter vs Acid Spray right-click amp; Heaven's Halberd disarms Chemical Rage; Orchid before Rage activates" },
  // Invoker (as enemy to face)
  74: { defensive: ['black_king_bar','force_staff','aeon_disk'],offensive: ['orchid','blink','sheepstick'],
        note: 'BKB resists his magic combos; Force Staff escapes Sun Strike; Orchid to silence between invocations; gap-close fast to disrupt him' },
  // Silencer
  75: { defensive: ['black_king_bar','force_staff','sphere'],   offensive: ['orchid','blink','sheepstick'],
        note: "BKB breaks Global Silence; Linken's blocks Last Word targeting; Orchid silences him so he cannot silence you" },
  // Outworld Destroyer
  76: { defensive: ['sphere','black_king_bar','aeon_disk'],     offensive: ['orchid','blink','sheepstick'],
        note: "Linken's blocks Astral Imprisonment; BKB resists his int-drain and Sanity's Eclipse; Orchid during ult channel" },
  // Lycan
  77: { defensive: ['ghost','heavens_halberd','blade_mail'],    offensive: ['orchid','blink','desolator'],
        note: "Heaven's Halberd disarms Wolf Form right-click; Ghost Scepter vs his physical burst; Orchid before Shapeshift" },
  // Brewmaster
  78: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','sheepstick'],
        note: 'Force Staff out of Primal Split tornado; Orchid silences before he splits; kill Fire brewling first for healing loss' },
  // Shadow Demon
  79: { defensive: ['sphere','aeon_disk','force_staff'],        offensive: ['orchid','blink','sheepstick'],
        note: "Linken's blocks Disruption; Aeon Disk saves from his illusion+spell combo; Orchid silences his ability chain" },
  // Lone Druid
  80: { defensive: ['ghost','blade_mail','black_king_bar'],     offensive: ['orchid','desolator','maelstrom'],
        note: "Orchid silences the Spirit Bear; Blade Mail returns bear right-click; kill the bear early — it's his main power" },
  // Chaos Knight
  81: { defensive: ['ghost','blade_mail','black_king_bar'],     offensive: ['orchid','maelstrom','desolator'],
        note: 'Maelstrom chain lightning hits ALL illusions simultaneously; Ghost Scepter during Chaos Strike crit; Orchid before Reality Rift' },
  // Meepo
  82: { defensive: ['ghost','blade_mail','force_staff'],        offensive: ['orchid','desolator','maelstrom'],
        note: 'AOE damage kills all Meepos at once — use Maelstrom chain, AOE spells; killing one kills all if no Aghanim\'s' },
  // Magnus
  83: { defensive: ['force_staff','black_king_bar','pipe'],     offensive: ['orchid','blink','sheepstick'],
        note: 'Force Staff BEFORE Reverse Polarity lands; BKB breaks the stun; spread out to avoid RP; Orchid during channel' },
  // Centaur Warrunner
  84: { defensive: ['ghost','force_staff','blade_mail'],        offensive: ['orchid','blink','sheepstick'],
        note: "Ghost Scepter vs Hoof Stomp + right-click; Force Staff out of Stampede path; Blade Mail returns Double Edge damage" },
  // Slark
  85: { defensive: ['ghost','force_staff','blade_mail'],        offensive: ['orchid','desolator','blink'],
        note: "Ghost Scepter breaks Dark Pact purge immunity window; Force Staff out of Pounce; Orchid so he can't Dark Pact" },
  // Rubick
  86: { defensive: ['sphere','force_staff','black_king_bar'],   offensive: ['orchid','blink','sheepstick'],
        note: "Linken's prevents him stealing your ultimate; Force Staff out of Telekinesis; Orchid silences before he can steal your ult" },
  // Disruptor
  87: { defensive: ['force_staff','black_king_bar','sphere'],   offensive: ['orchid','blink','sheepstick'],
        note: 'Force Staff escapes Kinetic Field walls; BKB breaks Static Storm silence; Orchid silences before Glimpse cast' },
  // Nyx Assassin
  88: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','desolator'],
        note: 'BKB blocks Spiked Carapace reflection; spread to reduce Impale range; Orchid cancels Vendetta invis' },
  // Naga Siren
  89: { defensive: ['force_staff','black_king_bar','sphere'],   offensive: ['orchid','desolator','maelstrom'],
        note: 'BKB breaks Song of the Siren; Maelstrom hits all Naga illusions; Orchid silences Ensnare; Force Staff out of nets' },
  // Keeper of the Light
  90: { defensive: ['sphere','force_staff','black_king_bar'],   offensive: ['orchid','blink','sheepstick'],
        note: "Linken's blocks Illuminate targeting; BKB vs Blinding Light stun; Orchid during Illuminate channel; Blink in fast" },
  // Io
  91: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','blink','sheepstick'],
        note: 'Orchid during Relocate cast to silence him; Force Staff breaks Tether bond range; kill Io first every fight' },
  // Visage
  92: { defensive: ['force_staff','ghost','black_king_bar'],    offensive: ['orchid','desolator','blink'],
        note: 'Force Staff escapes Soul Assumption burst; kill Familiars immediately — they deal massive burst damage' },
  // Slark... skip 93 (uncertain ID)
  // Medusa
  94: { defensive: ['ghost','orchid','force_staff'],            offensive: ['orchid','blink','desolator'],
        note: 'Burst her fast before Stone Gaze activates; Orchid before Mystic Snake restores her mana; MKB for right-click' },
  // Troll Warlord
  95: { defensive: ['ghost','heavens_halberd','blade_mail'],    offensive: ['orchid','blink','desolator'],
        note: "Ghost Scepter during Battle Trance; Heaven's Halberd disarms him during Trance; Orchid before he ults" },
  // Ogre Magi
  96: { defensive: ['black_king_bar','aeon_disk','force_staff'],offensive: ['orchid','blink','sheepstick'],
        note: 'BKB blocks Multicast Fireblast stuns; Aeon Disk saves from multi-cast burst; Force Staff out of melee range' },
  // Undying
  97: { defensive: ['ghost','force_staff','black_king_bar'],    offensive: ['orchid','blink','sheepstick'],
        note: 'Force Staff out of Tombstone zombie range; destroy Tombstone quickly — it heals Undying; Ghost Scepter vs Flesh Golem' },
  // Legion Commander
  104:{ defensive: ['ghost','heavens_halberd','blade_mail'],    offensive: ['orchid','blink','desolator'],
        note: "Ghost Scepter during Duel makes you untargetable; Heaven's Halberd disarms before Duel; Orchid silences her chase" },
};

// =============================================
// HERO SHORTCUTS  (abbreviation → localized_name)
// =============================================
const SHORTCUTS = {
  // Carries / AGI
  'am':     'Anti-Mage',
  'pa':     'Phantom Assassin',
  'pl':     'Phantom Lancer',
  'tb':     'Terrorblade',
  'spec':   'Spectre',
  'morph':  'Morphling',
  'jugg':   'Juggernaut',
  'jug':    'Juggernaut',
  'slark':  'Slark',
  'naga':   'Naga Siren',
  'void':   'Faceless Void',
  'fv':     'Faceless Void',
  'drow':   'Drow Ranger',
  'dr':     'Drow Ranger',
  'clinkz': 'Clinkz',
  'medusa': 'Medusa',
  'dusa':   'Medusa',
  'weaver': 'Weaver',
  'gyro':   'Gyrocopter',
  'viper':  'Viper',
  'razor':  'Razor',
  'sniper': 'Sniper',
  'luna':   'Luna',
  'mira':   'Mirana',
  'mk':     'Monkey King',
  'bh':     'Bounty Hunter',
  'ls':     'Lifestealer',
  'ta':     'Templar Assassin',
  'troll':  'Troll Warlord',
  'ursa':   'Ursa',
  'veno':   'Venomancer',
  'nyx':    'Nyx Assassin',
  'riki':   'Riki',
  'bs':     'Bloodseeker',
  'bb':     'Bristleback',
  'huskar': 'Huskar',
  'husk':   'Huskar',
  'witch':  'Witch Doctor',

  // Midlaners
  'sf':     'Shadow Fiend',
  'qop':    'Queen of Pain',
  'storm':  'Storm Spirit',
  'ember':  'Ember Spirit',
  'invoker':'Invoker',
  'inv':    'Invoker',
  'lina':   'Lina',
  'puck':   'Puck',
  'od':     'Outworld Destroyer',
  'zeus':   'Zeus',
  'lesh':   'Leshrac',
  'vis':    'Visage',
  'visage': 'Visage',
  'necro':  'Necrophos',
  'arc':    'Arc Warden',
  'timber': 'Timbersaw',
  'timb':   'Timbersaw',
  'sky':    'Skywrath Mage',
  'skyw':   'Skywrath Mage',

  // Supports / INT
  'cm':     'Crystal Maiden',
  'ss':     'Shadow Shaman',
  'lion':   'Lion',
  'lich':   'Lich',
  'bane':   'Bane',
  'jakiro': 'Jakiro',
  'jak':    'Jakiro',
  'kotl':   'Keeper of the Light',
  'rubick': 'Rubick',
  'rub':    'Rubick',
  'oracle': 'Oracle',
  'dazzle': 'Dazzle',
  'chen':   'Chen',
  'ench':   'Enchantress',
  'io':     'Io',
  'silencer':'Silencer',
  'sil':    'Silencer',
  'disruptor':'Disruptor',
  'dis':    'Disruptor',
  'ogre':   'Ogre Magi',
  'pudge':  'Pudge',
  'omni':   'Omniknight',
  'warlock':'Warlock',
  'war':    'Warlock',
  'wd':     'Witch Doctor',
  'grimstroke':'Grimstroke',
  'grim':   'Grimstroke',
  'phoenix':'Phoenix',
  'pango':  'Pangolier',
  'pugna':  'Pugna',

  // Initiators / Offlane / STR
  'axe':    'Axe',
  'dk':     'Dragon Knight',
  'sven':   'Sven',
  'tide':   'Tidehunter',
  'es':     'Earthshaker',
  'enigma': 'Enigma',
  'magnus': 'Magnus',
  'mag':    'Magnus',
  'bat':    'Batrider',
  'bara':   'Spirit Breaker',
  'sb':     'Spirit Breaker',
  'kunk':   'Kunkka',
  'ds':     'Dark Seer',
  'wk':     'Wraith King',
  'sk':     'Sand King',
  'ns':     'Night Stalker',
  'doom':   'Doom',
  'slardar':'Slardar',
  'slar':   'Slardar',
  'lc':     'Legion Commander',
  'np':     "Nature's Prophet",
  'furion': "Nature's Prophet",
  'wr':     'Windranger',
  'wind':   'Windranger',
  'treant': 'Treant Protector',
  'tree':   'Treant Protector',
  'brood':  'Broodmother',
  'tiny':   'Tiny',
  'tusk':   'Tusk',
  'meepo':  'Meepo',
  'undying':'Undying',
  'clock':  'Clockwerk',
  'cw':     'Clockwerk',
  'techies':'Techies',
  'tech':   'Techies',
  'primal': 'Primal Beast',
  'pb':     'Primal Beast',
  'earth':  'Earth Spirit',
  'void_spirit':'Void Spirit',
  'vs':     'Void Spirit',
  'mars':   'Mars',
  'hoodwink':'Hoodwink',
  'hw':     'Hoodwink',
  'snapfire':'Snapfire',
  'snap':   'Snapfire',
  'marci':  'Marci',
  'muerta': 'Muerta',
  'ringmaster':'Ringmaster',
  'ring':   'Ringmaster',
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
    const q = state.search.toLowerCase().trim();
    const shortcutMatch = SHORTCUTS[q]; // e.g. "ss" → "Shadow Shaman"
    heroes = heroes.filter(h => {
      const name = h.localized_name.toLowerCase();
      return name.includes(q) || (shortcutMatch && h.localized_name === shortcutMatch);
    });
  }
  return heroes;
}

function isInAnyTeam(heroId) {
  return state.radiantTeam.some(h => h.id === heroId) || state.direTeam.some(h => h.id === heroId);
}

function getMyHeroAttr() {
  if (state.radiantTeam.length === 0) return null;
  return state.radiantTeam[0].primary_attr; // 'str', 'agi', 'int', 'all_attr'
}

function filterByAttr(items, attrMap) {
  const attr = getMyHeroAttr();
  if (!attr) return items;
  const allowed = new Set(attrMap[attr] || []);
  return items.filter(item => allowed.has(item.key));
}

function filterOffensiveByAttr(items) { return filterByAttr(items, ATTR_OFFENSIVE); }
function filterDefensiveByAttr(items) { return filterByAttr(items, ATTR_DEFENSIVE); }

function getHeroArchetype(hero) {
  if (!hero) return 'universal';
  const attr  = hero.primary_attr;
  const roles = new Set(hero.roles || []);
  if (attr === 'all_attr') return 'universal';
  if (attr === 'agi') {
    if (roles.has('Carry'))   return 'agi_carry';
    if (roles.has('Support')) return 'agi_support';
    return 'agi_utility';
  }
  if (attr === 'int') {
    if (roles.has('Support') && !roles.has('Carry')) return 'int_support';
    return 'int_nuker';
  }
  if (attr === 'str') {
    if (roles.has('Carry'))                            return 'str_carry';
    if (roles.has('Support'))                          return 'str_support';
    if (roles.has('Initiator') || roles.has('Disabler')) return 'str_initiator';
    if (roles.has('Durable'))                          return 'str_tank';
    return 'str_initiator';
  }
  return 'universal';
}

function getMyHeroBuild(heroId) {
  const hero     = state.heroesMap[heroId];
  const specific = MY_HERO_SPECIFIC[heroId];
  if (specific) {
    return {
      defensive: specific.defensive.map(key => ({ key, ...ITEMS[key] })).filter(i => i.name),
      offensive: specific.offensive.map(key => ({ key, ...ITEMS[key] })).filter(i => i.name),
      note: specific.note || null,
    };
  }
  const archetype = getHeroArchetype(hero);
  const build     = HERO_ARCHETYPES[archetype] || HERO_ARCHETYPES.universal;
  return {
    defensive: build.defensive.map(key => ({ key, ...ITEMS[key] })).filter(i => i.name),
    offensive: build.offensive.map(key => ({ key, ...ITEMS[key] })).filter(i => i.name),
    note: build.note || null,
  };
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
  // If MY hero is selected, show their recommended build (not enemy-role scoring)
  if (state.radiantTeam.length > 0) {
    return getMyHeroBuild(state.radiantTeam[0].id);
  }
  // No hero picked yet — fall back to enemy-role scoring
  if (state.direTeam.length === 0) return { defensive: [], offensive: [], note: null };
  const defScores = scoreItems(DEF_ROLE_ITEMS, state.direTeam);
  const offScores = scoreItems(OFF_ROLE_ITEMS, state.direTeam);
  for (const e of state.direTeam) {
    if (e.attack_type === 'Melee') defScores['hurricane_pike'] = (defScores['hurricane_pike'] || 0) + 4;
  }
  const defensive = filterDefensiveByAttr(topFromScores(defScores, 20)).slice(0, 6);
  const offensive = filterOffensiveByAttr(topFromScores(offScores, 20)).slice(0, 6);
  return { defensive, offensive, note: null };
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

  const defensive = filterDefensiveByAttr(topFromScores(defScores, 15)).slice(0, 5);
  const offensive = filterOffensiveByAttr(topFromScores(offScores, 15)).slice(0, 5);
  return { defensive, offensive };
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
  document.getElementById('radiant-count').textContent = `${state.radiantTeam.length}/1`;
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
  const maxSlots = isDire ? 5 : 1;
  for (let i = team.length; i < maxSlots; i++) html += `<div class="hero-slot empty"></div>`;
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
  if (state.direTeam.length === 0) { el.innerHTML = `<p class="placeholder-text">Add heroes to the enemy to see counters</p>`; return; }
  if (!counters || counters.length === 0) { el.innerHTML = `<p class="placeholder-text">Loading counter data...</p>`; return; }

  el.innerHTML = `<div class="turbo-note">⚡ Data from normal matches — matchups still apply in Turbo</div>` +
  counters.map((c, i) => {
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
  }).join('') + '';
}

function renderItems() {
  const el = document.getElementById('items-content');
  const myHero = state.radiantTeam[0];
  if (!myHero && state.direTeam.length === 0) {
    el.innerHTML = `<p class="placeholder-text">Pick your hero first to see item recommendations</p>`;
    return;
  }
  if (!myHero) {
    el.innerHTML = `<p class="placeholder-text">Pick your hero to see a build recommendation</p>`;
    return;
  }

  if (state.activeItemTab === 'team') {
    const { defensive, offensive, note } = computeTeamItems();
    const myHero  = state.radiantTeam[0];
    const label   = myHero ? `${myHero.localized_name} build` : 'vs Enemy Team';
    const noteHtml = note ? `<div class="hero-note">${note}</div>` : '';
    el.innerHTML = noteHtml + renderItemSections(defensive, offensive, label);

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
    if (state.radiantTeam.length >= 1) return;
    state.radiantTeam.push(hero);
    setPickingFor('dire');
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
    btn.innerHTML = 'Picking for <strong>MY HERO</strong>';
  } else {
    btn.className = 'team-toggle dire';
    btn.innerHTML = 'Picking for <strong>ENEMY</strong>';
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
      // Tab toggles team
      if (e.key === 'Tab') { e.preventDefault(); setPickingFor(state.pickingFor === 'radiant' ? 'dire' : 'radiant'); return; }
      // Escape clears search
      if (e.key === 'Escape') { state.search = ''; searchEl.value = ''; searchEl.blur(); renderHeroGrid(); return; }
      // Any printable character focuses search and types into it
      if (document.activeElement !== searchEl && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        searchEl.focus();
        // Let the character fall through naturally into the input
      }
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

    document.getElementById('reset-btn').addEventListener('click', () => {
      state.radiantTeam     = [];
      state.direTeam        = [];
      state.selectedEnemyHero = null;
      state.search          = '';
      state.activeItemTab   = 'team';
      document.getElementById('search-input').value = '';
      document.querySelectorAll('.item-tab').forEach(t => t.classList.remove('active'));
      document.querySelector('[data-tab="team"]').classList.add('active');
      setPickingFor('radiant');
      renderHeroGrid();
      renderTeams();
      renderItems();
      displayCounters([]);
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

// TEXT: tips and tricks, coach messages and dialog text.
// Edit this file to change any wording. Keep to plain ASCII letters.

// stat slots (used by the summaries)
const TH = 0   // punches thrown
const LD = 1   // punches landed
const BK = 2   // your punches blocked
const GH = 3   // hits taken with guard down
const LO = 4   // punches thrown while exhausted
const PD = 5   // perfect dodges
const CN = 6   // counter hits

// [heading, tip, how it applies in the game, short banner]
const TIPS: string[][] = [
    ["Stance and guard", "Keep your hands up near your chin, elbows in, chin tucked. A good guard is your first defence.", "In the game: hold Down to block when you see the !", "Hands up, chin down."],
    ["Use the jab", "The jab is your fastest, safest punch. Use it to measure distance and set up other punches.", "In the game: it costs only 5 stamina.", "Jab to measure distance."],
    ["Punch in combinations", "Single punches are easy to block. Combinations like the 1-2 (jab then cross) create openings.", "In the game: throw the cross right after a jab.", "Follow a jab with a cross."],
    ["Return to guard", "A punch leaves you open until the hand is back. Reset your guard straight after throwing.", "In the game: a missed punch leaves you open to a counter.", "Hand back to guard."],
    ["Heavy punches need a setup", "Heavy punches are slow and tiring. Throw hooks and crosses when your opponent is tired, stunned or has just missed.", "In the game: a ! marks a heavy wind-up, and a quick jab can interrupt it.", "Heavy punches need setup."],
    ["Save your energy", "Wild swings burn energy and open your guard. Breathe out as you punch and pace yourself through each round.", "In the game: step back or block to recover stamina.", "Do not swing wildly."],
    ["Footwork and distance", "Stay balanced, never cross your feet, and move in and out of range instead of standing still in front of punches.", "In the game: step out of range before a heavy punch lands.", "Move in, punch, move out."],
    ["Dodge and counter", "Slipping or dodging just before a punch lands leaves your opponent off balance. Counter straight away.", "In the game: Up plus Right dashes in, Up standing still ducks, Up plus Left dashes away. A perfect dodge stuns them and your counter hits harder.", "Dodge late, then counter."],
    ["Train safely", "Learn with a qualified coach. Wear gloves, hand wraps, a mouthguard and headgear when sparring, and get checked after a hard hit to the head.", "This game does not replace real coaching.", "Train with a real coach."]
]

// short coach lines shown at the bottom of the screen during a fight (max about 50 letters)
const M_STAMINA_LOW = "Stamina low. Block or step back to recover."
const M_HEAVY = "The ! marks a heavy punch. Block or dodge late."
const M_FOE_TIRED = "Opponent tired. Good time for a heavy punch."
const M_COMBO = "Nice 1-2: jab to set up, cross to follow."
const M_MIX = "Mix up your punches. Repeats are easy to block."
const M_EXHAUSTED = "Exhausted punches are weak. Recover first."
const M_TOO_TIRED = "Too tired for that punch. Recover first."
const M_COUNTER = "Counter hit! Punching after a dodge hurts more."
const M_BLOCKED = "Blocked. Switch punches or wait for them to tire."
const M_GOOD_BLOCK = "Good block! Counter with a jab while they recover."
const M_INTERRUPT = "You interrupted a heavy punch. Jabs are fast."
const M_PERFECT = "Perfect dodge! Opponent open (stars). Counter!"
const M_PERFECTED = "Your punch was perfectly dodged. Block and reset."
const M_EARLY = "Dodged, but early. Dodge closer to impact."
const M_HIT_RECOVER = "Hit while recovering. Check range before swinging."
const M_HIT_GUARD = "Hit with your guard down. Hold Down to block."

const TITLE_TEXT = "BOXING TRAINING BOUT\n\nYou are a trainee in a boxing club. Fight 3 rounds against the CPU. The coach tracks your stamina, guard and range, then tells you what to improve. Learning matters more than winning.\n\nA simulation only. It does not replace a real coach."
const CONTROLS_TEXT = "CONTROLS\n\nLeft/Right: move\nA: jab\nB: cross\nA+B together: hook\nUp: dodge. Hold Right to dash in, stand still to duck, hold Left to dash away.\nDown (hold): block\nMenu: pause\n\nA ! over a boxer means a heavy punch is winding up. Dodge just before it lands for a PERFECT dodge, then counter!"

function rows(x: number[]): string {
    let acc = 0
    if (x[TH] > 0) acc = Math.round(100 * x[LD] / x[TH])
    return "Punches: " + x[TH] + ", landed " + x[LD] + " (" + acc + "%)\nBlocked by foe: " + x[BK] + "\nGuard-down hits: " + x[GH] + "\nExhausted punches: " + x[LO] + "\nPerfect dodges: " + x[PD] + ", counters: " + x[CN]
}

function advice(x: number[]): string {
    if (x[LO] >= 2) return "Stamina: you threw " + x[LO] + " punches while exhausted. Recover with Block or a step back first."
    if (x[GH] > 2 && x[GH] >= x[LD]) return "Defense: hit " + x[GH] + " times with your guard down. Watch the wind-up and hold Down."
    if (x[TH] > 3 && x[LD] / x[TH] < 0.35) return "Range: only " + Math.round(100 * x[LD] / x[TH]) + "% landed. Jab to measure distance before power punches."
    if (x[PD] + x[CN] >= 2) return "Reactions: " + x[PD] + " perfect dodges and " + x[CN] + " counters. Keep timing dodges just before punches land."
    return "Good balance of offense and defense. Try mixing punch types and moving off the line."
}

// picks the tip that matches your weakest area
function tipFor(x: number[], round: number): number {
    if (x[LO] >= 2) return 5
    if (x[GH] >= 3) return 0
    if (x[TH] > 3 && x[LD] / x[TH] < 0.35) return 1
    if (x[PD] == 0 && x[GH] > 1) return 7
    return (round + x[TH]) % TIPS.length
}

function summaryText(x: number[], round: number, over: boolean, win: boolean, ko: boolean): string {
    const t = TIPS[tipFor(x, round)]
    let head = "ROUND " + round + " COMPLETE"
    if (over) head = (win ? "YOU WIN" : "YOU LOSE") + (ko ? " BY KO" : " ON POINTS") + "\nLearning matters more than the result."
    return head + "\n\n" + rows(x) + "\n\nCoach: " + advice(x) + "\n\nBoxing tip - " + t[0] + ": " + t[1] + " " + t[2]
}

// the tips screen is split into 3 short pages
function tipsPage(p: number): string {
    let s = "BOXING TIPS " + (p + 1) + "/3\n"
    for (let i = p * 3; i < p * 3 + 3; i++) s += "\n" + TIPS[i][0] + ". " + TIPS[i][1] + " " + TIPS[i][2] + "\n"
    return s
}
// MAP: the arena, camera, screen shake, HUD and on-screen effects.
const S = 0.3        // world units -> screen pixels
const FY = 312       // floor line in world units
const FLOOR = 98     // floor line on the screen (pixels)

let camX = 0         // camera position in world units
let shk = 0          // screen shake timer
let shx = 0
let shy = 0
let arenaImg: Image = image.create(1, 1)

class Fx {
    x = 0
    y = 0
    t = 0
    y2 = 0
    s = ""
    c = 1
    k = 0            // 0 = text, 1 = hit burst, 2 = dust
}

function sxw(wx: number): number { return Math.round((wx - camX) * S + shx) }
function syw(ly: number): number { return Math.round(FLOOR + ly * S + shy) }

// crowd and lights: drawn once, never moves
function makeBg(): Image {
    const b = image.create(160, 120)
    b.fill(15)
    const cc = [12, 8, 10, 14, 12, 11]
    for (let row = 0; row < 4; row++) {
        for (let x = -4; x < 168; x += 9) {
            const hx = x + Math.randomRange(0, 4)
            const hy = 26 + row * 11 + Math.randomRange(0, 3)
            const c = cc[Math.randomRange(0, cc.length - 1)]
            b.fillCircle(hx, hy, 3, c)
            b.fillRect(hx - 3, hy + 3, 7, 9, c)
        }
    }
    for (let i = 0; i < 3; i++) {
        b.fillCircle(30 + i * 50, 21, 2, 5)
        b.drawLine(30 + i * 50, 22, 12 + i * 50, 70, 12)
        b.drawLine(30 + i * 50, 22, 48 + i * 50, 70, 12)
    }
    return b
}

// the ring: floor, ropes and posts, drawn once into a wide image and scrolled
function makeArena(): Image {
    const a = image.create(240, 120)
    const ft = Math.round(FLOOR + (236 - FY) * S)
    const fb = Math.round(FLOOR + (340 - FY) * S)
    a.fillRect(0, ft, 240, fb - ft, 12)
    for (let i = -10; i <= 20; i++) a.drawLine(Math.round((400 + i * 40) * S), ft, Math.round((400 + i * 60) * S), fb, 11)
    a.fillRect(0, fb, 240, 20, 15)
    a.fillRect(0, fb + 1, 240, 1, 2)
    const top = Math.round(FLOOR + (92 - FY) * S)
    const bottom = Math.round(FLOOR + (324 - FY) * S)
    a.fillRect(5, top, 3, bottom - top, 11)
    a.fillRect(232, top, 3, bottom - top, 11)
    const ry = [118, 160, 202]
    const rc = [2, 1, 2]
    for (let j = 0; j < 3; j++) {
        const y = Math.round(FLOOR + (ry[j] - FY) * S)
        a.drawLine(6, y, 234, y, rc[j])
        a.drawLine(6, y + 1, 234, y + 1, rc[j])
        a.fillRect(4, y - 1, 5, 4, 2)
        a.fillRect(231, y - 1, 5, 4, 2)
    }
    return a
}

function initMap() {
    scene.setBackgroundImage(makeBg())
    arenaImg = makeArena()
}

function updateCamera(midX: number) {
    const tg = Math.max(0, Math.min(800 - 160 / S, midX - 80 / S))
    camX += (tg - camX) * 0.12
}

function beginFrame() {
    shx = 0
    shy = 0
    if (shk > 0) { shx = Math.randomRange(-1, 1); shy = Math.randomRange(-1, 1) }
}

function drawArena(t: Image) {
    t.drawTransparentImage(arenaImg, Math.round(-camX * S) + shx, shy)
}

function drawHud(t: Image) {
    t.fillRect(0, 0, 160, 19, 15)
    t.fillRect(1, 1, 62, 7, 12)
    t.fillRect(2, 2, Math.round(60 * P.hp / 100), 5, P.hp < 30 ? 2 : 7)
    t.fillRect(1, 9, 62, 5, 12)
    t.fillRect(2, 10, Math.round(60 * P.sta / 100), 3, P.sta < 20 ? 2 : 5)
    const aw = Math.round(60 * A.hp / 100)
    const sw = Math.round(60 * A.sta / 100)
    t.fillRect(97, 1, 62, 7, 12)
    t.fillRect(158 - aw, 2, aw, 5, A.hp < 30 ? 2 : 7)
    t.fillRect(97, 9, 62, 5, 12)
    t.fillRect(158 - sw, 10, sw, 3, A.sta < 20 ? 2 : 5)
    t.print("YOU", 2, 14, 1, image.font5)
    t.print("CPU", 144, 14, 1, image.font5)
    const s = Math.max(0, Math.ceil(frames / 60))
    t.printCenter(Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60), 2, 1, image.font8)
    t.printCenter("R" + roundNo + "  " + w2[0] + "-" + w2[1], 12, 5, image.font5)
}

function drawTip(t: Image) {
    if (tipT <= 0 || tipTxt.length == 0) return
    const words = tipTxt.split(" ")
    let l1 = ""
    let l2 = ""
    for (let i = 0; i < words.length; i++) {
        if (l2.length == 0 && (l1.length + words[i].length + 1) <= 26) l1 += (l1.length > 0 ? " " : "") + words[i]
        else l2 += (l2.length > 0 ? " " : "") + words[i]
    }
    t.print(l1, 2, 108, 1, image.font5)
    if (l2.length > 0) t.print(l2, 2, 114, 1, image.font5)
}

function drawFx(t: Image) {
    for (let i = 0; i < fxs.length; i++) {
        const f = fxs[i]
        const x = sxw(f.x)
        const y = syw(f.y - FY)
        if (f.k == 0) {
            const px = x - f.s.length * 3
            t.print(f.s, px + 1, y - Math.round(f.y2) + 1, 15, image.font5)
            t.print(f.s, px, y - Math.round(f.y2), f.c, image.font5)
        } else if (f.k == 1) {
            const r = 2 + (10 - f.t)
            for (let a = 0; a < 8; a++) {
                const an = a * 0.785
                t.drawLine(x + Math.round(Math.cos(an) * r), y + Math.round(Math.sin(an) * r), x + Math.round(Math.cos(an) * (r + 3)), y + Math.round(Math.sin(an) * (r + 3)), f.c)
            }
        } else {
            const r = 2 + Math.round((18 - f.t) * 0.4)
            t.fillCircle(x - 3, y - 1, r, f.c)
            t.fillCircle(x + 3, y - 1, r, f.c)
        }
    }
}

// everything drawn each frame, in order
function renderScene(t: Image) {
    beginFrame()
    drawArena(t)
    drawFighter(t, A, 6, 14, 12)
    drawFighter(t, P, 2, 13, 11)
    if (state != ST_TITLE) {
        const mx = sxw(P.x)
        const my = syw(-190)
        t.fillRect(mx - 2, my, 5, 1, 2)
        t.fillRect(mx - 1, my + 1, 3, 1, 2)
        t.setPixel(mx, my + 2, 2)
    }
    drawFx(t)
    drawHud(t)
    drawTip(t)
    if (state == ST_INTRO) {
        t.printCenter(introT > 40 ? "ROUND " + roundNo : "FIGHT!", 40, 1, image.font8)
        t.printCenter("TIP: " + TIPS[(roundNo * 2 + w2[0] + w2[1]) % TIPS.length][3], 54, 5, image.font5)
    }
    if (state == ST_KO) t.printCenter("K.O.!", 40, 2, image.font8)
}
// CHARACTER: the boxer data, punch table and how a boxer is drawn.

// punches: [startup frames, active frames, recovery frames, damage, stamina cost, reach]
const PN: number[][] = [[6, 3, 8, 4, 5, 92], [22, 4, 14, 10, 12, 104], [32, 4, 20, 15, 18, 88]]
// index 0 = jab, 1 = cross, 2 = hook

class Fighter {
    x = 0
    dir = 1
    ai = false
    hp = 100
    sta = 100
    p = -1           // punch being thrown (-1 none)
    t = 0            // frames into that punch
    stun = 0
    blk = false
    inv = 0          // dodge frames left
    vx = 0
    fl = 0           // hit flash
    hit = false
    exp = 0          // opened up after a perfect dodge
    grace = 0
    ds = 0           // frames since the dodge started
    dgk = 0          // 1 duck, 2 dash in, 3 dash away
    wk = 0
    mvw = 0
    pg = 0
    th = 0
    mvx = 0
    pk = -1
    q = -1
    rt = 0
    bt = 0
    ro = 5
    constructor(x: number, dir: number, ai: boolean) {
        this.x = x
        this.dir = dir
        this.ai = ai
    }
}

class Pose {
    lean = 0
    tw = 0
    cr = 2
    lx = 30
    ly = -100
    rx = 16
    ry = -96
    hx = 0
    hy = 0
    exx = 0
    exy = 0
    step = 0
    lb = 1
    rb = 1
}

function ez(t: number): number { return t * t * (3 - 2 * t) }

// scratch values used while drawing one boxer
let gBx = 0
let gD = 1
let gCl = 1
let gSl = 0
let gHy0 = 0
function RX(px: number, py: number): number { return sxw(gBx + gD * (px * gCl - (py - gHy0) * gSl)) }
function RY(px: number, py: number): number { return syw(gHy0 + px * gSl + (py - gHy0) * gCl) }
function LX(lx: number): number { return sxw(gBx + gD * lx) }

// thick line made of several thin lines
function tl(t: Image, x1: number, y1: number, x2: number, y2: number, c: number, w: number) {
    const h = Math.floor(w / 2)
    if (Math.abs(x2 - x1) >= Math.abs(y2 - y1)) {
        for (let o = -h; o < w - h; o++) t.drawLine(x1, y1 + o, x2, y2 + o, c)
    } else {
        for (let o = -h; o < w - h; o++) t.drawLine(x1 + o, y1, x2 + o, y2, c)
    }
}

// body position for the current move (idle, block, punch, wind-up, stun, dodge)
function calcPose(f: Fighter, ext: number, ph: number): Pose {
    const o = new Pose()
    const now = control.millis()
    const bob = Math.sin(now / (f.sta < 25 ? 100 : 175) + f.x * 0.05)
    o.cr = Math.abs(bob) * 2 + 2
    o.ly = -100 + bob * 2
    o.ry = -96 - bob * 2
    const e0 = Math.max(0, ext)
    if (f.blk) {
        o.lean = 0.1; o.cr = 10; o.lx = 24; o.ly = -122; o.rx = 16; o.ry = -126
    } else if (f.p >= 0) {
        const k = PN[f.p]
        const L = k[5] * 0.88
        if (f.p == 0) {
            o.lx = 30 + L * ext; o.ly = -110; o.lean = 0.06 * ext; o.tw = 5 * ext
            o.rx = 18; o.ry = -118; o.step = 6 * ext; o.lb = 1 - e0 * 0.85
        } else if (f.p == 1) {
            o.rx = 18 + L * ext; o.ry = -110; o.tw = 14 * ext; o.lean = 0.14 * ext
            o.lx = 22; o.ly = -118; o.step = 10 * ext; o.rb = 1 - e0 * 0.85
        } else {
            o.lx = 30 + L * 0.8 * ext; o.ly = -114 - Math.sin(e0 * 3.14) * 6; o.tw = 12 * ext
            o.lean = 0.1 * ext; o.rx = 18; o.ry = -118; o.step = 8 * ext
            o.exx = (o.lx + 4) * 0.5 + 2; o.exy = -128 - e0 * 6
        }
        if (ph == 0 && f.p > 0) {
            const w = ez(f.t / k[0])
            const tr = Math.sin(now / 35) * 1.6 * w
            if (f.p == 2) {
                o.lx = 30 - 34 * w; o.ly = -112 - 14 * w + tr; o.exx = 10 - 14 * w; o.exy = -124 - 8 * w
                o.lean = -0.18 * w; o.tw = -12 * w; o.cr += 4 * w; o.step = -4 * w
            } else {
                o.rx = 18 - 26 * w; o.ry = -104 + tr; o.tw = -10 * w; o.lean = -0.12 * w
                o.rb = 1; o.step = -3 * w
            }
        }
    } else if (f.stun > 0) {
        const q = Math.min(1, f.stun / 16)
        o.lean = -0.22 * q; o.hx = -8 * q; o.ly = -84; o.ry = -84; o.cr = 6
    } else if (f.inv > 0) {
        if (f.dgk == 1) { o.cr = 26; o.lean = 0.3; o.hy = 6; o.lx = 24; o.ly = -88; o.rx = 14; o.ry = -92 }
        else if (f.dgk == 2) { o.lean = 0.36; o.cr = 10; o.lx = 36; o.ly = -100; o.rx = 8; o.ry = -96; o.step = 6 }
        else { o.lean = -0.26; o.cr = 8; o.hx = -8 }
    }
    return o
}

function drawArm(t: Image, o: Pose, gx: number, gy: number, bend: number, useEx: boolean, c: number, col: number) {
    const sx0 = 2 + o.tw
    const sy0 = -108 + o.cr
    let mx = (sx0 + gx) / 2 - 3
    let my = (sy0 + gy) / 2 + 12 * bend
    if (useEx) { mx = o.exx; my = o.exy }
    const a1 = RX(sx0, sy0)
    const b1 = RY(sx0, sy0)
    const a2 = RX(mx, my)
    const b2 = RY(mx, my)
    const a3 = RX(gx, gy)
    const b3 = RY(gx, gy)
    tl(t, a1, b1, a2, b2, c, 2)
    tl(t, a2, b2, a3, b3, c, 2)
    t.fillCircle(a3, b3, 3, col)
    t.setPixel(a3 + gD, b3 - 2, 1)
}

function drawKO(t: Image, f: Fighter, col: number, skin: number) {
    const d = f.dir
    const bx = sxw(f.x)
    const by = syw(-6)
    tl(t, bx, by, bx - d * 16, by, skin, 5)
    tl(t, bx - d * 4, by + 2, bx - d * 12, by + 2, col, 4)
    t.fillCircle(bx - d * 19, by, 4, skin)
    t.fillCircle(bx - d * 20, by - 1, 4, col)
    t.print("X", bx - d * 17, by - 3, 1, image.font5)
}

function drawFighter(t: Image, f: Fighter, col: number, skin0: number, dark0: number) {
    const d = f.dir
    if (f.hp <= 0) { drawKO(t, f, col, skin0); return }
    let ext = 0
    let ph = 0
    if (f.p >= 0) {
        const k = PN[f.p]
        if (f.t < k[0]) ext = -0.18 * ez(f.t / k[0])
        else if (f.t < k[0] + k[1]) ext = -0.18 + 1.18 * Math.min(1, (f.t - k[0] + 1) / k[1])
        else ext = Math.max(0, 1 - (f.t - k[0] - k[1]) / k[2])
        ph = f.t < k[0] ? 0 : (f.t < k[0] + k[1] ? 1 : 2)
    }
    const o = calcPose(f, ext, ph)
    const e0 = Math.max(0, ext)
    const flash = f.fl > 0 && f.fl % 4 < 2
    const skin = flash ? 1 : skin0
    const dk = flash ? 1 : dark0
    gD = d
    gBx = f.x + d * o.step
    gCl = Math.cos(o.lean)
    gSl = Math.sin(o.lean)
    gHy0 = -48 + o.cr * 0.5
    const wl = f.mvw > 0 ? Math.sin(f.wk) * 9 : 0
    t.fillRect(sxw(f.x) - 6, FLOOR, 12, 2, 15)
    // legs
    const hipX = LX(0)
    const hipY = syw(gHy0)
    const f1x = LX(-16 - wl + (f.p == 1 ? 6 * e0 : 0))
    const f1y = syw(-Math.max(0, -wl) * 0.5)
    const f2x = LX(18 + wl)
    const f2y = syw(-Math.max(0, wl) * 0.5)
    tl(t, hipX, hipY, f1x, f1y, dk, 3)
    tl(t, hipX, hipY, f2x, f2y, skin, 3)
    t.fillRect(Math.min(f1x, f1x + d * 4), f1y - 1, 5, 2, 15)
    t.fillRect(Math.min(f2x, f2x + d * 4), f2y - 1, 5, 2, 15)
    // rear arm, torso, shorts
    drawArm(t, o, o.rx, o.ry, o.rb, false, dk, col)
    const ty = -118 + o.cr
    const tx = o.tw * 0.3
    tl(t, RX(0, gHy0 - 4), RY(0, gHy0 - 4), RX(tx, ty + 14), RY(tx, ty + 14), skin, 9)
    tl(t, RX(-6 + tx, ty + 8), RY(-6 + tx, ty + 8), RX(7 + tx, ty + 8), RY(7 + tx, ty + 8), skin, 3)
    t.drawLine(RX(-3, ty + 34), RY(-3, ty + 34), RX(4, ty + 34), RY(4, ty + 34), dk)
    t.drawLine(RX(-3, ty + 44), RY(-3, ty + 44), RX(4, ty + 44), RY(4, ty + 44), dk)
    tl(t, RX(0, gHy0 - 8), RY(0, gHy0 - 8), RX(0, gHy0 + 16), RY(0, gHy0 + 16), col, 11)
    t.drawLine(RX(-6, gHy0 - 8), RY(-6, gHy0 - 8), RX(6, gHy0 - 8), RY(6, gHy0 - 8), 1)
    // head
    const hxL = 3 + o.hx + o.tw * 0.5
    const hyL = -134 + o.cr + o.hy
    const hx = RX(hxL, hyL)
    const hy = RY(hxL, hyL)
    t.fillCircle(hx, hy, 5, skin)
    t.fillCircle(hx - d, hy - 1, 5, col)
    t.fillCircle(hx + d * 2, hy + 1, 3, skin)
    t.fillCircle(hx - d, hy + 1, 2, col)
    if (f.stun > 0) {
        t.setPixel(hx + d * 2, hy - 1, 15)
        t.setPixel(hx + d * 4, hy - 1, 15)
        t.setPixel(hx + d * 3, hy, 15)
    } else {
        t.setPixel(hx + d * 3, hy, 15)
        t.setPixel(hx + d * 4, hy + 3, 1)
    }
    if (f.sta < 25) t.setPixel(hx - d * 5, hy - 7 + Math.floor(control.millis() / 60) % 8, 9)
    // lead arm
    drawArm(t, o, o.lx, o.ly, o.lb, f.p == 2, skin, col)
    // wind-up ring, punch swoosh, dodge lines
    let gx = RX(o.lx, o.ly)
    let gy = RY(o.lx, o.ly)
    if (f.p == 1) { gx = RX(o.rx, o.ry); gy = RY(o.rx, o.ry) }
    if (f.p > 0 && ph == 0 && f.t > PN[f.p][0] * 0.4) t.drawCircle(gx, gy, 4 + Math.round(4 * f.t / PN[f.p][0]), 5)
    if (f.p >= 0 && ph == 1) t.drawLine(gx - d * 12, gy, gx - d * 3, gy, 1)
    if (f.inv > 0 && f.dgk != 1 && Math.abs(f.vx) > 1.5) {
        const sg = f.vx > 0 ? 1 : -1
        for (let i = 0; i < 3; i++) {
            const yy = syw(-(60 + i * 32))
            t.drawLine(sxw(f.x - sg * 18), yy, sxw(f.x - sg * (46 + i * 10)), yy, 1)
        }
    }
    if (f.pg > 0) t.drawCircle(sxw(f.x), syw(-80), 17, f.pg % 4 < 2 ? 5 : 1)
    if (f.exp > 0) {
        for (let q = 0; q < 3; q++) {
            const an = control.millis() / 160 + q * 2.1
            t.fillCircle(sxw(f.x + Math.cos(an) * 18), syw(-172 + Math.sin(an) * 5), 1, 5)
        }
    }
    if (f.p > 0 && f.t < PN[f.p][0]) {
        t.print("!", sxw(f.x) - 1, syw(-178) + 1, 15, image.font8)
        t.print("!", sxw(f.x) - 2, syw(-178), 5, image.font8)
    }
}
// MECHANIC: input, combat rules, the AI opponent, round flow and the game loop.
const ST_TITLE = 0
const ST_INTRO = 1
const ST_FIGHT = 2
const ST_KO = 3
const ST_DIALOG = 4

let P = new Fighter(220, 1, false)
let A = new Fighter(580, -1, true)
let stats: number[] = [0, 0, 0, 0, 0, 0, 0]    // this round
let totals: number[] = [0, 0, 0, 0, 0, 0, 0]   // whole bout
let w2: number[] = [0, 0]                      // rounds won
let fxs: Fx[] = []
let state = ST_TITLE
let roundNo = 1
let frames = 0
let introT = 0
let koT = 0
let tc = 0
let lastJab = 0
let slow = 0
let hitStop = 0
let difficulty = 0.4      // 0.2 easy, 0.4 normal, 0.6 hard
let tipT = 0
let tipTxt = ""
let seenHeavy = false
let seenTired = false
let lastPunch = -1
let repeatN = 0
let pq = -1
let pqT = 0
let dq = 0
let dqT = 0
let pend = -1
let pendT = 0
let lastMs = 0
let acc = 0

class Inp {
    l = false
    r = false
    b = false
    p = -1
    dg = 0
}

function tip(m: string) { if (tipT <= 0) { tipTxt = m; tipT = 150 } }

function sfx(shape: WaveShape, f1: number, f2: number, ms: number, vol: number) {
    music.play(music.createSoundEffect(shape, f1, f2, vol, 0, ms, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
}

function addFx(x: number, y: number, t: number, s: string, c: number, k: number) {
    const f = new Fx()
    f.x = x; f.y = y; f.t = t; f.s = s; f.c = c; f.k = k
    fxs.push(f)
}

// ---------- combat ----------
function dodgeFx(a: Fighter, b: Fighter) {
    if (b.ds <= 10) {   // perfect dodge: attacker is stunned and open
        const pl = !a.ai
        a.p = -1; a.t = 0; a.hit = false
        a.stun = pl ? 22 : 30
        a.exp = pl ? 40 : 50
        b.sta = Math.min(100, b.sta + 12)
        b.pg = 30
        slow = 45
        sfx(WaveShape.Sine, 900, 500, 250, 180)
        addFx(b.x, FY - 150, 60, "PERFECT!", 5, 0)
        if (!b.ai) { stats[PD]++; tip(M_PERFECT) } else tip(M_PERFECTED)
    } else {
        addFx(b.x, FY - 140, 34, "DODGED", 6, 0)
        if (!b.ai) tip(M_EARLY)
    }
}

function strike(a: Fighter, b: Fighter) {
    const k = PN[a.p]
    const dist = Math.abs(a.x - b.x)
    if (b.grace > 0 && dist <= k[5]) return
    if (b.inv > 0 && dist <= k[5] + 45) { a.hit = true; dodgeFx(a, b); return }
    if (dist > k[5] || b.inv > 0) return
    a.hit = true
    const ex = b.exp > 0
    const bl = b.blk && b.p < 0 && b.stun == 0 && !ex
    let dmg = k[3] * (a.sta < 20 ? 0.5 : 1)
    if (a.ai) dmg = dmg * (0.55 + difficulty * 1.25)
    if (ex) {
        dmg *= 1.6
        if (!a.ai) { stats[CN]++; tip(M_COUNTER) }
    }
    if (bl) {
        dmg *= 0.15
        b.sta = Math.max(0, b.sta - k[3] * 0.8 - 4)
        b.vx = a.dir * 2
        sfx(WaveShape.Square, 220, 90, 70, 110)
        if (!a.ai) { stats[BK]++; tip(M_BLOCKED) } else tip(M_GOOD_BLOCK)
    } else {
        const rec = b.p >= 0 && b.t >= PN[b.p][0] + PN[b.p][1]
        if (!a.ai && b.p > 0 && b.t < PN[b.p][0]) tip(M_INTERRUPT)
        b.stun = Math.max(b.stun, a.p == 0 ? 10 : 16)
        b.p = -1; b.t = 0; b.hit = false
        b.vx = a.dir * (3 + k[3] / 3)
        b.fl = 8
        hitStop = (a.p == 0 ? 3 : (a.p == 2 ? 7 : 5)) + (ex ? 3 : 0)
        shk = a.p == 2 ? 6 : 3
        sfx(WaveShape.Sawtooth, a.p == 2 ? 140 : 200, 60, 140, 255)
        if (b.ai && Math.random() < 0.4) b.rt = 45
        if (!a.ai) stats[LD]++
        else { stats[GH]++; tip(rec ? M_HIT_RECOVER : M_HIT_GUARD) }
    }
    b.hp = Math.max(0, b.hp - dmg)
    addFx(b.x, FY - 150, 36, bl ? "BLOCK" : (ex ? "COUNTER " : "-") + Math.round(dmg), bl ? 6 : 5, 0)
    addFx(b.x + (a.x < b.x ? -16 : 16), FY - 125, 10, "", bl ? 6 : 1, 1)
}

function upd(f: Fighter, o: Fighter, i: Inp) {
    if (f.fl > 0) f.fl--
    if (f.mvw > 0) f.mvw--
    if (f.inv > 0) f.inv--
    if (f.grace > 0) f.grace--
    if (f.exp > 0) f.exp--
    if (f.pg > 0) f.pg--
    if (f.inv > 0) f.ds++
    f.x = Math.max(50, Math.min(750, f.x + f.vx))
    f.vx *= 0.85
    if (Math.abs(f.vx) < 0.1) f.vx = 0
    if (f.dir > 0 && f.x > o.x - 34) f.x = o.x - 34
    else if (f.dir < 0 && f.x < o.x + 34) f.x = o.x + 34
    if (f.stun > 0) { f.stun--; f.blk = false; if (f.stun == 0) f.grace = 8; return }
    if (f.p >= 0) {
        f.t++
        const k = PN[f.p]
        if (f.t >= k[0] && f.t < k[0] + k[1] && !f.hit) strike(f, o)
        if (f.t >= k[0] + k[1] + k[2]) { f.p = -1; f.t = 0; f.hit = false }
        return
    }
    f.blk = i.b && f.sta > 1 && !(f.exp > 0)
    if (i.dg > 0) {   // dodge: 1 duck, 2 dash in, 3 dash away
        let c = 8
        if (i.dg == 1) c = 5
        else if (i.dg == 2) c = 10
        if (f.sta >= c && !f.blk) {
            f.sta -= c
            f.inv = i.dg == 1 ? 20 : 16
            f.dgk = i.dg
            f.ds = 0
            f.vx = 0
            if (i.dg == 2) f.vx = f.dir * 9
            else if (i.dg == 3) f.vx = -f.dir * 9
            addFx(f.x, FY, 18, "", 13, 2)
            sfx(WaveShape.Triangle, 300, 200, 100, 90)
            if (!f.ai) dq = 0
            return
        }
    }
    if (i.p >= 0 && !f.blk) {
        const k = PN[i.p]
        if (f.sta >= k[4]) {
            if (!f.ai) {
                stats[TH]++
                pq = -1
                if (i.p == 0) lastJab = tc
                else if (i.p == 1 && lastJab > 0 && tc - lastJab < 40) tip(M_COMBO)
                if (i.p == lastPunch) repeatN++
                else { lastPunch = i.p; repeatN = 1 }
                if (repeatN >= 4) tip(M_MIX)
                if (f.sta < 20) { stats[LO]++; tip(M_EXHAUSTED) }
            }
            f.p = i.p; f.t = 0; f.hit = false
            f.sta -= k[4]
            sfx(WaveShape.Triangle, 420, 250, 70, 70)
            return
        } else if (!f.ai) { tip(M_TOO_TIRED); pq = -1 }
    }
    const mv = (i.r ? 1 : 0) - (i.l ? 1 : 0)
    if (mv != 0 && !f.blk && !(f.dgk == 1 && f.inv > 0)) {
        f.wk += 0.28
        f.mvw = 6
        const nx = f.x + mv * (mv == f.dir ? 2.8 : 2.2)
        if (Math.abs(nx - o.x) > 48) f.x = nx
    }
    f.sta = Math.min(100, f.sta + (f.blk ? 0.06 : (mv != 0 ? 0.12 : 0.24)))
}

// ---------- AI opponent ----------
function aiIn(): Inp {
    const i = new Inp()
    const d = Math.abs(A.x - P.x)
    const ag = 0.12 + difficulty * 0.75
    if (A.rt > 0) A.rt--
    if (A.bt > 0) { A.bt--; i.b = true }
    if (P.p >= 0 && P.t == 1 && A.p < 0) A.ro = 3 + Math.randomRange(0, 11)
    if (P.p >= 0 && P.t == Math.max(1, PN[P.p][0] - A.ro) && d < 125 && A.p < 0 && Math.random() < difficulty * 1.2) {
        if (Math.random() < 0.75) { A.bt = 24; i.b = true }
        else i.dg = Math.random() < 0.5 ? 1 : 3
    }
    if (A.p >= 0 || A.stun > 0) return i
    A.th--
    if (A.th <= 0) {
        A.th = 10 + Math.randomRange(0, 15)
        A.mvx = 0
        A.pk = -1
        const pun = P.p >= 0 && P.t >= PN[P.p][0] + PN[P.p][1]
        if (A.q >= 0) { A.pk = A.q; A.q = -1; A.th = 5 }
        else if (A.sta < 22 || A.rt > 0) {
            A.mvx = d < 140 ? 1 : 0
            if (A.sta < 22 && Math.random() < 0.5) A.bt = 20
        } else if (d > 100) A.mvx = -1
        else if (pun || Math.random() < ag) {
            const q = Math.random()
            let pk = 0
            if (q >= 0.5 && q < 0.78) pk = 1
            else if (q >= 0.78 && A.sta > 40) pk = 2
            if (d > PN[pk][5] + 10) pk = 0
            A.pk = pk
            if (pk == 0 && Math.random() < 0.5) A.q = 1
        } else A.mvx = Math.random() < 0.55 ? 1 : (Math.random() < 0.5 ? -1 : 0)
    }
    i.l = A.mvx < 0
    i.r = A.mvx > 0
    i.p = A.pk
    A.pk = -1
    return i
}

// ---------- player input ----------
function pin(): Inp {
    if (pendT > 0) { pendT--; if (pendT == 0 && pend >= 0) { pq = pend; pqT = 8; pend = -1 } }
    if (pqT > 0) pqT--
    else pq = -1
    if (dqT > 0) dqT--
    else dq = 0
    const i = new Inp()
    i.l = controller.left.isPressed()
    i.r = controller.right.isPressed()
    i.b = controller.down.isPressed()
    i.p = pq
    i.dg = dq
    return i
}

function initInput() {
    // A = jab, B = cross, A+B together = hook (3 frame window)
    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        if (state != ST_FIGHT) return
        if (pendT > 0 && pend == 1) { pq = 2; pqT = 8; pend = -1; pendT = 0 }
        else { pend = 0; pendT = 3 }
    })
    controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
        if (state != ST_FIGHT) return
        if (pendT > 0 && pend == 0) { pq = 2; pqT = 8; pend = -1; pendT = 0 }
        else { pend = 1; pendT = 3 }
    })
    // Up = dodge: Right held = dash in, Left held = dash away, otherwise duck
    controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
        if (state != ST_FIGHT) return
        dq = controller.right.isPressed() ? 2 : (controller.left.isPressed() ? 3 : 1)
        dqT = 8
    })
}

// ---------- rounds ----------
function setup(first: boolean) {
    if (first) {
        P = new Fighter(220, 1, false)
        A = new Fighter(580, -1, true)
        w2 = [0, 0]
        totals = [0, 0, 0, 0, 0, 0, 0]
        roundNo = 1
    } else {
        const h0 = P.hp
        const h1 = A.hp
        P = new Fighter(220, 1, false)
        A = new Fighter(580, -1, true)
        P.hp = Math.min(100, h0 + 15)
        A.hp = Math.min(100, h1 + 15)
    }
    stats = [0, 0, 0, 0, 0, 0, 0]
    frames = 2400
    fxs = []
    state = ST_INTRO
    introT = 100
    tipT = 0
    tipTxt = ""
    seenHeavy = false
    seenTired = false
    pq = -1; dq = 0; pend = -1; pendT = 0; slow = 0; hitStop = 0
    lastMs = control.millis()
    acc = 0
    sfx(WaveShape.Sine, 1000, 900, 600, 160)
}

function showTips() {
    for (let p = 0; p < 3; p++) game.showLongText(tipsPage(p), DialogLayout.Full)
}

function chooseDifficulty() {
    if (game.ask("Easy mode?", "A=yes B=no")) difficulty = 0.2
    else if (game.ask("Hard mode?", "A=yes B=no")) difficulty = 0.6
    else difficulty = 0.4
}

function endRound() {
    for (let i = 0; i < 7; i++) totals[i] += stats[i]
    if (P.hp > A.hp) w2[0]++
    else if (A.hp > P.hp) w2[1]++
    const ko = P.hp <= 0 || A.hp <= 0
    const over = ko || roundNo >= 3
    let win = false
    if (ko) win = A.hp <= 0
    else win = w2[0] > w2[1] || (w2[0] == w2[1] && P.hp >= A.hp)
    const txt = summaryText(over ? totals : stats, roundNo, over, win, ko)
    state = ST_DIALOG
    control.runInParallel(function () {
        game.showLongText(txt, DialogLayout.Full)
        if (game.ask("Boxing tips?", "A=yes B=no")) showTips()
        if (over) { chooseDifficulty(); setup(true) }
        else { roundNo++; setup(false) }
    })
}

// ---------- one game tick (runs at 60 per second) ----------
function tick() {
    if (tipT > 0) tipT--
    if (shk > 0) shk--
    for (let i = 0; i < fxs.length; i++) { fxs[i].t--; fxs[i].y2 += 0.8 }
    fxs = fxs.filter(function (f: Fx) { return f.t > 0 })
    if (state == ST_TITLE || state == ST_DIALOG) return
    updateCamera((P.x + A.x) / 2)
    if (state == ST_INTRO) { introT--; if (introT <= 0) state = ST_FIGHT; return }
    if (state == ST_KO) { koT--; if (koT <= 0) endRound(); return }
    if (slow > 0) { slow--; if (slow % 3 != 0) return }
    if (hitStop > 0) { hitStop--; return }
    tc++
    frames--
    upd(P, A, pin())
    upd(A, P, aiIn())
    if (P.sta < 15 && !P.blk) tip(M_STAMINA_LOW)
    if (!seenHeavy && tipT <= 0 && A.p > 0 && A.t == 1) { seenHeavy = true; tip(M_HEAVY) }
    if (A.sta < 25 && !seenTired && tipT <= 0) { seenTired = true; tip(M_FOE_TIRED) }
    else if (A.sta > 45) seenTired = false
    if (P.hp <= 0 || A.hp <= 0) { state = ST_KO; koT = 75; sfx(WaveShape.Sawtooth, 90, 40, 500, 255) }
    else if (frames <= 0) endRound()
}

// fixed time step: the game speed stays the same on slow or fast screens
function frame() {
    const now = control.millis()
    let dt = now - lastMs
    lastMs = now
    if (dt > 100) dt = 100
    acc += dt
    let n = 0
    while (acc >= 16.7 && n < 3) { tick(); acc -= 16.7; n++ }
    if (acc > 33) acc = 0
}
// MAIN: starts the game. All the work is done in the other files.
//   text.ts       tips, coach messages, dialog text
//   map.ts        arena, camera, HUD, effects
//   character.ts  boxer data and drawing
//   mechanic.ts   input, combat, AI, rounds, game loop
// The start-up code runs in a parallel fiber so every file has finished loading first,
// whatever order MakeCode lists the files in.
function startGame() {
    initMap()
    initInput()
    scene.createRenderable(1, function (target: Image, camera: scene.Camera) {
        renderScene(target)
    })
    game.onUpdate(frame)
    game.showLongText(TITLE_TEXT, DialogLayout.Full)
    game.showLongText(CONTROLS_TEXT, DialogLayout.Full)
    if (game.ask("Boxing tips first?", "A=yes B=no")) showTips()
    chooseDifficulty()
    setup(true)
}
control.runInParallel(startGame)
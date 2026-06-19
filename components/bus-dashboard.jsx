"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"
import {
  TrendingUp,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Ticket,
  Megaphone,
  Package,
  Gauge,
  Users,
  MapPin,
  Clock,
  ArrowUpRight,
  Bus,
  Fuel,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const revenueStreams = {
  ticket: [4200, 5100, 4800, 6300, 7100, 6500, 8200],
  ads: [800, 900, 750, 1100, 950, 1200, 1050],
  parcel: [300, 450, 280, 600, 520, 480, 710],
}

const routePoints = [
  { x: 40, y: 280 },
  { x: 90, y: 220 },
  { x: 150, y: 190 },
  { x: 210, y: 160 },
  { x: 280, y: 130 },
  { x: 330, y: 100 },
]

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const chartData = DAYS.map((day, i) => ({
  day,
  ticket: revenueStreams.ticket[i],
  ads: revenueStreams.ads[i],
  parcel: revenueStreams.parcel[i],
}))

const ACCENT = "#E9B872"
const ACCENT_2 = "#7C8CA3"
const ACCENT_3 = "#5C6B5A"

const stops = ["Central Depot", "Marina Rd", "Old Town", "Hill Gate", "Tech Park", "North Terminal"]

const fleet = [
  { id: "BX-104", route: "City Line", status: "Active", driver: "M. Okeke", load: 82 },
  { id: "BX-118", route: "Coastal Express", status: "Active", driver: "A. Reyes", load: 64 },
  { id: "BX-092", route: "Night Owl", status: "Idle", driver: "K. Devi", load: 0 },
  { id: "BX-076", route: "Airport Shuttle", status: "Active", driver: "J. Mwangi", load: 47 },
]

const tripsByBus = {
  "BX-104": [
    { id: "t1", time: "06:30", from: "Central Depot", to: "North Terminal", pax: 41, rev: 1820 },
    { id: "t2", time: "09:15", from: "North Terminal", to: "Central Depot", pax: 38, rev: 1640 },
    { id: "t3", time: "14:30", from: "Central Depot", to: "Tech Park", pax: 52, rev: 2410 },
  ],
  "BX-118": [
    { id: "t1", time: "07:00", from: "Marina Rd", to: "Hill Gate", pax: 33, rev: 1510 },
    { id: "t2", time: "12:45", from: "Hill Gate", to: "Marina Rd", pax: 29, rev: 1280 },
  ],
  "BX-092": [{ id: "t1", time: "22:10", from: "Old Town", to: "Central Depot", pax: 18, rev: 760 }],
  "BX-076": [
    { id: "t1", time: "05:50", from: "Central Depot", to: "Airport", pax: 24, rev: 2040 },
    { id: "t2", time: "08:20", from: "Airport", to: "Central Depot", pax: 31, rev: 2630 },
  ],
}

const TABS = [
  { label: "Earnings", icon: TrendingUp },
  { label: "Live Fleet", icon: Radio },
  { label: "Management", icon: SlidersHorizontal },
]

const BUS_ANGLE = [35, 0, -35]

/* ------------------------------------------------------------------ */
/*  3D bus model (the living background)                              */
/*  Built from real faces in 3D space so rotation reveals the side.   */
/* ------------------------------------------------------------------ */

const BUS_W = 210 // front width
const BUS_H = 380 // height
const BUS_D = 300 // length (depth)

/* Front of the bus (the cab / windshield end) */
function FrontFace() {
  return (
    <svg viewBox="0 0 210 380" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="fBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2c2c" />
          <stop offset="0.5" stopColor="#1a1a1a" />
          <stop offset="1" stopColor="#0c0c0c" />
        </linearGradient>
        <linearGradient id="fGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#223040" />
          <stop offset="1" stopColor="#0d1218" />
        </linearGradient>
        <radialGradient id="fLamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={ACCENT} stopOpacity="0.95" />
          <stop offset="0.6" stopColor={ACCENT} stopOpacity="0.35" />
          <stop offset="1" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="2" y="6" width="206" height="368" rx="42" fill="#000" />
      <rect x="6" y="10" width="198" height="360" rx="38" fill="url(#fBody)" />

      {/* roof destination sign */}
      <rect x="48" y="26" width="114" height="22" rx="11" fill="#0b0b0b" stroke={ACCENT} strokeWidth="1" strokeOpacity="0.5" />
      <text x="105" y="41" textAnchor="middle" fontSize="11" fill={ACCENT} fontFamily="var(--font-kanit)" letterSpacing="1.5">CITY LINE</text>

      {/* windshield */}
      <rect x="28" y="62" width="154" height="96" rx="24" fill="url(#fGlass)" stroke="#2b3640" strokeWidth="1.5" />
      <rect x="38" y="72" width="58" height="76" rx="16" fill="#0e151c" opacity="0.7" />
      <rect x="116" y="72" width="58" height="76" rx="16" fill="#0e151c" opacity="0.7" />
      <line x1="56" y1="138" x2="86" y2="84" stroke="#3a4650" strokeWidth="2" strokeLinecap="round" />
      <line x1="126" y1="138" x2="156" y2="84" stroke="#3a4650" strokeWidth="2" strokeLinecap="round" />

      {/* brand strip */}
      <rect x="28" y="174" width="154" height="26" rx="13" fill="#101010" stroke="#242424" />
      <text x="105" y="192" textAnchor="middle" fontSize="12" fill="#6f6f6f" fontFamily="var(--font-kanit)" letterSpacing="3">FLEET</text>

      {/* headlights */}
      <circle cx="46" cy="234" r="34" fill="url(#fLamp)" />
      <circle cx="164" cy="234" r="34" fill="url(#fLamp)" />
      <rect x="32" y="222" width="40" height="22" rx="11" fill={ACCENT} fillOpacity="0.9" />
      <rect x="138" y="222" width="40" height="22" rx="11" fill={ACCENT} fillOpacity="0.9" />

      {/* grille */}
      <rect x="79" y="220" width="52" height="40" rx="10" fill="#0a0a0a" stroke="#222" />
      <line x1="87" y1="230" x2="123" y2="230" stroke="#2c2c2c" strokeWidth="2" />
      <line x1="87" y1="240" x2="123" y2="240" stroke="#2c2c2c" strokeWidth="2" />
      <line x1="87" y1="250" x2="123" y2="250" stroke="#2c2c2c" strokeWidth="2" />

      {/* bumper + plate */}
      <rect x="18" y="300" width="174" height="44" rx="20" fill="#121212" stroke="#202020" />
      <rect x="73" y="310" width="64" height="22" rx="6" fill="#0a0a0a" stroke="#2a2a2a" />
      <text x="105" y="326" textAnchor="middle" fontSize="11" fill="#8a8a8a" fontFamily="var(--font-kanit)" letterSpacing="2">BX-104</text>
    </svg>
  )
}

/* Side profile of the bus (long panel with windows + wheels) */
function SideFace({ flip = false }) {
  return (
    <svg viewBox="0 0 300 380" className="h-full w-full" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <defs>
        <linearGradient id="sBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#242424" />
          <stop offset="0.45" stopColor="#161616" />
          <stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="sGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2935" />
          <stop offset="1" stopColor="#0c1117" />
        </linearGradient>
      </defs>

      <rect x="2" y="6" width="296" height="368" rx="46" fill="#000" />
      <rect x="6" y="10" width="288" height="360" rx="42" fill="url(#sBody)" />

      {/* roof rail */}
      <rect x="20" y="22" width="260" height="10" rx="5" fill="#000" opacity="0.6" />

      {/* long window band */}
      <rect x="24" y="74" width="252" height="92" rx="20" fill="#0b0b0b" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={34 + i * 49} y={82} width="42" height="76" rx="12" fill="url(#sGlass)" stroke="#2b3640" strokeWidth="1" />
      ))}

      {/* accent brand line */}
      <rect x="24" y="184" width="252" height="6" rx="3" fill={ACCENT} fillOpacity="0.7" />
      <text x="150" y="216" textAnchor="middle" fontSize="13" fill="#6f6f6f" fontFamily="var(--font-kanit)" letterSpacing="6">FLEET · CITY LINE</text>

      {/* door */}
      <rect x="40" y="232" width="46" height="120" rx="14" fill="#0d0d0d" stroke="#222" />
      <line x1="63" y1="240" x2="63" y2="344" stroke="#222" strokeWidth="1.5" />

      {/* wheels */}
      <circle cx="92" cy="356" r="30" fill="#000" />
      <circle cx="92" cy="356" r="13" fill="#1c1c1c" stroke="#333" strokeWidth="2" />
      <circle cx="232" cy="356" r="30" fill="#000" />
      <circle cx="232" cy="356" r="13" fill="#1c1c1c" stroke="#333" strokeWidth="2" />
    </svg>
  )
}

/* Roof of the bus (AC units + vents) */
function RoofFace() {
  return (
    <svg viewBox="0 0 210 300" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="210" height="300" rx="40" fill="#0e0e0e" />
      <rect x="0" y="0" width="210" height="300" rx="40" fill="none" stroke="#1c1c1c" strokeWidth="2" />
      <rect x="46" y="30" width="118" height="70" rx="12" fill="#161616" stroke="#262626" />
      <rect x="58" y="44" width="94" height="10" rx="5" fill="#0a0a0a" />
      <rect x="58" y="62" width="94" height="10" rx="5" fill="#0a0a0a" />
      <rect x="58" y="80" width="94" height="8" rx="4" fill="#0a0a0a" />
      <rect x="64" y="140" width="82" height="46" rx="10" fill="#141414" stroke="#242424" />
      <rect x="74" y="220" width="62" height="40" rx="10" fill="#141414" stroke="#242424" />
    </svg>
  )
}

/* Assembles the faces into a real 3D box */
function Bus3D() {
  const faceBase = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
  }
  return (
    <div
      className="relative"
      style={{ width: BUS_W, height: BUS_H, transformStyle: "preserve-3d" }}
    >
      {/* Front */}
      <div
        style={{
          ...faceBase,
          width: BUS_W,
          height: BUS_H,
          transform: `translate(-50%,-50%) translateZ(${BUS_D / 2}px)`,
        }}
      >
        <FrontFace />
      </div>

      {/* Back (reuse front, dimmed) */}
      <div
        style={{
          ...faceBase,
          width: BUS_W,
          height: BUS_H,
          opacity: 0.55,
          transform: `translate(-50%,-50%) rotateY(180deg) translateZ(${BUS_D / 2}px)`,
        }}
      >
        <FrontFace />
      </div>

      {/* Right side */}
      <div
        style={{
          ...faceBase,
          width: BUS_D,
          height: BUS_H,
          transform: `translate(-50%,-50%) rotateY(90deg) translateZ(${BUS_W / 2}px)`,
        }}
      >
        <SideFace />
      </div>

      {/* Left side */}
      <div
        style={{
          ...faceBase,
          width: BUS_D,
          height: BUS_H,
          transform: `translate(-50%,-50%) rotateY(-90deg) translateZ(${BUS_W / 2}px)`,
        }}
      >
        <SideFace flip />
      </div>

      {/* Roof */}
      <div
        style={{
          ...faceBase,
          width: BUS_W,
          height: BUS_D,
          transform: `translate(-50%,-50%) rotateX(90deg) translateZ(${BUS_H / 2}px)`,
        }}
      >
        <RoofFace />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Small UI helpers                                                  */
/* ------------------------------------------------------------------ */

function Card({ children, className = "", glass = false }) {
  return (
    <div
      className={`rounded-[28px] border ${
        glass
          ? "border-white/[0.08] bg-[#111111]/25 backdrop-blur-md"
          : "border-white/[0.06] bg-[#111111]/80 backdrop-blur-xl"
      } ${className}`}
    >
      {children}
    </div>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + p.value, 0)
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c0c]/95 px-3 py-2 backdrop-blur-md">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="font-medium text-white">${total.toLocaleString()}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab 0 — Earnings                                                  */
/* ------------------------------------------------------------------ */

function Earnings() {
  const totals = {
    ticket: revenueStreams.ticket.reduce((a, b) => a + b, 0),
    ads: revenueStreams.ads.reduce((a, b) => a + b, 0),
    parcel: revenueStreams.parcel.reduce((a, b) => a + b, 0),
  }
  const grand = totals.ticket + totals.ads + totals.parcel

  const streams = [
    { key: "ticket", label: "Tickets", icon: Ticket, color: ACCENT, value: totals.ticket },
    { key: "ads", label: "Onboard Ads", icon: Megaphone, color: ACCENT_2, value: totals.ads },
    { key: "parcel", label: "Parcels", icon: Package, color: ACCENT_3, value: totals.parcel },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Weekly Revenue</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-white">
              ${grand.toLocaleString()}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[#E9B872]/10 px-2.5 py-1 text-xs font-medium text-[#E9B872]">
            <ArrowUpRight className="h-3.5 w-3.5" /> 18.4%
          </span>
        </div>

        <div className="mt-4 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="gTicket" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={ACCENT} stopOpacity={0.5} />
                  <stop offset="1" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#ffffff" strokeOpacity={0.05} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#666", fontSize: 11 }}
                dy={6}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#E9B872", strokeOpacity: 0.3 }} />
              <Area
                type="monotone"
                dataKey="parcel"
                stackId="1"
                stroke={ACCENT_3}
                strokeWidth={1.5}
                fill={ACCENT_3}
                fillOpacity={0.18}
              />
              <Area
                type="monotone"
                dataKey="ads"
                stackId="1"
                stroke={ACCENT_2}
                strokeWidth={1.5}
                fill={ACCENT_2}
                fillOpacity={0.18}
              />
              <Area
                type="monotone"
                dataKey="ticket"
                stackId="1"
                stroke={ACCENT}
                strokeWidth={2}
                fill="url(#gTicket)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        {streams.map((s) => {
          const pct = Math.round((s.value / grand) * 100)
          const Icon = s.icon
          return (
            <Card key={s.key} className="flex items-center gap-4 p-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: `${s.color}1a`, color: s.color }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{s.label}</p>
                  <p className="text-sm font-semibold text-white">${s.value.toLocaleString()}</p>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: s.color }}
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab 1 — Live Fleet                                                */
/* ------------------------------------------------------------------ */

function smoothPath(pts) {
  if (pts.length < 2) return ""
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i]
    const p1 = pts[i + 1]
    const mx = (p0.x + p1.x) / 2
    d += ` Q ${p0.x} ${p0.y} ${mx} ${(p0.y + p1.y) / 2}`
    d += ` T ${p1.x} ${p1.y}`
  }
  return d
}

function LiveFleet() {
  const path = smoothPath(routePoints)
  const stats = [
    { icon: Gauge, label: "Speed", value: "48", unit: "km/h" },
    { icon: Users, label: "Onboard", value: "41", unit: "/ 50" },
    { icon: Clock, label: "ETA", value: "12", unit: "min" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Live Route</p>
            <p className="mt-0.5 text-lg font-medium text-white">City Line · BX-104</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-[#5C6B5A]/15 px-2.5 py-1 text-xs font-medium text-[#9ab38f]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9ab38f] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9ab38f]" />
            </span>
            On route
          </span>
        </div>

        <div className="mt-3 px-2">
          <svg viewBox="0 0 370 320" className="h-52 w-full">
            <defs>
              <linearGradient id="routeLine" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor={ACCENT} stopOpacity="0.3" />
                <stop offset="1" stopColor={ACCENT} />
              </linearGradient>
            </defs>
            {/* faint grid */}
            {[80, 160, 240].map((y) => (
              <line key={y} x1="0" y1={y} x2="370" y2={y} stroke="#fff" strokeOpacity="0.04" />
            ))}

            <path d={path} fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="10" strokeLinecap="round" />
            <motion.path
              d={path}
              fill="none"
              stroke="url(#routeLine)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />

            {/* stops */}
            {routePoints.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="6" fill="#0c0c0c" stroke={ACCENT} strokeWidth="2" />
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#8a8a8a"
                  fontFamily="var(--font-kanit)"
                >
                  {stops[i]}
                </text>
              </g>
            ))}

            {/* moving bus marker */}
            <motion.g
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ offsetPath: `path('${path}')` }}
            >
              <circle r="13" fill={ACCENT} fillOpacity="0.18" />
              <circle r="7" fill={ACCENT} />
              <Bus x={-5} y={-5} width={10} height={10} color="#0c0c0c" />
            </motion.g>
          </svg>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} glass className="flex flex-col items-center gap-1 px-2 py-4">
              <Icon className="mb-1 h-4 w-4 text-[#E9B872]" />
              <p className="text-xl font-semibold leading-none text-white">{s.value}</p>
              <p className="text-[10px] text-neutral-500">{s.unit}</p>
              <p className="text-[10px] uppercase tracking-wider text-neutral-600">{s.label}</p>
            </Card>
          )
        })}
      </div>

      <Card className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E9B872]/10 text-[#E9B872]">
          <MapPin className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-wider text-neutral-500">Next Stop</p>
          <p className="text-sm font-medium text-white">Hill Gate · arriving in 4 min</p>
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab 2 — Management (drill-down)                                   */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
}

function Management() {
  const [level, setLevel] = useState(0)
  const [dir, setDir] = useState(1)
  const [bus, setBus] = useState(null)
  const [trip, setTrip] = useState(null)

  const go = (newLevel) => {
    setDir(newLevel > level ? 1 : -1)
    setLevel(newLevel)
  }

  const crumbs = [
    { label: "Buses", level: 0 },
    bus && { label: bus.id, level: 1 },
    trip && { label: trip.time, level: 2 },
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-4">
      {/* breadcrumb */}
      <div className="flex flex-wrap items-center gap-1 px-1 text-sm">
        {crumbs.map((c, i) => (
          <span key={c.label} className="flex items-center gap-1">
            <button
              onClick={() => go(c.level)}
              className={`rounded-lg px-1.5 py-0.5 transition-colors ${
                i === crumbs.length - 1
                  ? "font-medium text-[#E9B872]"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              {c.label}
            </button>
            {i < crumbs.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-neutral-700" />}
          </span>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          {/* Level 0 — Select Bus */}
          {level === 0 && (
            <motion.div
              key="lvl0"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-col gap-3"
            >
              <p className="px-1 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                Select a bus
              </p>
              {fleet.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBus(b)
                    setTrip(null)
                    go(1)
                  }}
                  className="text-left"
                >
                  <Card className="flex items-center gap-4 p-4 transition-colors hover:border-[#E9B872]/30">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] text-[#E9B872]">
                      <Bus className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-white">{b.id}</p>
                      <p className="text-xs text-neutral-500">{b.route}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        b.status === "Active"
                          ? "bg-[#5C6B5A]/15 text-[#9ab38f]"
                          : "bg-white/[0.06] text-neutral-400"
                      }`}
                    >
                      {b.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-neutral-600" />
                  </Card>
                </button>
              ))}
            </motion.div>
          )}

          {/* Level 1 — Select Trip */}
          {level === 1 && bus && (
            <motion.div
              key="lvl1"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-col gap-3"
            >
              <button
                onClick={() => go(0)}
                className="flex items-center gap-1 px-1 text-xs text-neutral-500 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" /> Back to buses
              </button>
              <Card className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-white">{bus.id}</p>
                  <p className="text-xs text-neutral-500">{bus.route} · {bus.driver}</p>
                </div>
                <span className="text-xs text-neutral-500">{tripsByBus[bus.id].length} trips</span>
              </Card>
              {tripsByBus[bus.id].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTrip(t)
                    go(2)
                  }}
                  className="text-left"
                >
                  <Card className="flex items-center gap-4 p-4 transition-colors hover:border-[#E9B872]/30">
                    <span className="flex h-11 w-11 flex-col items-center justify-center rounded-2xl bg-white/[0.05] text-white">
                      <span className="text-sm font-semibold leading-none">{t.time}</span>
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {t.from} → {t.to}
                      </p>
                      <p className="text-xs text-neutral-500">{t.pax} passengers</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-600" />
                  </Card>
                </button>
              ))}
            </motion.div>
          )}

          {/* Level 2 — View Data */}
          {level === 2 && trip && (
            <motion.div
              key="lvl2"
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-col gap-3"
            >
              <button
                onClick={() => go(1)}
                className="flex items-center gap-1 px-1 text-xs text-neutral-500 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" /> Back to trips
              </button>
              <Card className="p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                  Trip {trip.time} · {bus.id}
                </p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  ${trip.rev.toLocaleString()}
                </p>
                <p className="text-xs text-neutral-500">{trip.from} → {trip.to}</p>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Users, label: "Passengers", value: trip.pax },
                  { icon: MapPin, label: "Distance", value: "18.4 km" },
                  { icon: Clock, label: "On-time", value: "96%" },
                  { icon: Fuel, label: "Fuel used", value: "9.2 L" },
                ].map((m) => {
                  const Icon = m.icon
                  return (
                    <Card key={m.label} glass className="p-4">
                      <Icon className="mb-2 h-4 w-4 text-[#E9B872]" />
                      <p className="text-lg font-semibold text-white">{m.value}</p>
                      <p className="text-[11px] uppercase tracking-wider text-neutral-500">
                        {m.label}
                      </p>
                    </Card>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Shell                                                             */
/* ------------------------------------------------------------------ */

export default function BusDashboard() {
  const [tab, setTab] = useState(1)

  const handleDragEnd = (_e, info) => {
    if (info.offset.x < -60 && tab < 2) setTab(tab + 1)
    else if (info.offset.x > 60 && tab > 0) setTab(tab - 1)
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#0C0C0C] p-4 font-sans">
      <div
        className="relative overflow-hidden rounded-[40px] border border-white/[0.07] bg-[#0C0C0C] shadow-2xl"
        style={{ width: 390, height: 844 }}
      >
        {/* Bus background — a real 3D model that rotates with the active tab */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ perspective: 1000, perspectiveOrigin: "50% 38%" }}
        >
          <motion.div
            style={{ transformStyle: "preserve-3d" }}
            animate={{
              rotateY: BUS_ANGLE[tab],
              rotateX: 8,
              scale: tab === 1 ? 0.92 : 0.84,
            }}
            transition={{ type: "spring", stiffness: 70, damping: 17 }}
          >
            <Bus3D />
          </motion.div>
        </div>

        {/* readability gradient over the bus — lighter so the 3D bus shows through */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0C0C0C]/20 via-[#0C0C0C]/35 to-[#0C0C0C]/90" />

        {/* Foreground UI */}
        <div className="relative z-10 flex h-full flex-col">
          {/* header */}
          <header className="flex items-center justify-between px-6 pt-7">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#E9B872]">Fleet</p>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {TABS[tab].label}
              </h1>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-medium text-white">
              JD
            </div>
          </header>

          {/* swipeable content */}
          <motion.div
            className="flex-1 overflow-y-auto px-5 pb-32 pt-5"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {tab === 0 && <Earnings />}
                {tab === 1 && <LiveFleet />}
                {tab === 2 && <Management />}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* tab bar */}
          <nav className="absolute inset-x-0 bottom-0 px-5 pb-6">
            <div className="flex items-center justify-between rounded-[28px] border border-white/[0.07] bg-[#111111]/85 px-2 py-2 backdrop-blur-xl">
              {TABS.map((t, i) => {
                const Icon = t.icon
                const active = tab === i
                return (
                  <button
                    key={t.label}
                    onClick={() => setTab(i)}
                    className="relative flex flex-1 flex-col items-center gap-1 rounded-3xl py-2.5"
                  >
                    {active && (
                      <motion.span
                        layoutId="tabPill"
                        className="absolute inset-0 rounded-3xl bg-[#E9B872]/10"
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      />
                    )}
                    <Icon
                      className={`relative h-5 w-5 transition-colors ${
                        active ? "text-[#E9B872]" : "text-neutral-500"
                      }`}
                    />
                    <span
                      className={`relative text-[10px] font-medium transition-colors ${
                        active ? "text-[#E9B872]" : "text-neutral-600"
                      }`}
                    >
                      {t.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </nav>
        </div>
      </div>
    </main>
  )
}

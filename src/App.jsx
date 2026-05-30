import { useState, useEffect } from 'react'
import './index.css'

const GENRES = [
  { id: 'all',        label: 'All',            emoji: '✦'  },
  { id: 'hackathon',  label: 'Hackathons',     emoji: '⚡' },
  { id: 'party',      label: 'Parties',        emoji: '★'  },
  { id: 'club',       label: 'Clubs',          emoji: '◈'  },
  { id: 'coffee',     label: 'Code & Coffee',  emoji: '◎'  },
  { id: 'concert',    label: 'Concerts',       emoji: '♪'  },
  { id: 'popup',      label: 'Pop-ups',        emoji: '◇'  },
  { id: 'art',        label: 'Art & Culture',  emoji: '◉'  },
  { id: 'food',       label: 'Food & Drink',   emoji: '◆'  },
  { id: 'sports',     label: 'Sports',         emoji: '▶'  },
  { id: 'comedy',     label: 'Comedy',         emoji: '◐'  },
  { id: 'tech',       label: 'Tech Talks',     emoji: '⊕'  },
  { id: 'rave',       label: 'Raves',          emoji: '◑'  },
]

const BB_URL     = 'https://api.butterbase.ai/v1/app_rla1utb85vq8'
const BB_TOKEN   = 'bb_sk_d735d6d1b9bf5daf478e956a6fdf7a127ced29bb'
const EVEROS_API = 'http://localhost:1995/api/v1'
const USER_ID    = 'demo_user_001'

const VENUE_COORDS = {
  'Founders Hub': [51.522, -0.0853], 'The Penthouse': [51.5031, -0.0226],
  'Brew Lab': [51.5074, -0.1278], 'Fabric London': [51.5203, -0.1009],
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function bb(path, opts = {}) {
  return fetch(`${BB_URL}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${BB_TOKEN}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
  })
}

async function storeInteraction(eventId, action, genre) {
  bb('/interactions', { method: 'POST', body: JSON.stringify({ user_id: USER_ID, event_id: String(eventId), action, genre }) }).catch(() => {})
  fetch(`${EVEROS_API}/memories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: USER_ID, session_id: `session_${Date.now()}`,
      messages: [{ message_id: `${action}_${eventId}_${Date.now()}`, sender_id: USER_ID, sender_name: 'User', role: 'user', timestamp: Date.now(), content: `User ${action} an event in the ${genre} category` }],
    }),
  }).catch(() => {})
}

function EventCard({ event, onSave, onAttend, saved, attended }) {
  const isAttending = attended?.has(event.title)

  return (
    <div
      onClick={() => event.url && window.open(event.url, '_blank', 'noopener')}
      className="group flex flex-col bg-[#111] rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44 flex-shrink-0 bg-[#1a1a1a]">
        <img
          src={event.img}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Distance badge */}
        <span className="absolute bottom-3 left-3 text-xs font-medium text-white/80 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
          {event.distMi?.toFixed(1)} mi away
        </span>

        {/* Save button */}
        <button
          onClick={e => { e.stopPropagation(); onSave(event) }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-base transition-all border
            ${saved ? 'bg-white text-black border-white' : 'bg-black/40 backdrop-blur-sm text-white/60 border-white/10 hover:text-white hover:border-white/30'}`}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
            {event.genre}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-1.5 flex-1">
          {event.title}
        </h3>
        <p className="text-xs text-white/40 truncate mb-0.5">{event.venue}</p>
        <p className="text-xs text-white/30 mb-4">{event.date}</p>

        <button
          onClick={e => { e.stopPropagation(); onAttend(event) }}
          className={`w-full py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all border
            ${isAttending
              ? 'border-white/10 text-white/30 cursor-default'
              : 'border-white/15 text-white hover:bg-white hover:text-black hover:border-white'
            }`}
        >
          {isAttending ? 'Attending ✓' : "I'm Going"}
        </button>
      </div>
    </div>
  )
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full text-sm font-medium shadow-2xl z-50 whitespace-nowrap">
      {message}
    </div>
  )
}

export default function App() {
  const [activeGenre, setActiveGenre] = useState('all')
  const [allEvents, setAllEvents]     = useState([])
  const [events, setEvents]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [userPos, setUserPos]         = useState(null)
  const [saved, setSaved]             = useState(new Set())
  const [attended, setAttended]       = useState(new Set())
  const [toast, setToast]             = useState(null)
  const [radius, setRadius]           = useState(10)
  const [memoryCount, setMemoryCount] = useState(0)

  useEffect(() => {
    const fallback = setTimeout(() => setUserPos([37.3688, -122.0363]), 5000)
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => { clearTimeout(fallback); setUserPos([coords.latitude, coords.longitude]) },
      () => { clearTimeout(fallback); setUserPos([37.3688, -122.0363]) },
      { timeout: 5000, maximumAge: 60000 }
    )
    return () => clearTimeout(fallback)
  }, [])

  useEffect(() => {
    setLoading(true)
    let qs = 'limit=200'
    if (activeGenre !== 'all') qs += `&genre=eq.${activeGenre}`
    bb(`/events?${qs}`)
      .then(r => r.json())
      .then(data => setAllEvents(Array.isArray(data) ? data : []))
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false))
  }, [activeGenre])

  useEffect(() => {
    if (!userPos) return
    const [uLat, uLng] = userPos
    const filtered = allEvents
      .map(e => {
        const lat = e.lat ? parseFloat(e.lat) : (VENUE_COORDS[e.venue] || [])[0]
        const lng = e.lng ? parseFloat(e.lng) : (VENUE_COORDS[e.venue] || [])[1]
        const dist = lat && lng ? haversine(uLat, uLng, lat, lng) : null
        return { ...e, distMi: dist }
      })
      .filter(e => e.distMi !== null && e.distMi <= radius)
      .sort((a, b) => a.distMi - b.distMi)
    setEvents(filtered)
  }, [allEvents, userPos, radius])

  const handleSave = event => {
    setSaved(prev => {
      const next = new Set(prev)
      if (next.has(event.title)) { next.delete(event.title) }
      else {
        next.add(event.title)
        storeInteraction(event.title, 'saved', event.genre)
        setMemoryCount(c => c + 1)
        setToast('Saved to your list')
      }
      return next
    })
  }

  const handleAttend = event => {
    if (attended.has(event.title)) return
    setAttended(prev => new Set([...prev, event.title]))
    storeInteraction(event.title, 'attended', event.genre)
    setMemoryCount(c => c + 1)
    setToast(`Marked as attending`)
  }

  const activeLabel = GENRES.find(g => g.id === activeGenre)?.label

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <div className="px-8 py-4 flex items-center gap-8">

          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-lg font-semibold tracking-tight text-white">
              event<span className="text-white/40">layer</span>
            </span>
          </div>

          {/* Genre filters */}
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar flex-1">
            {GENRES.map(g => (
              <button
                key={g.id}
                onClick={() => { setActiveGenre(g.id); if (g.id !== 'all') storeInteraction(0, `browsed ${g.id}`, g.id) }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all
                  ${activeGenre === g.id
                    ? 'bg-white text-black'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {memoryCount > 0 && (
              <span className="text-xs text-white/30 font-medium">
                {memoryCount} saved
              </span>
            )}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/30">Within</span>
              <input
                type="range" min={0.5} max={25} step={0.5}
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                className="w-20 accent-white h-0.5"
              />
              <span className="text-xs text-white/50 w-12 font-medium">{radius} mi</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Page title ── */}
      <div className="px-8 pt-10 pb-6 border-b border-white/5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">
              {userPos ? `Within ${radius} miles` : 'Locating you…'}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              {activeGenre === 'all' ? 'Everything Near You' : activeLabel}
            </h1>
          </div>
          <span className="text-sm text-white/25 font-medium pb-1">
            {loading || !userPos ? '—' : `${events.length} events`}
          </span>
        </div>
      </div>

      {/* ── Grid ── */}
      <main className="flex-1 px-8 py-8">
        {loading || !userPos ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white/3 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {events.map((event, i) => (
              <EventCard
                key={`${event.title}-${i}`}
                event={event}
                saved={saved.has(event.title)}
                attended={attended}
                onSave={handleSave}
                onAttend={handleAttend}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-white/20">
            <p className="text-4xl mb-4 font-light">0</p>
            <p className="text-sm">No events within {radius} miles</p>
            <p className="text-xs mt-1">Try expanding your radius</p>
          </div>
        )}
      </main>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

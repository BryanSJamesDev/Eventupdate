import { useState, useEffect } from 'react'
import './index.css'

const GENRES = [
  { id: 'all',        label: 'All',            emoji: '✨' },
  { id: 'hackathon',  label: 'Hackathons',     emoji: '💻' },
  { id: 'party',      label: 'Parties',        emoji: '🎉' },
  { id: 'club',       label: 'Clubs',          emoji: '🎧' },
  { id: 'coffee',     label: 'Code & Coffee',  emoji: '☕' },
  { id: 'concert',    label: 'Concerts',       emoji: '🎵' },
  { id: 'popup',      label: 'Pop-ups',        emoji: '🛍️' },
  { id: 'art',        label: 'Art & Culture',  emoji: '🎨' },
  { id: 'food',       label: 'Food & Drink',   emoji: '🍜' },
  { id: 'sports',     label: 'Sports',         emoji: '⚽' },
  { id: 'comedy',     label: 'Comedy',         emoji: '😂' },
  { id: 'tech',       label: 'Tech Talks',     emoji: '🚀' },
  { id: 'rave',       label: 'Raves',          emoji: '🪩' },
]

const BB_URL     = 'https://api.butterbase.ai/v1/app_rla1utb85vq8'
const BB_TOKEN   = 'bb_sk_d735d6d1b9bf5daf478e956a6fdf7a127ced29bb'
const EVEROS_API = 'http://localhost:1995/api/v1'
const USER_ID    = 'demo_user_001'

const VENUE_COORDS = {
  'Founders Hub':       [51.5220, -0.0853],
  'The Penthouse':      [51.5031, -0.0226],
  'Brew Lab':           [51.5074, -0.1278],
  'Fabric London':      [51.5203, -0.1009],
  'Roundhouse':         [51.5443, -0.1513],
  'Maltby Street':      [51.5004, -0.0778],
  'TechHub Shoreditch': [51.5246, -0.0803],
  'Saatchi Gallery':    [51.4919, -0.1607],
  'Studio 338':         [51.4979,  0.0029],
  'Brick Lane':         [51.5226, -0.0713],
  'Comedy Store':       [51.5099, -0.1338],
  'Goals Stratford':    [51.5432, -0.0047],
  'Impact Hub':         [51.5241, -0.0852],
  'Shoreditch House':   [51.5252, -0.0779],
  'Second Home':        [51.5249, -0.0782],
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function bb(path, opts = {}) {
  return fetch(`${BB_URL}${path}`, {
    ...opts,
    headers: { 'Authorization': `Bearer ${BB_TOKEN}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
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
  return (
    <div className="bg-[#16161c] border border-white/8 rounded-2xl overflow-hidden hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-950/30 transition-all duration-200 group flex flex-col">
      <div className="relative flex-shrink-0">
        <img
          src={event.img}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-300"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {event.hot && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">🔥 Hot</span>
        )}
        <span className="absolute top-3 right-10 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
          {event.distMi?.toFixed(1)} mi
        </span>
        <button
          onClick={() => onSave(event)}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all
            ${saved ? 'bg-violet-600 text-white' : 'bg-black/50 backdrop-blur text-white hover:bg-violet-600'}`}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-violet-400 font-medium uppercase tracking-wide mb-1">
          {GENRES.find(g => g.id === event.genre)?.emoji} {event.genre}
        </span>
        <h3 className="font-semibold text-white text-sm leading-snug mb-1 line-clamp-2 flex-1">{event.title}</h3>
        <p className="text-gray-500 text-xs mb-1 truncate">{event.venue}</p>
        <p className="text-gray-400 text-xs mb-3">{event.date}</p>
        <button
          onClick={() => onAttend(event)}
          className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors
            ${attended?.has(event.title)
              ? 'bg-violet-900/50 text-violet-400 cursor-default'
              : 'bg-violet-600 hover:bg-violet-500 text-white'}`}
        >
          {attended?.has(event.title) ? "You're going ✓" : "I'm In"}
        </button>
      </div>
    </div>
  )
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-violet-700 text-white px-6 py-3 rounded-full text-sm font-medium shadow-2xl z-50 whitespace-nowrap">
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
        const dist = (lat && lng) ? haversine(uLat, uLng, lat, lng) : null
        return { ...e, distMi: dist }
      })
      .filter(e => e.distMi !== null && e.distMi <= radius)
      .sort((a, b) => a.distMi - b.distMi)
    setEvents(filtered)
  }, [allEvents, userPos, radius])

  const handleSave = (event) => {
    setSaved(prev => {
      const next = new Set(prev)
      if (next.has(event.title)) { next.delete(event.title) }
      else {
        next.add(event.title)
        storeInteraction(event.title, 'saved', event.genre)
        setMemoryCount(c => c + 1)
        setToast(`Saved — EverOS remembered ✓`)
      }
      return next
    })
  }

  const handleAttend = (event) => {
    if (attended.has(event.title)) return
    setAttended(prev => new Set([...prev, event.title]))
    storeInteraction(event.title, 'attended', event.genre)
    setMemoryCount(c => c + 1)
    setToast(`You're going to "${event.title}" 🎉`)
  }

  const activeLabel = GENRES.find(g => g.id === activeGenre)?.label

  return (
    <div className="min-h-screen bg-[#0c0c10] flex flex-col">

      {/* ── Top nav ── */}
      <header className="sticky top-0 z-40 bg-[#0c0c10]/95 backdrop-blur-md border-b border-white/5">
        <div className="px-6 py-3 flex items-center gap-6">
          {/* Logo */}
          <span className="text-xl font-bold text-white flex-shrink-0">
            Event<span className="text-violet-500">Layer</span>
          </span>

          {/* Genre pills — full width scrollable */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar flex-1">
            {GENRES.map(g => (
              <button
                key={g.id}
                onClick={() => { setActiveGenre(g.id); if (g.id !== 'all') storeInteraction(0, `browsed ${g.id}`, g.id) }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all border
                  ${activeGenre === g.id
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'bg-white/5 border-white/8 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <span>{g.emoji}</span><span>{g.label}</span>
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {memoryCount > 0 && (
              <div className="flex items-center gap-1.5 bg-violet-950/70 border border-violet-800/40 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-violet-300 text-xs font-medium">{memoryCount} memories</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3 py-1.5">
              <span className="text-gray-400 text-xs">📍</span>
              <input
                type="range" min={0.5} max={25} step={0.5}
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                className="w-24 accent-violet-500 h-1"
              />
              <span className="text-violet-400 text-xs font-semibold w-10">{radius} mi</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 px-6 py-6">

        {/* Section heading */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {activeGenre === 'all' ? 'Everything Near You' : activeLabel}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {userPos ? `Within ${radius} miles of your location` : 'Detecting your location…'}
            </p>
          </div>
          <span className="text-gray-500 text-sm bg-white/5 px-3 py-1 rounded-full">
            {loading || !userPos ? '…' : `${events.length} events`}
          </span>
        </div>

        {/* EverOS memory banner */}
        {memoryCount > 0 && (
          <div className="mb-5 bg-violet-950/40 border border-violet-800/25 rounded-2xl px-5 py-3.5 flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            <div>
              <p className="text-violet-300 text-sm font-semibold">EverOS is learning your taste</p>
              <p className="text-gray-500 text-xs">{memoryCount} interaction{memoryCount !== 1 ? 's' : ''} stored — feed personalises over time</p>
            </div>
          </div>
        )}

        {/* Event grid */}
        {loading || !userPos ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/8 rounded-2xl h-72 animate-pulse" />
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
          <div className="flex flex-col items-center justify-center py-32 text-gray-600">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium text-gray-400">No events within {radius} miles</p>
            <p className="text-sm mt-1">Try increasing your radius</p>
          </div>
        )}
      </main>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

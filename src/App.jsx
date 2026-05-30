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

const MOCK_EVENTS = [
  { id: 1,  genre: 'hackathon', title: 'AI Builders Hackathon',       venue: 'Founders Hub',         date: 'Sat Jun 7 · 9am',   distance: '0.4mi', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80', attendees: 142, hot: true  },
  { id: 2,  genre: 'party',     title: 'Rooftop Summer Kickoff',      venue: 'The Penthouse',        date: 'Fri Jun 6 · 10pm',  distance: '0.8mi', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80', attendees: 310, hot: true  },
  { id: 3,  genre: 'coffee',    title: 'Code & Coffee Morning',       venue: 'Brew Lab',             date: 'Sun Jun 8 · 8am',   distance: '0.3mi', img: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&q=80', attendees: 48,  hot: false },
  { id: 4,  genre: 'club',      title: 'Techno Night w/ DJ Lena',     venue: 'Fabric London',        date: 'Sat Jun 7 · 11pm',  distance: '1.2mi', img: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&q=80', attendees: 500, hot: true  },
  { id: 5,  genre: 'concert',   title: 'Indie Summer Sessions',       venue: 'Roundhouse',           date: 'Thu Jun 5 · 7pm',   distance: '1.5mi', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80', attendees: 220, hot: false },
  { id: 6,  genre: 'food',      title: 'Street Food Night Market',    venue: 'Maltby Street',        date: 'Fri Jun 6 · 5pm',   distance: '0.6mi', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', attendees: 180, hot: false },
  { id: 7,  genre: 'tech',      title: 'Build with LLMs — Talk',      venue: 'TechHub Shoreditch',   date: 'Wed Jun 4 · 6:30pm', distance: '0.9mi', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80', attendees: 95,  hot: false },
  { id: 8,  genre: 'art',       title: 'Neon Art Exhibition',         venue: 'Saatchi Gallery',      date: 'Sat Jun 7 · 2pm',   distance: '2.1mi', img: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&q=80', attendees: 130, hot: false },
  { id: 9,  genre: 'rave',      title: 'Dawn Rave — Warehouse',       venue: 'Studio 338',           date: 'Sat Jun 7 · 4am',   distance: '3.2mi', img: 'https://images.unsplash.com/photo-1493676304819-0d7a312d6028?w=400&q=80', attendees: 400, hot: true  },
  { id: 10, genre: 'popup',     title: 'Vintage & Vinyl Market',      venue: 'Brick Lane',           date: 'Sun Jun 8 · 10am',  distance: '0.7mi', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', attendees: 75,  hot: false },
  { id: 11, genre: 'comedy',    title: 'Stand-up Showcase Night',     venue: 'Comedy Store',         date: 'Thu Jun 5 · 8pm',   distance: '1.1mi', img: 'https://images.unsplash.com/photo-1543357480-c60d40b1b639?w=400&q=80', attendees: 160, hot: false },
  { id: 12, genre: 'sports',    title: '5-a-side Football Social',    venue: 'Goals Stratford',      date: 'Sat Jun 7 · 3pm',   distance: '2.4mi', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80', attendees: 40,  hot: false },
  { id: 13, genre: 'hackathon', title: 'Climate Tech Buildathon',     venue: 'Impact Hub',           date: 'Sun Jun 8 · 10am',  distance: '1.8mi', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80', attendees: 88,  hot: false },
  { id: 14, genre: 'party',     title: 'Neon Glow Pool Party',        venue: 'Shoreditch House',     date: 'Sat Jun 7 · 8pm',   distance: '0.5mi', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80', attendees: 200, hot: true  },
  { id: 15, genre: 'coffee',    title: 'Founder Breakfast Club',      venue: 'Second Home',          date: 'Tue Jun 3 · 8am',   distance: '0.4mi', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', attendees: 55,  hot: false },
]

const EVEROS_API = 'http://localhost:1995/api/v1'
const USER_ID = 'demo_user_001'

async function storeInteraction(eventId, action, genre) {
  try {
    await fetch(`${EVEROS_API}/memories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: USER_ID,
        session_id: `session_${Date.now()}`,
        messages: [{
          message_id: `${action}_${eventId}_${Date.now()}`,
          sender_id: USER_ID,
          sender_name: 'User',
          role: 'user',
          timestamp: Date.now(),
          content: `User ${action} an event in the ${genre} category (event id: ${eventId})`,
        }],
      }),
    })
  } catch (_) { /* offline graceful degradation */ }
}

function GenreBar({ active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3">
      {GENRES.map(g => (
        <button
          key={g.id}
          onClick={() => onSelect(g.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
            ${active === g.id
              ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/40'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
        >
          <span>{g.emoji}</span>
          <span>{g.label}</span>
        </button>
      ))}
    </div>
  )
}

function EventCard({ event, onSave, onAttend, saved }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all duration-200 group">
      <div className="relative">
        <img
          src={event.img}
          alt={event.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {event.hot && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            🔥 Hot
          </span>
        )}
        <button
          onClick={() => onSave(event)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all
            ${saved ? 'bg-violet-600 text-white' : 'bg-black/50 text-white hover:bg-violet-600'}`}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-white text-base leading-tight">{event.title}</h3>
          <span className="text-xs text-gray-500 flex-shrink-0">{event.distance}</span>
        </div>
        <p className="text-gray-400 text-sm mb-1">{event.venue}</p>
        <p className="text-violet-400 text-sm font-medium mb-3">{event.date}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">{event.attendees} going</span>
          <button
            onClick={() => onAttend(event)}
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-1.5 rounded-full font-medium transition-colors"
          >
            I'm In
          </button>
        </div>
      </div>
    </div>
  )
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-violet-700 text-white px-5 py-3 rounded-full text-sm font-medium shadow-xl z-50 animate-bounce">
      {message}
    </div>
  )
}

export default function App() {
  const [activeGenre, setActiveGenre] = useState('all')
  const [saved, setSaved] = useState(new Set())
  const [attended, setAttended] = useState(new Set())
  const [toast, setToast] = useState(null)
  const [radius, setRadius] = useState(2)
  const [memoryCount, setMemoryCount] = useState(0)

  const filtered = MOCK_EVENTS.filter(e =>
    activeGenre === 'all' || e.genre === activeGenre
  )

  const showToast = (msg) => setToast(msg)

  const handleSave = (event) => {
    setSaved(prev => {
      const next = new Set(prev)
      if (next.has(event.id)) {
        next.delete(event.id)
      } else {
        next.add(event.id)
        storeInteraction(event.id, 'saved', event.genre)
        setMemoryCount(c => c + 1)
        showToast(`Saved "${event.title}" — EverOS remembered ✓`)
      }
      return next
    })
  }

  const handleAttend = (event) => {
    if (attended.has(event.id)) return
    setAttended(prev => new Set([...prev, event.id]))
    storeInteraction(event.id, 'attended', event.genre)
    setMemoryCount(c => c + 1)
    showToast(`You're going to "${event.title}" 🎉 Memory saved`)
  }

  const handleGenreSelect = (id) => {
    setActiveGenre(id)
    if (id !== 'all') {
      storeInteraction(0, `browsed ${id} category`, id)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f13]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0f0f13]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">Event<span className="text-violet-500">Layer</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-violet-950/60 border border-violet-800/40 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
              <span className="text-violet-300 text-xs font-medium">{memoryCount} memories</span>
            </div>
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">📍</button>
          </div>
        </div>

        {/* Genre bar */}
        <div className="max-w-2xl mx-auto">
          <GenreBar active={activeGenre} onSelect={handleGenreSelect} />
        </div>

        {/* Radius slider */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex items-center gap-3">
          <span className="text-gray-500 text-xs">📍 Radius</span>
          <input
            type="range" min={0.5} max={10} step={0.5}
            value={radius}
            onChange={e => setRadius(Number(e.target.value))}
            className="flex-1 accent-violet-500 h-1"
          />
          <span className="text-violet-400 text-xs font-medium w-12">{radius} mi</span>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">
            {activeGenre === 'all' ? 'Everything Near You' : GENRES.find(g => g.id === activeGenre)?.label}
          </h2>
          <span className="text-gray-500 text-sm">{filtered.length} events</span>
        </div>

        {memoryCount > 0 && (
          <div className="mb-4 bg-violet-950/50 border border-violet-800/30 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-xl">🧠</span>
            <div>
              <p className="text-violet-300 text-sm font-medium">EverOS is learning your taste</p>
              <p className="text-gray-500 text-xs">{memoryCount} interaction{memoryCount !== 1 ? 's' : ''} stored — feed will personalise over time</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(event => (
            <EventCard
              key={event.id}
              event={event}
              saved={saved.has(event.id)}
              onSave={handleSave}
              onAttend={handleAttend}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <p>No events in this category yet</p>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

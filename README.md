# EventLayer — Product README

---

## What Is This?

EventLayer is a location-based event discovery app that solves the three biggest problems with existing platforms: poor personalisation, siloed categories, and no social layer. It is a single unified feed where you can discover concerts, comedy nights, food festivals, art exhibitions, sports events, and more — all within a radius you set, filtered by what you actually care about, and enriched by what your friends are doing.

---

## The Problem

Existing apps like Bandsintown, Songkick, and Eventbrite each solve a slice of the problem but fall short in critical ways:

- **No smart personalisation.** They ask you to pick genres once and never learn from your behaviour. They don't adapt based on what you attend, skip, or save.
- **Siloed by category.** Music apps only show music. Event platforms bury local gigs under webinars and corporate seminars. There is no single place to say "show me everything interesting near me this weekend."
- **No social layer.** You cannot see what friends are attending, what they are interested in, or discover events through your network.
- **Inconsistent data quality.** Event times, venues, and cancellations are frequently wrong, with no direct line to the organiser.

---

## The Solution

EventLayer is built around four pillars:

### 1. Smart Personalisation
The app learns from your behaviour over time — not just a one-time genre selection. It tracks what events you tap into, save, attend, and skip, and uses that signal to surface better recommendations. The feed gets smarter the more you use it.

### 2. Cross-Category Discovery
One unified feed across all event types: music, comedy, food & drink, art, fitness, sports, markets, theatre, and more. You can filter by multiple categories simultaneously and set a precise radius from your current location or any location you choose.

### 3. Social Layer
See which events your friends are attending, interested in, or have been to. Discover events through your network. Plan together with group RSVP and shared event saves. Activity is opt-in and privacy-respecting.

### 4. Organiser Accountability
Every event listing is tied to a verified organiser profile with direct contact details. Users can flag incorrect information. Organisers are incentivised to keep listings accurate because their reputation and response rate are publicly visible on their profile.

---

## Target Users

- **Primary:** 18–35 year olds in mid-to-large cities who regularly go out and feel like they miss things happening around them.
- **Secondary:** Event organisers and promoters who want a direct channel to engaged, local audiences without relying solely on Eventbrite or social media.

---

## Core Features (v1)

| Feature | Description |
|---|---|
| Location-based feed | Events within a user-defined radius, using GPS or manual location |
| Category filters | Multi-select across music, food, comedy, art, sport, etc. |
| Radius slider | Set distance in miles/km from your location |
| Behavioural personalisation | Feed ranking improves based on interaction history |
| Friend activity | See what friends are attending or interested in |
| Organiser profiles | Verified profiles with contact info, past events, and ratings |
| Event flagging | Report incorrect info directly linked to the organiser |
| Notifications | Alerts for new events matching your preferences in your area |
| Save & RSVP | Save events privately or share interest publicly with friends |

---

## Tech Stack

### Mobile App
- **React Native** — cross-platform iOS and Android from a single codebase
- **Expo** — faster development and OTA updates without full app store releases

### Backend
- **Node.js + Express** or **Supabase** — REST API for event data, user profiles, and social graph
- **PostgreSQL** — primary database with PostGIS extension for geospatial queries (radius search)
- **Redis** — caching for feed generation and session management

### Personalisation
- **Simple collaborative filtering** to start — rank events based on what similar users engaged with
- Evolve toward a lightweight ML ranking model as data grows (e.g. a gradient boosted model on engagement signals)

### Location & Maps
- **Google Maps SDK / Mapbox** — map views and venue display
- **PostGIS** — efficient radius queries on the database level

### Event Data (Sources)
- **Ticketmaster API** — large concerts and ticketed events
- **Eventbrite API** — community and independent events
- **Organiser self-submission** — your own listing system for events not on major platforms
- Long-term: web scraping + manual curation for hyper-local events

### Social Graph
- **Custom follow/friend system** built in PostgreSQL — keep it simple before considering a dedicated graph database
- Push notifications via **Firebase Cloud Messaging (FCM)**

### Auth
- **Supabase Auth** or **Firebase Auth** — email, Google, and Apple sign-in

### Hosting & Infrastructure
- **Railway, Render, or Supabase** for early-stage backend hosting (low ops overhead)
- **Cloudflare R2 or AWS S3** for image storage (event photos, organiser avatars)
- **Vercel** if you build a web version alongside the app

---

## Data Model (Simplified)

```
Users
  - id, name, email, location, preferences[], friends[]

Events
  - id, title, category, date, venue, lat, lng, organiser_id, ticket_url

Organisers
  - id, name, email, phone, verified, rating, response_rate

UserEventInteractions
  - user_id, event_id, action (view/save/attend/skip), timestamp

Friends
  - user_id, friend_id, status (pending/accepted)

EventFlags
  - event_id, user_id, issue_type, description, resolved
```

---

## Next Steps

### Phase 1 — Validate (Weeks 1–4)
- [ ] Define the 3–5 cities you will launch in first
- [ ] Decide on event data strategy: API aggregation vs. organiser self-submission vs. both
- [ ] Build a no-code or simple web prototype to test the core feed concept with real users
- [ ] Interview 20 potential users and 10 event organisers to validate pain points

### Phase 2 — Build MVP (Weeks 5–16)
- [ ] Set up backend: database, auth, event ingestion from Ticketmaster + Eventbrite APIs
- [ ] Build React Native app: feed, filters, radius slider, event detail screen
- [ ] Implement basic personalisation (save/attend signals feeding into ranking)
- [ ] Add organiser profiles and event submission form
- [ ] Build friend system: follow, see friend activity, shared saves

### Phase 3 — Soft Launch (Weeks 17–20)
- [ ] Launch in 1–2 cities with a small beta group (aim for 500 users)
- [ ] Focus on data quality: manually verify listings, onboard 50+ local organisers
- [ ] Measure: DAU, feed engagement rate, events saved, friend invites sent

### Phase 4 — Iterate & Grow
- [ ] Improve personalisation model based on real interaction data
- [ ] Add notifications and re-engagement flows
- [ ] Expand to more cities based on waitlist demand
- [ ] Explore monetisation: promoted listings for organisers, ticketing commission

---

## Monetisation (Later)

- **Promoted listings** — organisers pay to feature their events at the top of relevant feeds
- **Ticketing cut** — small commission on tickets sold through the app
- **Organiser subscription** — monthly plan for analytics, priority support, and verified badge
- Avoid ads targeting users — it conflicts with the personalised, clean feed experience

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Cold start problem (no events, no users) | Launch in one city only, manually seed with quality listings |
| Organiser adoption | Offer free verified profile, show them audience reach data |
| Competing with Eventbrite/Ticketmaster | Own the discovery and social layer — they are ticketing tools, not discovery apps |
| Data freshness | Flag system + organiser accountability score to surface stale listings |
| Social layer adoption | Integrate with contacts/phone to find friends already on the platform |

---

*Last updated: May 2026*

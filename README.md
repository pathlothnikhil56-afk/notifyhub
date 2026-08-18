# 🔔 NotifyHub — Unified Notification & Broadcast Platform

NotifyHub is a modern, responsive web application for managing announcements, campus/organization events, urgent emergency advisories, live countdown timers, and inquiry ticketing.

Built with **React.js** (Vite + Tailwind CSS), **Node.js** (Express API), and **Vercel Neon PostgreSQL** database.

---

## 🚀 Key Features & Pages

| Page / Feature | Description |
| :--- | :--- |
| **🏠 Home Page** | Real-time live emergency alert ticker, master synchronized digital clock, key metrics summary, featured announcements, and upcoming events preview. |
| **📢 Announcements** | Departmental & official circulars with category filters (*Academic, Maintenance, Campus, Placements, General*), search by keyword/author, priority badges, detail modals, bookmarking, and notice posting. |
| **📅 Events** | Upcoming & past calendar events, date & venue tags, RSVP button with live incrementing attendee count, and 1-click **Add to Google Calendar** integration. |
| **⚠️ Urgent Alerts** | High-priority command center with blinking alerts, severity indicators (*Critical, High, Moderate*), action guidelines, direct emergency phone lines, and acknowledgment tracker. |
| **⏱️ Live Timer & Counter** | Synchronized countdown cards for milestone deadlines and hackathons with days/hours/mins/secs precision, UTC + Local reference clocks, and an interactive **Precision Stopwatch with Laps**. |
| **✉️ Contact & Helpdesk** | Inquiries and broadcast submission form with department routing, official office directory, and FAQ accordion. |
| **🗄️ Database Integration** | Full support for **Vercel Neon PostgreSQL** with automatic table migrations and demo seeding, plus a resilient offline local fallback store. |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express, CORS, Dotenv
- **Database**: Vercel Neon PostgreSQL via `@neondatabase/serverless` & `pg`

---

## 📦 Getting Started

### 1. Backend Setup & Neon DB Configuration
1. Open a terminal in the `server` folder:
   ```bash
   cd server
   npm install
   ```
2. *(Optional)* Add your **Vercel Neon PostgreSQL** connection string in `server/.env`:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://<user>:<password>@<ep-identifier>.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   > 💡 *Note: If `DATABASE_URL` is omitted, NotifyHub automatically runs in local memory mode with pre-seeded demo records!*

3. Start the backend server:
   ```bash
   npm run dev
   # Server runs at http://localhost:5000
   ```

### 2. Frontend Setup
1. Open a terminal in the `client` folder:
   ```bash
   cd client
   npm install
   npm run dev
   # Client runs at http://localhost:5173
   ```

2. Open your browser and navigate to `http://localhost:5173`.

---

## 🔌 API Endpoints Reference

- `GET /api/health` — Database connection diagnostic & server status
- `GET /api/stats` — Summary metrics for dashboard
- `GET /api/announcements` — List announcements (supports `?category=...`)
- `POST /api/announcements` — Create announcement
- `DELETE /api/announcements/:id` — Delete announcement
- `GET /api/events` — List events
- `POST /api/events` — Create event
- `POST /api/events/:id/rsvp` — RSVP to event (increments attendee count)
- `GET /api/urgent` — Active critical bulletins
- `POST /api/urgent` — Broadcast new urgent advisory
- `DELETE /api/urgent/:id` — Dismiss urgent advisory
- `GET /api/countdowns` — Active live milestone countdowns
- `POST /api/countdowns` — Create custom countdown target
- `DELETE /api/countdowns/:id` — Remove countdown
- `POST /api/contact` — Submit helpdesk inquiry / notice request
- `GET /api/contact` — View inquiry tickets

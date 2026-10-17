# AI-AURA 2026 — Premium Interactive 3D Web Application

AI-AURA is an immersive, production-grade web application for the annual inter-college talent symposium hosted by **KLE BCA & BBA College, Mahalingpur**, exclusively for Pre-University (PUC) students.

Features 18 competition events across Arts, Quiz, Stage, Writing, and AI/Tech categories with real-time student registration, live attendee notifications, interactive 3D WebGL scenes, and an authenticated administrator control center.

---

## 🎨 Visual Identity & Colour Tokens

The application follows a carefully tuned, high-contrast, dark-first color system engineered for depth, accessibility, and visual richness:

- **Background (Deep Space):** `#080B14`
- **Secondary Background:** `#101626`
- **Elevated Surface:** `#151D30`
- **Primary Interactive Accent:** `#8B5CF6` (Vivid Violet)
- **Secondary Focus Accent:** `#22D3EE` (Cyber Cyan)
- **Status & Highlight Accent:** `#A7F3D0` (Mint / Success)
- **Primary Typography:** `#F8FAFC` (High legibility)
- **Secondary Typography:** `#A7B0C0`
- **Muted Metadata:** `#738096`
- **Subtle Borders:** `rgba(148, 163, 184, 0.16)`
- **Accent Gradient:** `linear-gradient(135deg, #8B5CF6 0%, #6366F1 45%, #22D3EE 100%)`

---

## 🔮 Three.js 3D & GSAP Motion Architecture

### 1. Three.js 3D Scenes (`frontend/src/scenes3d.js`)
- **Hero "Aura Nexus" Scene:**
  - A faceted geodesic polyhedral crystal core (`IcosahedronGeometry`) with inner pulsing gemstone and wireframe lattice.
  - Dual concentric gyroscope orbital rings (`TorusGeometry`) rotating on contrasting gimbal planes.
  - 8 orbiting polyhedra satellites with customized angular velocities and sinusoidal floating amplitudes.
  - 220-particle atmospheric dust starfield with soft depth illumination.
  - Pointer/touch parallax with smooth spring damping and scroll-linked vertical displacement.
  - Device-aware LOD (limits particle count and geometry complexity on mobile, caps pixel ratio to 1.5).
  - Memory-safe lifecycle: automatic unmounting and disposal of all geometries, materials, lights, and renderers, plus `IntersectionObserver` to halt the render loop when scrolled off-screen.
- **Campus 3D Showcase (`CampusShowcase.js`):**
  - Curved glass panel displaying the campus photograph with beveled metallic trim and a glowing cyan accent rim.
  - Interactive drag-to-orbit physics with automatic inertia and spring-back.
  - Instant toggle between Interactive 3D and full-resolution photograph.

### 2. GSAP Animation System (`frontend/src/hooks/useReveal.js` & `frontend/src/components/Hero.js`)
- **Coordinated Entrance Timeline:**
  - Background stage and 3D canvas scale in gently.
  - Badges and title animate into place with subtle perspective rotation.
  - Countdown timer cards stagger in with spring easing.
  - Interactive CTA buttons slide up into position.
- **ScrollTrigger Section Reveals:**
  - Staggered entrances for Announcements, Event Explorer, Rules, Facilities, and Seminars.
  - Active section navigation highlighting in the floating capsule bar.
- **Micro-Interactions & Accessibility:**
  - Native support for `@media (prefers-reduced-motion: reduce)`: skips intensive animations while keeping all content immediately readable and interactive.

---

## 🚀 Portals & Core Functionality

### 1. Student Portal (`/`)
- **Sticky Navigation Bar:** Floating capsule with live reading progress bar, brand icon, section anchors, and responsive mobile drawer.
- **Hero Section:** Live event countdown clock (Days / Hours / Mins / Secs), date badge, and direct call-to-action buttons.
- **Live Registration Feed:** Floating toast in the bottom corner displaying recent student registrations with animated pulsing indicator.
- **Event Explorer:** Interactive 18-event catalog with category filtering (Stage, Art & Craft, Writing, Quiz & Logic, AI & Digital), interest matcher ("Find your event in 10 seconds"), and search input. Clicking any card opens a modal sheet with complete rules, judging criteria, and a direct registration pre-fill action.
- **Brochure & Rules Center:** Official rules brochure with one-click PDF download and Google Drive link, general rules breakdown, and event coordinator contacts.
- **Academic Programs & Facilities:** Highlights of semester-wise value added certificate courses (BCA and BBA curriculum breakdown from Semesters I to VI).
- **Seminars & Gallery:** Interactive slider of industry expert talks and campus photo grid with modal lightbox.
- **Student Registration Form:** Validated multi-field submission with optional team name for group events, instant confirmation modal, and screenshot reminder.

### 2. Admin Portal (`/admin`)
- **Authentication:** Protected with JWT token authentication and brute-force protection.
- **Dashboard KPI Cards:** Real-time counts of total registrations, colleges represented, solo vs. team participation, and top events.
- **Registrations Table:** Filterable, searchable student list with date stamps, team information, and one-click deletion.
- **Announcements Manager:** Create, update, and remove official alerts and bulletin board items.
- **Event Settings:** Configure event dates, timings, venue address, and official social media channels.
- **Reports:** Distribution breakdowns by competition category with printable summary.

---

## 🛠️ Installation & Development

### Environment Variables (`.env.example` / `backend/.env`)
```bash
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=ai-aura-default-jwt-secret-2026
MONGO_URI=mongodb://127.0.0.1:27017/ai-aura
```
*Note: If MongoDB is offline, the backend automatically uses an in-memory storage layer so registrations and the admin panel remain 100% operational.*

### Commands
```bash
# Install dependencies
npm install

# Build frontend production bundle
npm run build

# Start production server (serves frontend & backend on port 3000)
npm start

# Run development server
npm run dev
```

Visit `http://localhost:3000` for the Student Portal and `http://localhost:3000/admin` for the Admin Portal.

# 🔗 LinkSnip — URL Shortener with Analytics

> A full-stack, production-ready URL shortener with real-time analytics, QR code generation, custom aliases, link expiration, and bulk link creation via CSV upload.

---

## 📹 Demo Video

🎥 **[Watch the full project demo on Loom](https://www.loom.com/share/c82ebb615d204c0ab17fbada932edf76)**

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Assumptions Made](#assumptions-made)
- [AI Planning Document](#ai-planning-document)

---

## ✨ Features

- ✅ User Registration & Login with JWT Authentication
- ✅ Shorten long URLs into compact, shareable links
- ✅ Custom Alias support (e.g., `localhost:5000/my-brand`)
- ✅ Link Expiration Date — links auto-expire after a set date
- ✅ QR Code Generation for every short link (downloadable as PNG)
- ✅ Real-time Click Analytics — per-link and account-wide
- ✅ Bulk Link Creation via CSV Upload (up to 100 links at once)
- ✅ Device, Browser & Location tracking per click
- ✅ Paginated Link Management Dashboard
- ✅ Public Stats page for sharing link performance

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React.js 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **React Router DOM v7** | Client-side routing |
| **Axios** | HTTP API client |
| **Recharts** | Analytics charts & graphs |
| **qrcode.react** | QR code generation |
| **react-hot-toast** | Toast notifications |
| **react-icons** | Icon library |
| **date-fns** | Date formatting utilities |
| **Vanilla CSS** | Custom styling & design system |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js 4** | REST API framework |
| **MongoDB** | NoSQL database |
| **Mongoose 8** | MongoDB ODM |
| **JSON Web Token (JWT)** | Authentication & authorization |
| **bcryptjs** | Password hashing |
| **nanoid** | Short code generation |
| **multer** | CSV file upload handling |
| **csv-parse** | CSV parsing for bulk upload |
| **geoip-lite** | Geolocation from IP address |
| **ua-parser-js** | Device & browser detection |
| **qrcode** | Server-side QR code generation |
| **helmet** | HTTP security headers |
| **cors** | Cross-origin resource sharing |
| **express-rate-limit** | API rate limiting |
| **express-validator** | Input validation |
| **morgan** | HTTP request logger |
| **dotenv** | Environment variable management |

### Database
| Detail | Value |
|---|---|
| **Database** | MongoDB (local) |
| **Connection** | `mongodb://localhost:27017/linksnip` |
| **Collections** | `urls`, `users` |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                       │
│              React.js + Vite (Port 5173)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Dashboard │ │Analytics │ │ QR Codes │ │   Bulk   │  │
│  │  Home    │ │   Page   │ │   Page   │ │  Upload  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST (Axios)
                         │ Proxied via Vite → localhost:5000
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  EXPRESS.JS SERVER                       │
│                    (Port 5000)                           │
│                                                         │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ /api/auth  │  │  /api/urls   │  │ /api/analytics │  │
│  │  Register  │  │  Create URL  │  │ Dashboard Stats│  │
│  │  Login     │  │  List URLs   │  │ Per-Link Stats │  │
│  │  Me        │  │  Update URL  │  │ Click Tracking │  │
│  └────────────┘  │  Delete URL  │  └────────────────┘  │
│                  │  Bulk Upload │                        │
│  ┌────────────┐  └──────────────┘  ┌────────────────┐  │
│  │/:shortCode │                    │  /api/public   │  │
│  │ Redirect   │                    │  Public Stats  │  │
│  │ + Track    │                    └────────────────┘  │
│  └────────────┘                                         │
│                                                         │
│  Middleware: JWT Auth │ Rate Limit │ Helmet │ CORS       │
└────────────────────────┬────────────────────────────────┘
                         │ Mongoose ODM
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      MONGODB                             │
│              mongodb://localhost:27017/linksnip          │
│                                                         │
│   ┌─────────────────────┐  ┌──────────────────────────┐ │
│   │    users collection │  │     urls collection      │ │
│   │─────────────────────│  │──────────────────────────│ │
│   │ _id                 │  │ _id                      │ │
│   │ name                │  │ originalUrl              │ │
│   │ email (unique)      │  │ shortCode (unique)       │ │
│   │ password (hashed)   │  │ customAlias (unique)     │ │
│   │ createdAt           │  │ shortUrl                 │ │
│   └─────────────────────┘  │ title                    │ │
│                             │ expiresAt                │ │
│                             │ user (ref: users)        │ │
│                             │ clicks []                │ │
│                             │   - timestamp            │ │
│                             │   - ip                   │ │
│                             │   - device               │ │
│                             │   - browser              │ │
│                             │   - country              │ │
│                             │ totalClicks              │ │
│                             │ createdAt                │ │
│                             └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup Instructions

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or above)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd link
```

### 2. Setup the Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create your environment file
copy .env.example .env
```

Update the `.env` file with your values (see [Environment Variables](#environment-variables) below).

```bash
# Start the backend development server
npm run dev
```

The backend API will start at: **`http://localhost:5000`**

### 3. Setup the Frontend

Open a **new terminal window** and run:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend app will start at: **`http://localhost:5173`**

### 4. Open in Browser

Visit **`http://localhost:5173`** in your browser.

Register a new account and start creating short links!

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/linksnip
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
CLIENT_URL=http://localhost:5173
BASE_URL=http://localhost:5000
NODE_ENV=development
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the backend server runs on | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/linksnip` |
| `JWT_SECRET` | Secret key for signing JWT tokens | — |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | — |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |
| `BASE_URL` | Base URL used to generate short links | `http://localhost:5000` |
| `NODE_ENV` | Application environment | `development` |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT token |
| `GET` | `/api/auth/me` | Get current user profile |

### URL Management
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/urls` | Create a new short link |
| `GET` | `/api/urls` | List all links (paginated) |
| `GET` | `/api/urls/:id` | Get a specific link's details |
| `PUT` | `/api/urls/:id` | Update a link |
| `DELETE` | `/api/urls/:id` | Delete a link |
| `POST` | `/api/urls/bulk` | Bulk create links via CSV |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/dashboard/summary` | Account-wide analytics summary |
| `GET` | `/api/analytics/:urlId` | Per-link click analytics |

### Redirect
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/:shortCode` | Redirect short link to original URL |

---
## Screenshots
![image alt](https://github.com/Arul-2004/LinkSnip-Katomarans-/blob/main/backend/%7B62734898-39B4-4233-B16C-02E5601CFC2E%7D.png?raw=true)
1.Home Page
![image alt](https://github.com/Arul-2004/LinkSnip-Katomarans-/blob/main/backend/%7B9E5B074A-84C0-42A5-A205-921FD7E483B2%7D.png?raw=true)
2.user Authentication
![image alt](https://github.com/Arul-2004/LinkSnip-Katomarans-/blob/main/backend/%7B3A160141-C51E-4DB4-B07D-6DB930FB1A82%7D.png?raw=true)
3.Link
![image alt](https://github.com/Arul-2004/LinkSnip-Katomarans-/blob/main/backend/%7BFC8454D4-BDC4-4357-961A-82CB180C4B95%7D.png?raw=true)
4.Edit Link
![image alt](https://github.com/Arul-2004/LinkSnip-Katomarans-/blob/main/backend/%7BC5BA4C75-C3BA-4863-88A2-4CD7DE59E1E5%7D.png?raw=true)
5.QR
![image alt](https://github.com/Arul-2004/LinkSnip-Katomarans-/blob/main/backend/%7B8A0AE63E-7499-477E-9DC8-AE5C24C281B8%7D.png?raw=true)
6.Analytics
![image alt](https://github.com/Arul-2004/LinkSnip-Katomarans-/blob/main/backend/%7B23D145A8-E67C-4308-88C7-7215D734D2D8%7D.png?raw=true)
7.Bulk url Upload


## 💡 Assumptions Made

1. **Local MongoDB**: The application assumes MongoDB is installed and running locally on `mongodb://localhost:27017`. No cloud database (like Atlas) is configured by default.

2. **Single User Scope**: Analytics and link management are scoped per authenticated user. One user cannot see another user's links.

3. **CSV Format for Bulk Upload**: The CSV file must contain a `url` column (required), and optionally `title` and `alias` columns. The first row must be a header row.

4. **Link Expiration**: Expired links return a `410 Gone` response when accessed. The frontend shows the expiry date but does not auto-delete expired links from the database.

5. **Short Code Generation**: Short codes are generated using `nanoid` with 7 characters by default, providing a sufficiently large namespace to avoid collisions.

6. **Click Tracking**: Every redirect is tracked with IP address, device type, browser, and approximate geographic location (country-level) using `geoip-lite`.

7. **QR Codes**: QR codes are generated entirely on the frontend using `qrcode.react`. They encode the short URL (e.g., `http://localhost:5000/abc1234`) which points back to the backend redirect handler.

8. **Rate Limiting**: API endpoints are rate-limited — auth routes allow 100 requests per 15 minutes, and link creation allows 50 links per hour per user.

9. **No Email Verification**: User registration does not require email verification for simplicity.

10. **No HTTPS in Development**: The app runs on HTTP locally. For production, HTTPS is strongly recommended.

---

## 🤖 AI Planning Document

### Problem Statement
Design and build a full-stack URL shortener that goes beyond basic link shortening to offer analytics, QR code generation, and bulk operations — features typically locked behind paid tiers on platforms like Bitly.

### AI-Assisted Planning Decisions

#### 1. Architecture Decision — REST API vs GraphQL
**Decision**: REST API with Express.js
**Reasoning**: REST is simpler, widely understood, and perfectly suited for CRUD-heavy operations like URL management. GraphQL would add unnecessary complexity for this use case.

#### 2. Database Schema Design
**Decision**: Embed click data as an array inside the URL document (up to a limit), with `totalClicks` as a pre-computed integer field.
**Reasoning**: This avoids expensive JOIN-like operations for analytics. For high-scale systems, a separate `clicks` collection with indexing would be preferred, but for this project scale, embedding is performant and simpler.

#### 3. Short Code Generation Strategy
**Decision**: Use `nanoid` (7 characters, alphanumeric)
**Reasoning**: 7 characters gives ~3.5 trillion unique combinations — far more than needed for this scale. `nanoid` is URL-safe, cryptographically random, and lightweight.

#### 4. Authentication Strategy
**Decision**: Stateless JWT (JSON Web Tokens)
**Reasoning**: Stateless auth avoids the need for server-side session storage. JWTs are self-contained and easy to validate on every request. Refresh tokens are supported for session extension.

#### 5. Frontend State Management
**Decision**: React's built-in `useState` and `useEffect` hooks — no Redux or Zustand.
**Reasoning**: The app's state is mostly local to each page/component. Global state (auth user) is minimal and can be handled with simple prop passing and context, keeping the codebase lean.

#### 6. Bulk Upload Design
**Decision**: CSV file upload parsed server-side using `csv-parse`
**Reasoning**: CSV is the industry standard for batch data operations. It allows non-technical users to prepare data in Excel or Google Sheets and upload it without any API knowledge.

#### 7. Analytics Data Strategy
**Decision**: Store `dailyClicks` as a computed summary, not raw timestamps, for the dashboard chart
**Reasoning**: Querying raw click arrays for date-grouped analytics would be slow at scale. Pre-aggregating by day on read (using MongoDB aggregation) provides fast dashboard loads.

### Feature Prioritization (MoSCoW)
| Priority | Feature |
|---|---|
| **Must Have** | URL shortening, user auth, redirect |
| **Must Have** | Custom aliases, link expiration |
| **Should Have** | Click analytics, QR codes |
| **Should Have** | Bulk CSV upload |
| **Could Have** | Public stats page, device/geo tracking |
| **Won't Have (v1)** | Teams, API keys, branded domains |

---

## 🌐 Ports Reference

| Service | Port | URL |
|---|---|---|
| Frontend (Vite) | `5173` | `http://localhost:5173` |
| Backend (Express) | `5000` | `http://localhost:5000` |
| MongoDB | `27017` | `mongodb://localhost:27017` |

---

---

*This project is a part of a hackathon run by https://katomaran.com*

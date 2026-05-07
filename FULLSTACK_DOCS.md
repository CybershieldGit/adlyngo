# 🚀 Adlyngo Fullstack Architecture Guide (Pro Edition)

This is the definitive guide to the Adlyngo technical stack. It covers architecture, data modeling, security protocols, and development workflows for the unified Next.js 16 environment.

---

## 1. Core Architecture
The system is built as a **Monolithic Fullstack Application** using the Next.js App Router. It eliminates the need for a separate backend process, reducing latency and simplifying deployment.

### **Tech Stack**
- **Framework**: Next.js 16.2.4 (Turbopack enabled)
- **Runtime**: Node.js 20+
- **Database**: MongoDB (via Mongoose)
- **Storage**: Cloudinary (Image/Video hosting)
- **Auth**: JWT via `jose` (Edge-compatible)

---

## 2. Advanced Folder Structure
```text
/src
  /app
    /admin                # Protected CMS interface
      /dashboard          # Statistics and main control panel
      /login              # Auth entry point
    /api                  # Server-side API Route Handlers
      /auth               # Login/Logout logic
      /blogs              # CRUD for articles
      /projects           # CRUD for case studies
      /reels              # CRUD for cinematic videos
      /upload             # Cloudinary gateway
    /blog                 # SEO-optimized public blog
    /projects             # SEO-optimized portfolio
  /components             # Atomic Design Structure
    /layout               # Persistent UI (Navbar/Footer)
    /sections             # Home page modular blocks
    /admin                # Dashboard-specific UI (e.g., VideoUpload)
  /lib                    # Core Initializations
    mongodb.js            # Mongoose connection singleton
    cloudinary.js         # Cloudinary configuration
  /models                 # Mongoose Data Schemas
  /services               # "Fat Services" - Heavy business logic layer
  /utils                  # Pure helper functions (Pagination, API wrappers)
```

---

## 3. Database Modeling (Mongoose)

### **Blog Schema**
- `title`, `slug`, `excerpt`, `content` (HTML)
- `thumbnail`: `{ url, publicId }`
- `category`: Reference to `Category`
- `author`: Reference to `Admin`
- `seoTitle`, `seoDescription`: For meta-tag injection.

### **Project Schema**
- `title`, `slug`, `description`
- `coverImage`: Primary display image
- `gallery`: Array of `{ url, publicId }`
- `clientName`, `technologies`, `completionDate`

### **Reel Schema**
- `title`, `reelUrl`: Direct video path
- `category`: Filtering reference
- `order`: Used for manual sorting in the carousel.

---

## 4. The Security Layer (Middleware)

Authentication is handled at the **Edge** using `src/middleware.js`.

### **Auth Lifecycle:**
1. **Request**: Browser requests a protected route (e.g., `/admin/dashboard`).
2. **Detection**: Middleware checks for the `adlyngo_token` HTTP-only cookie.
3. **Verification**: 
   - Uses `jwtVerify` from the `jose` library.
   - If invalid or missing, redirects to `/admin/login`.
   - If valid, allow the request to proceed to the page/API.
4. **API Protection**: All non-GET requests to `/api/*` (except `/api/auth/login`) require a valid JWT.

---

## 5. API Reference (Detailed)

### **Authentication**
- **POST `/api/auth/login`**
  - Body: `{ email, password }`
  - Effect: Sets `adlyngo_token` cookie.

### **Content Management**
- **GET `/api/blogs?page=1&limit=10&published=true`**
  - Supports search, filtering, and pagination.
- **POST `/api/blogs` (Admin Only)**
  - Body: `FormData` or `JSON`.
  - Service: Auto-generates unique slug using `slugify.js`.

### **Media Upload**
- **POST `/api/upload`**
  - Body: `FormData` containing `file`.
  - Logic: Streams file buffer to Cloudinary.
  - Return: `{ url, publicId }`.

---

## 6. Frontend: Server vs Client Components

| Component | Type | Responsibility |
| :--- | :--- | :--- |
| `Home (page.jsx)` | **Server** | Data fetching (Projects/Blogs), SEO. |
| `InfiniteHorizontalCarousel` | **Client** | Video playback, Drag-to-scroll, Filtering. |
| `CaseStudies` | **Client** | Interactive tab switching, Framer Motion animations. |
| `BlogPage` | **Server** | Direct DB access via `blogService`. |

### **Critical Pattern: Serialization**
When a Server Component passes data to a Client Component, it must be **Plain JSON**.
```javascript
// Correct way to pass DB docs to Client Components
const featuredProjects = JSON.parse(JSON.stringify(result.projects));
```

---

## 7. SEO & Performance
- **Dynamic Sitemap**: `src/app/sitemap.jsx` fetches all blog/project slugs to keep Google updated.
- **Metadata Generation**: Each dynamic page uses `generateMetadata` to pull SEO titles/descriptions from the DB.
- **Static vs Dynamic**: Protected pages use `force-dynamic` to ensure CMS changes are visible instantly.

---

## 8. Deployment & Environment
1. **Env Setup**: Copy `.env.example` to `.env.local`.
2. **Dependencies**: `npm install`.
3. **Build**: `npm run build` (Ensures type safety and route optimization).
4. **Run**: `npm run start` or `npm run dev`.

### **Required Keys:**
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_API_URL` (Set to `/api`)

---

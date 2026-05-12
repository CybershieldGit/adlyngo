# Adlyngo API Documentation

This document provides details for all the API endpoints available in the Adlyngo Next.js application.

## Base URL
`https://adlyngo.com/api` (or `http://localhost:3000/api` for local development)

## Quick Reference (Endpoints)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | | |
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/me` | Get current admin profile |
| **Blogs** | | |
| GET | `/api/blogs` | Get all blogs |
| POST | `/api/blogs` | Create a new blog |
| GET | `/api/blogs/[slug]` | Get blog by slug |
| PUT | `/api/blogs/[id]` | Update blog by ID |
| DELETE | `/api/blogs/[id]` | Delete blog by ID |
| **Projects** | | |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a new project |
| GET | `/api/projects/[slug]` | Get project by slug |
| PUT | `/api/projects/[id]` | Update project by ID |
| DELETE | `/api/projects/[id]` | Delete project by ID |
| **Reels** | | |
| GET | `/api/reels` | Get all reels |
| POST | `/api/reels` | Create a new reel |
| PUT | `/api/reels/[id]` | Update reel by ID |
| DELETE | `/api/reels/[id]` | Delete reel by ID |
| **Categories** | | |
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create a new category |
| PUT | `/api/categories/[id]` | Update category by ID |
| DELETE | `/api/categories/[id]` | Delete category by ID |
| **Utilities** | | |
| POST | `/api/upload` | Upload file to Cloudinary |
| GET | `/api/stats` | Get dashboard stats |


## Common Response Structure
Most APIs return a consistent response structure using the `ApiResponse` utility.

```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "message": "Operation successful"
}
```

---

## 1. Authentication

### Login
Authenticates an admin and sets an HTTP-only session cookie.
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**: `200 OK` on success. Sets `adlyngo_token` cookie.

### Logout
Clears the authentication session.
- **Endpoint**: `POST /api/auth/logout`
- **Response**: `200 OK`. Clears `adlyngo_token` cookie.

### Get Current Admin
Fetches the profile of the currently logged-in admin.
- **Endpoint**: `GET /api/auth/me`
- **Auth Required**: Yes (via cookie)
- **Response**: `200 OK` with admin details.

---

## 2. Blogs

### Get All Blogs
Fetches a paginated list of blogs with optional filters.
- **Endpoint**: `GET /api/blogs`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `category`: Filter by category ID
  - `search`: Search in title/content
- **Response**: `200 OK` with blogs array and pagination metadata.

### Create Blog
Creates a new blog post.
- **Endpoint**: `POST /api/blogs`
- **Auth Required**: Yes
- **Request Body**: (Supports JSON or Multipart/Form-Data)
  ```json
  {
    "title": "Blog Title",
    "content": "HTML/Text content",
    "excerpt": "Short summary",
    "category": "category_id",
    "thumbnail": "image_url_or_file",
    "isPublished": true
  }
  ```

### Get Blog by Slug
- **Endpoint**: `GET /api/blogs/[id]` (where `id` is the slug)
- **Response**: `200 OK` with blog details.

### Update Blog
- **Endpoint**: `PUT /api/blogs/[id]` (where `id` is the MongoDB ID)
- **Auth Required**: Yes
- **Request Body**: Fields to update.

### Delete Blog
- **Endpoint**: `DELETE /api/blogs/[id]` (where `id` is the MongoDB ID)
- **Auth Required**: Yes

---

## 3. Projects (Case Studies)

### Get All Projects
- **Endpoint**: `GET /api/projects`
- **Query Parameters**: Same as Blogs.

### Create Project
- **Endpoint**: `POST /api/projects`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Project Name",
    "description": "Project details",
    "client": "Client Name",
    "category": "category_id",
    "thumbnail": "image_url",
    "images": ["url1", "url2"],
    "slug": "project-slug"
  }
  ```

### Update/Delete Project
- **Endpoints**: `PUT /api/projects/[id]`, `DELETE /api/projects/[id]`
- **Auth Required**: Yes

---

## 4. Reels

### Get All Reels
- **Endpoint**: `GET /api/reels`

### Create Reel
- **Endpoint**: `POST /api/reels`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Reel Title",
    "videoUrl": "cloudinary_url",
    "thumbnailUrl": "image_url",
    "category": "category_id"
  }
  ```

### Update/Delete Reel
- **Endpoints**: `PUT /api/reels/[id]`, `DELETE /api/reels/[id]`
- **Auth Required**: Yes

---

## 5. Categories

### Get Categories
- **Endpoint**: `GET /api/categories`
- **Query Parameters**:
  - `type`: filter by `blog`, `project`, or `reel`

### Create Category
- **Endpoint**: `POST /api/categories`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "name": "Category Name",
    "slug": "category-slug",
    "type": "blog|project|reel"
  }
  ```

### Update/Delete Category
- **Endpoints**: `PUT /api/categories/[id]`, `DELETE /api/categories/[id]`

---

## 6. Utilities

### File Upload
Uploads a file to Cloudinary.
- **Endpoint**: `POST /api/upload`
- **Auth Required**: Yes
- **Request Body**: `multipart/form-data`
  - `file`: The file to upload
  - `folder`: (Optional) Cloudinary folder path
- **Response**: `200 OK` with Cloudinary secure URL.

### Dashboard Stats
Fetches counts for various entities.
- **Endpoint**: `GET /api/stats`
- **Query Parameters**:
  - `days`: Filter stats for last X days (e.g., `days=7`)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "blogs": 10,
      "projects": 5,
      "reels": 8,
      "categories": 4
    }
  }
  ```

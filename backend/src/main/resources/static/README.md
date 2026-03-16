# Static Resources Folder

## Purpose

The `static` folder in Spring Boot is used to serve static content (HTML, CSS, JavaScript, images) directly through the backend server.

## Why Do We Need This?

### 1. **Serve Static Files**
Spring Boot automatically serves files from this folder at the root URL:
- `static/index.html` → `http://localhost:8081/index.html`
- `static/css/style.css` → `http://localhost:8081/css/style.css`
- `static/images/logo.png` → `http://localhost:8081/images/logo.png`

### 2. **API Documentation Assets**
Swagger UI uses static resources for its interface

### 3. **File Uploads Storage**
Store uploaded files (songs, covers, profile pictures) that need to be publicly accessible

### 4. **Landing Pages**
Simple HTML pages for API documentation, health checks, or admin panels

---

## Folder Structure

```
static/
├── css/              # Stylesheets
├── js/               # JavaScript files
├── images/           # Images, icons, logos
├── uploads/          # User uploaded files
│   ├── songs/        # MP3 audio files
│   ├── covers/       # Album/song cover images
│   └── profiles/     # User profile pictures
└── index.html        # Default landing page (optional)
```

---

## Current Setup: Angular Frontend

**Important**: In our RevPlay project, we use **Angular** as the frontend, which runs separately on port 4200. The backend (port 8081) primarily serves as a REST API.

### Why Static Folder Still Matters:

1. **File Uploads**: Uploaded songs and images are stored here
2. **Swagger UI**: API documentation interface
3. **Production Build**: Angular build can be deployed here (optional)

---

## File Upload Configuration

In `application.properties`:

```properties
# Static resource locations
spring.web.resources.static-locations=classpath:/static/,file:songs/,file:covers/

# File upload settings
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

This allows:
- Serving files from `static/` folder
- Serving uploaded songs from `songs/` folder
- Serving cover images from `covers/` folder

---

## Accessing Static Files

### From Frontend (Angular):
```typescript
// Access uploaded song
const songUrl = 'http://localhost:8081/songs/song123.mp3';

// Access cover image
const coverUrl = 'http://localhost:8081/covers/album456.jpg';

// Access profile picture
const profileUrl = 'http://localhost:8081/profiles/user789.png';
```

### From Browser:
```
http://localhost:8081/songs/mysong.mp3
http://localhost:8081/covers/myalbum.jpg
http://localhost:8081/images/logo.png
```

---

## Security Considerations

### Public Access
Files in `static/` are publicly accessible without authentication.

### Protected Files
For files that require authentication:
1. Store outside `static/` folder
2. Create controller endpoint with security
3. Stream file through controller

Example:
```java
@GetMapping("/api/protected/song/{id}")
public ResponseEntity<Resource> getProtectedSong(@PathVariable Long id) {
    // Check authentication
    // Load file
    // Return as stream
}
```

---

## Production Deployment

### Option 1: Separate Frontend (Current Setup)
- Angular runs on separate server/CDN
- Backend only serves API + uploaded files
- **Recommended for scalability**

### Option 2: Embedded Frontend
- Build Angular: `ng build --prod`
- Copy `dist/` contents to `static/`
- Backend serves both API and frontend
- **Simpler deployment, single server**

To embed Angular:
```bash
cd frontend
ng build --prod
cp -r dist/revplay-frontend/* ../backend/src/main/resources/static/
```

Then access at: `http://localhost:8081/`

---

## Templates Folder

The `templates/` folder is for **server-side rendered HTML** using template engines like Thymeleaf.

### When to Use Templates:
- Email templates
- PDF generation
- Server-side rendered pages
- Admin dashboards

### Example (Thymeleaf):
```html
<!-- templates/email/welcome.html -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<body>
    <h1>Welcome, <span th:text="${username}">User</span>!</h1>
</body>
</html>
```

```java
@GetMapping("/welcome")
public String welcome(Model model) {
    model.addAttribute("username", "John");
    return "email/welcome"; // renders templates/email/welcome.html
}
```

---

## File Upload Example

### Controller:
```java
@PostMapping("/api/upload/song")
public ResponseEntity<String> uploadSong(@RequestParam("file") MultipartFile file) {
    String filename = fileStorageService.storeSong(file);
    String fileUrl = "http://localhost:8081/songs/" + filename;
    return ResponseEntity.ok(fileUrl);
}
```

### Service:
```java
public String storeSong(MultipartFile file) {
    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
    Path path = Paths.get("songs/" + filename);
    Files.copy(file.getInputStream(), path);
    return filename;
}
```

---

## Best Practices

### ✅ DO:
- Use `static/` for truly static content (CSS, JS, images)
- Use separate folders for different file types
- Generate unique filenames for uploads (UUID)
- Validate file types and sizes
- Set appropriate file size limits

### ❌ DON'T:
- Store sensitive files in `static/`
- Allow unlimited file uploads
- Use original filenames (security risk)
- Store large files without cleanup strategy
- Serve user-generated content without validation

---

## Cleanup Strategy

For uploaded files, implement cleanup:

```java
@Scheduled(cron = "0 0 2 * * ?") // Run at 2 AM daily
public void cleanupOrphanedFiles() {
    // Find files not referenced in database
    // Delete files older than X days
    // Log cleanup results
}
```

---

## Summary

| Folder | Purpose | Access | Example |
|--------|---------|--------|---------|
| `static/` | Public static files | Direct URL | CSS, JS, images |
| `static/uploads/` | User uploads | Direct URL | Songs, covers |
| `templates/` | Server-rendered HTML | Controller | Emails, PDFs |

**For RevPlay**:
- Frontend: Angular (separate, port 4200)
- Backend: REST API (port 8081)
- Static: File uploads + Swagger UI

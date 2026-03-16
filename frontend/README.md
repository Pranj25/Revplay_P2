# RevPlay Frontend

Angular 17 web application for the RevPlay music streaming platform.

## Technology Stack

- Angular 17
- TypeScript 5.2
- RxJS 7.8
- Standalone Components
- Angular Router
- HttpClient

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 17

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Angular CLI (if not already installed)

```bash
npm install -g @angular/cli@17
```

### 3. Environment Configuration

The application is configured to connect to the backend at `http://localhost:8081`.

To change the API URL, update:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

## Development

### Start Development Server

```bash
npm start
```

Or:
```bash
ng serve
```

The application will be available at: `http://localhost:4200`

### Build for Production

```bash
npm run build
```

Or:
```bash
ng build --configuration production
```

Build artifacts will be in the `dist/` directory.

### Run Tests

```bash
npm test
```

Or:
```bash
ng test
```

### Run Linting

```bash
ng lint
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # UI components
│   │   │   ├── albums/
│   │   │   ├── artists/
│   │   │   ├── error/           # 404 error page
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   ├── player/          # Music player
│   │   │   ├── playlists/
│   │   │   ├── profile/
│   │   │   ├── register/
│   │   │   └── songs/
│   │   ├── guards/              # Route guards
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/        # HTTP interceptors
│   │   │   └── auth.interceptor.ts
│   │   ├── services/            # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── player.service.ts
│   │   │   ├── song.service.ts
│   │   │   └── upload.service.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── assets/                  # Static assets
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.json
└── tsconfig.app.json
```

## Key Features

### Authentication
- User registration (User/Artist roles)
- Login with JWT tokens
- Token storage in localStorage
- HTTP interceptor for automatic token injection
- Route guards for protected routes

### Music Player
- HTML5 Audio API integration
- Play/Pause controls
- Seek functionality
- Volume control
- Current time and duration display
- Fixed bottom player UI
- Real MP3 audio streaming

### File Upload
- MP3 audio file upload
- Cover image upload
- Profile picture upload
- File validation

### Routing
- Home page
- Songs library
- Artists directory
- Albums collection
- Playlists management
- User profile
- Login/Register pages
- 404 error page

## Components

### HomeComponent
Landing page with navigation to main sections.

### LoginComponent
User authentication form with email/username and password.

### RegisterComponent
User registration form with role selection (User/Artist).

### SongsComponent
Display all songs in a grid layout with click-to-play functionality.

### PlayerComponent
Fixed bottom music player with:
- Song information display
- Play/Pause button
- Progress bar with seek
- Volume control
- Time display

### ErrorComponent
Custom 404 page for invalid routes.

## Services

### AuthService
- User registration
- User login
- Token management
- User state management with signals
- Logout functionality

### PlayerService
- Audio playback control
- Play/Pause toggle
- Seek functionality
- Volume control
- Current song state management
- Audio event handling

### SongService
- Fetch all songs
- Get song by ID
- Create new song

### UploadService
- Upload audio files
- Upload cover images
- Upload profile pictures

## Guards

### authGuard
Protects routes that require authentication. Redirects to login if user is not authenticated.

## Interceptors

### authInterceptor
Automatically adds JWT token to all HTTP requests in the Authorization header.

## Styling

The application uses a dark theme inspired by modern music streaming platforms:
- Background: `#121212`
- Cards: `#282828`
- Accent: `#1db954` (Spotify green)
- Text: `#ffffff`

## Environment Variables

### Development (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api'
};
```

### Production (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

## Building for Production

### Build
```bash
ng build --configuration production
```

### Serve with a Static Server
```bash
npm install -g http-server
cd dist/revplay-frontend
http-server -p 4200
```

### Deploy to Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist/revplay-frontend;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8081;
    }
}
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4200
npx kill-port 4200

# Or use different port
ng serve --port 4201
```

### CORS Issues
Ensure backend CORS configuration allows `http://localhost:4200`.

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Angular cache
rm -rf .angular
ng build
```

## Development Tips

### Hot Reload
The development server supports hot module replacement. Changes to TypeScript files will automatically reload the browser.

### Debugging
Use Angular DevTools browser extension for debugging:
- Chrome: Angular DevTools
- Firefox: Angular DevTools

### Code Generation
```bash
# Generate component
ng generate component components/my-component

# Generate service
ng generate service services/my-service

# Generate guard
ng generate guard guards/my-guard
```

## Testing

### Unit Tests
```bash
ng test
```

### E2E Tests
```bash
ng e2e
```

### Test Coverage
```bash
ng test --code-coverage
```

View coverage report:
```bash
open coverage/index.html
```

## Performance Optimization

### Lazy Loading
Consider implementing lazy loading for feature modules:
```typescript
{
  path: 'songs',
  loadComponent: () => import('./components/songs/songs.component')
    .then(m => m.SongsComponent)
}
```

### Production Build Optimization
- Ahead-of-Time (AOT) compilation
- Tree shaking
- Minification
- Bundle optimization

## Contributing

1. Create feature branch
2. Follow Angular style guide
3. Write unit tests
4. Update documentation
5. Submit pull request

## License

MIT

# RevPlay Backend

Spring Boot REST API for the RevPlay music streaming application.

## Technology Stack

- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Swagger/OpenAPI 3
- Maven
- Lombok

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- PostgreSQL 14+

## Setup

### 1. Database Configuration

Create PostgreSQL database:
```sql
CREATE DATABASE revplay;
```

Run the schema:
```bash
psql -U postgres -d revplay -f ../database/schema.sql
```

### 2. Application Configuration

Copy and configure application properties:
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Update database credentials in `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/revplay
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Build and Run

Build the project:
```bash
mvn clean install
```

Run the application:
```bash
mvn spring-boot:run
```

Or run with specific profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The API will be available at: `http://localhost:8081`

## API Documentation

Once the application is running, access Swagger UI at:
```
http://localhost:8081/swagger-ui.html
```

API docs JSON:
```
http://localhost:8081/api-docs
```

## Testing

Run all tests:
```bash
mvn test
```

Run tests with coverage:
```bash
mvn test jacoco:report
```

View coverage report:
```bash
open target/site/jacoco/index.html
```

Run specific test class:
```bash
mvn test -Dtest=SongControllerTest
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/revplay/
│   │   │   ├── config/           # Configuration classes
│   │   │   │   ├── FileUploadConfig.java
│   │   │   │   ├── OpenApiConfig.java
│   │   │   │   └── WebMvcConfig.java
│   │   │   ├── controller/       # REST controllers
│   │   │   │   ├── AlbumController.java
│   │   │   │   ├── ArtistController.java
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── FileUploadController.java
│   │   │   │   ├── PlaylistController.java
│   │   │   │   ├── SongController.java
│   │   │   │   └── UserController.java
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── AuthRequest.java
│   │   │   │   ├── AuthResponse.java
│   │   │   │   └── UserDTO.java
│   │   │   ├── exception/        # Exception handling
│   │   │   │   ├── ErrorResponse.java
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── ResourceNotFoundException.java
│   │   │   ├── interceptor/      # HTTP interceptors
│   │   │   │   └── LoggingInterceptor.java
│   │   │   ├── model/            # JPA entities
│   │   │   │   ├── Album.java
│   │   │   │   ├── Artist.java
│   │   │   │   ├── Favorite.java
│   │   │   │   ├── ListeningHistory.java
│   │   │   │   ├── Playlist.java
│   │   │   │   ├── PlaylistFollower.java
│   │   │   │   ├── Song.java
│   │   │   │   └── User.java
│   │   │   ├── repository/       # Spring Data repositories
│   │   │   │   ├── AlbumRepository.java
│   │   │   │   ├── ArtistRepository.java
│   │   │   │   ├── FavoriteRepository.java
│   │   │   │   ├── PlaylistRepository.java
│   │   │   │   ├── SongRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── security/         # Security configuration
│   │   │   │   ├── JwtAuthFilter.java
│   │   │   │   ├── JwtUtil.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── service/          # Business logic
│   │   │   │   └── FileStorageService.java
│   │   │   └── RevPlayApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── application-test.properties
│   └── test/                     # Unit and integration tests
│       ├── java/com/revplay/
│       │   ├── controller/
│       │   ├── security/
│       │   └── service/
│       └── resources/
└── pom.xml
```

## Key Features

### Authentication & Security
- JWT-based authentication
- Role-based access control (USER, ARTIST)
- Password encryption with BCrypt
- Stateless session management

### File Management
- MP3 audio file upload (max 10MB)
- Image upload for covers and profiles (max 5MB)
- File type and size validation
- Organized file storage structure

### API Features
- RESTful API design
- Swagger/OpenAPI documentation
- Global exception handling
- Request/response logging
- CORS configuration

### Database
- PostgreSQL with JPA/Hibernate
- Entity relationships
- Database migrations
- Connection pooling

## Environment Profiles

### Development (dev)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
- Debug logging enabled
- SQL queries visible
- Auto DDL update

### Production (prod)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```
- Info logging only
- SQL queries hidden
- DDL validation only
- Environment variables for sensitive data

### Test
```bash
mvn test
```
- H2 in-memory database
- Test-specific configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### File Upload
- `POST /api/upload/audio` - Upload MP3 file
- `POST /api/upload/cover` - Upload cover image
- `POST /api/upload/profile` - Upload profile picture

### Songs
- `GET /api/songs` - Get all public songs
- `GET /api/songs/{id}` - Get song by ID
- `POST /api/songs` - Create new song (Artist only)
- `PUT /api/songs/{id}/play` - Increment play count

### Albums
- `GET /api/albums` - Get all albums
- `GET /api/albums/{id}` - Get album by ID
- `POST /api/albums` - Create album (Artist only)

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/{id}` - Get artist profile

### Playlists
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create playlist

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

## Configuration Properties

### Database
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/revplay
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### JWT
```properties
jwt.secret=your_secret_key
jwt.expiration=604800000
```

### File Upload
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
upload.path=./uploads
```

### Server
```properties
server.port=8081
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -d revplay
```

### Port Already in Use
```bash
# Find process using port 8081
lsof -i :8081

# Kill the process
kill -9 <PID>
```

### Build Failures
```bash
# Clean and rebuild
mvn clean install -U

# Skip tests
mvn clean install -DskipTests
```

## Contributing

1. Create feature branch
2. Write tests for new features
3. Ensure all tests pass
4. Update documentation
5. Submit pull request

## License

MIT

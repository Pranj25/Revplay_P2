# 🎵 RevPlay – Phase 2

### Full Stack Music Streaming Web Application

## 📌 Application Overview

**RevPlay** is a full-stack music streaming web application that allows users to explore and listen to songs, artists, albums, playlists.

The platform provides an integrated **web music player**, music discovery tools, playlist management, and artist analytics. The application supports 
**role-based access**, allowing both **listeners** and **musicians/artists** to interact with the system.

The system is built using **Spring Boot (backend), Angular (frontend), and MySQL (database)** with a responsive and scalable architecture.

---

# 🛠 Technology Stack

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Maven
* Log4J (Logging)
* JUnit4 (Unit Testing)

### Frontend

* Angular
* TypeScript
* HTML5
* SCSS
* RxJS

### Database

* MySQL

### Tools

* Git & GitHub
* Postman
* VS Code / Ecllipse IDE

---

# 👤 User Roles

The system supports two main roles:

### 1️⃣ Listener (User)

Users who listen to music and manage their playlists.

### 2️⃣ Artist (Musician)

Artists who upload songs, create albums, and track engagement analytics.

---

# 🎧 Core Functional Requirements

## 👤 Listener Features

### Authentication & Profile

* Register using email, username, and password
* View and update profile information
* View account statistics:

  * Total playlists
  * Favorite songs

### Music Discovery & Search

* Browse music library
* Search songs, artists, albums, playlists
* Filter songs by:

  * Genre
  * Artist
  * Album
* View song details
* View artist profiles
* View album details 

### Music Player & Playback

* Play songs using integrated web player
* Player controls:

  * Play
  * Pause
  * Skip forward/backward
* Playback queue management
* Volume control

### Favorites & Collections

* Add songs to favorites
* Remove songs from favorites
* View all favorite songs
* Quick access from player

### Playlist Management

* Create playlists
* Add songs
* Update playlist details
* Public/private playlists

### Listening History

* View recently played songs
* View complete listening history
* Clear listening history

---

# 🎤 Artist Features

Artists have **all listener features plus additional functionality**.

### Artist Profile Management

* Register as an artist
* Create artist profile

### Music Upload & Management

* Upload songs
* Upload album 
* Create albums
* Add songs from albums
* Update song information
* Manage song visibility

### Analytics & Insights

Artists can view statistics including:

* Total songs uploaded
* Total plays
* Total favorites
* Most popular songs
* Listening trends
* Top listeners
* Users who favorited songs

---

# 🎵 Music Player Features

* Integrated web audio player
* Playback queue management
* Progress bar and seek control
* Real-time song playback status

---

# 🗄 Database Management

The application uses **MySQL** for persistent storage.

Main entities include:

* Users
* Artists
* Songs
* Albums
* Playlists
* Favorites
* Listening History

An **ERD (Entity Relationship Diagram)** is included in the project documentation.

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/revplay.git
cd revplay
```

---

## 2️⃣ Backend Setup (Spring Boot)(Example)

Navigate to backend folder:

```bash
cd backend
```

Run the application:

```bash
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8081
```

---

## 3️⃣ Database Setup

Create database:

```sql
CREATE DATABASE revplay_db;
```

Update `application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/revplay_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```

---

## 4️⃣ Frontend Setup (Angular)

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run Angular application:

```bash
ng serve
```

Frontend runs on:

```
http://localhost:4200
```

---

# 🧪 Testing

Testing is implemented using:

* **JUnit4** for backend unit testing
* **Postman** for API testing

---

# 📊 Logging

Application logging is implemented using **Log4J**, allowing monitoring of application events, errors, and debugging information.

---

# 📈 Definition of Done

The project includes:

✔ Working Web Application
✔ Backend APIs with Spring Boot
✔ Angular Frontend
✔ Database Integration with MySQL
✔ Git Repository Submission
✔ Entity Relationship Diagram (ERD)
✔ Application Architecture Diagram
✔ README Documentation
✔ Unit Testing Artifacts

---

# 👨‍💻 Contributor

**Pranjal Sanjay Palpattuwar**
Full Stack Java Developer

Skills Used:

* Java
* Spring Boot
* Angular
* MySQL
* REST APIs
* Git

---

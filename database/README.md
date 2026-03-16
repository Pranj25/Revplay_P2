# RevPlay Database

PostgreSQL database schema and documentation for the RevPlay music streaming application.

## Database Information

- **Database Name**: revplay
- **DBMS**: PostgreSQL 14+
- **Character Set**: UTF-8

## Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE revplay;

# Connect to the database
\c revplay

# Run schema
\i schema.sql
```

Or using command line:
```bash
psql -U postgres -c "CREATE DATABASE revplay;"
psql -U postgres -d revplay -f schema.sql
```

### 2. Verify Installation

```sql
-- List all tables
\dt

-- Check table structure
\d users
\d songs
\d albums
```

## Database Schema

### Tables Overview

| Table | Description | Relationships |
|-------|-------------|---------------|
| users | User accounts | 1:1 with artists |
| artists | Artist profiles | 1:N with songs, albums |
| songs | Music tracks | N:1 with artists, albums |
| albums | Music albums | N:1 with artists |
| playlists | User playlists | N:1 with users |
| playlist_songs | Playlist-Song mapping | N:N junction table |
| favorites | User favorite songs | N:N junction table |
| listening_history | Play history | N:N with timestamps |
| playlist_followers | Playlist followers | N:N junction table |

### Entity Relationship Diagram

```
┌─────────┐       ┌─────────┐       ┌─────────┐
│  Users  │──1:1──│ Artists │──1:N──│  Songs  │
└─────────┘       └─────────┘       └─────────┘
     │                 │                  │
     │                 │                  │
     │            ┌─────────┐             │
     │            │ Albums  │─────────────┘
     │            └─────────┘
     │
     │            ┌───────────┐
     └────1:N────│ Playlists │
                 └───────────┘
```

## Table Details

### users
Stores user account information.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR UNIQUE NOT NULL)
- `username` (VARCHAR UNIQUE NOT NULL)
- `password` (VARCHAR NOT NULL) - BCrypt hashed
- `display_name` (VARCHAR)
- `bio` (TEXT)
- `profile_picture` (VARCHAR)
- `role` (VARCHAR) - 'user' or 'artist'
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### artists
Artist profile information.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER UNIQUE FK → users.id)
- `artist_name` (VARCHAR NOT NULL)
- `bio` (TEXT)
- `genre` (VARCHAR)
- `profile_picture` (VARCHAR)
- `banner_image` (VARCHAR)
- `instagram`, `twitter`, `youtube`, `spotify`, `website` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### songs
Music track information.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR NOT NULL)
- `genre` (VARCHAR)
- `duration` (INTEGER NOT NULL) - in seconds
- `audio_file` (VARCHAR NOT NULL) - file path
- `cover_image` (VARCHAR)
- `visibility` (VARCHAR) - 'public' or 'unlisted'
- `play_count` (INTEGER DEFAULT 0)
- `artist_id` (INTEGER FK → artists.id)
- `album_id` (INTEGER FK → albums.id)
- `created_at`, `updated_at` (TIMESTAMP)

### albums
Album collections.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR NOT NULL)
- `description` (TEXT)
- `cover_art` (VARCHAR)
- `release_date` (DATE)
- `artist_id` (INTEGER FK → artists.id)
- `created_at`, `updated_at` (TIMESTAMP)

### playlists
User-created playlists.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR NOT NULL)
- `description` (TEXT)
- `is_public` (BOOLEAN DEFAULT false)
- `user_id` (INTEGER FK → users.id)
- `created_at`, `updated_at` (TIMESTAMP)

### playlist_songs
Many-to-many relationship between playlists and songs.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `playlist_id` (INTEGER FK → playlists.id)
- `song_id` (INTEGER FK → songs.id)
- `position` (INTEGER) - order in playlist
- `added_at` (TIMESTAMP)

### favorites
User favorite songs.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FK → users.id)
- `song_id` (INTEGER FK → songs.id)
- `created_at` (TIMESTAMP)

### listening_history
Track user listening activity.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FK → users.id)
- `song_id` (INTEGER FK → songs.id)
- `played_at` (TIMESTAMP)

### playlist_followers
Users following public playlists.

**Columns:**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FK → users.id)
- `playlist_id` (INTEGER FK → playlists.id)
- `followed_at` (TIMESTAMP)

## Indexes

Performance indexes are created on:
- `songs.artist_id`
- `songs.album_id`
- `playlists.user_id`
- `favorites.user_id`
- `listening_history.user_id`
- `listening_history.played_at`

## Constraints

### Foreign Keys
All foreign keys have `ON DELETE CASCADE` or `ON DELETE SET NULL` constraints.

### Unique Constraints
- `users.email`
- `users.username`
- `artists.user_id`
- `favorites(user_id, song_id)`
- `playlist_songs(playlist_id, song_id)`
- `playlist_followers(user_id, playlist_id)`

### Check Constraints
- `users.role` IN ('user', 'artist')
- `songs.visibility` IN ('public', 'unlisted')

## Sample Queries

### Get all songs by an artist
```sql
SELECT s.*, a.artist_name 
FROM songs s
JOIN artists a ON s.artist_id = a.id
WHERE a.id = 1;
```

### Get user's playlists with song count
```sql
SELECT p.*, COUNT(ps.song_id) as song_count
FROM playlists p
LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
WHERE p.user_id = 1
GROUP BY p.id;
```

### Get most played songs
```sql
SELECT s.*, a.artist_name
FROM songs s
JOIN artists a ON s.artist_id = a.id
ORDER BY s.play_count DESC
LIMIT 10;
```

### Get user's listening history
```sql
SELECT s.title, a.artist_name, lh.played_at
FROM listening_history lh
JOIN songs s ON lh.song_id = s.id
JOIN artists a ON s.artist_id = a.id
WHERE lh.user_id = 1
ORDER BY lh.played_at DESC
LIMIT 50;
```

## Backup and Restore

### Backup Database
```bash
pg_dump -U postgres revplay > revplay_backup.sql
```

### Restore Database
```bash
psql -U postgres revplay < revplay_backup.sql
```

### Backup with Compression
```bash
pg_dump -U postgres -Fc revplay > revplay_backup.dump
```

### Restore from Compressed Backup
```bash
pg_restore -U postgres -d revplay revplay_backup.dump
```

## Maintenance

### Analyze Tables
```sql
ANALYZE;
```

### Vacuum Database
```sql
VACUUM ANALYZE;
```

### Check Database Size
```sql
SELECT pg_size_pretty(pg_database_size('revplay'));
```

### Check Table Sizes
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Security

### Create Application User
```sql
CREATE USER revplay_app WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE revplay TO revplay_app;
GRANT USAGE ON SCHEMA public TO revplay_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO revplay_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO revplay_app;
```

### Revoke Permissions
```sql
REVOKE ALL ON DATABASE revplay FROM PUBLIC;
```

## Troubleshooting

### Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Permission Denied
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE revplay TO your_user;
```

### Reset Sequences
```sql
-- Reset auto-increment sequences
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('songs_id_seq', (SELECT MAX(id) FROM songs));
```

## License

MIT

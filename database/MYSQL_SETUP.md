# MySQL Setup Guide for RevPlay

## Installation

### Windows
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run the installer
3. Choose "Developer Default" setup type
4. Set root password
5. Complete installation

### macOS
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

## Database Setup

### 1. Login to MySQL
```bash
mysql -u root -p
```

### 2. Create Database
```sql
CREATE DATABASE revplayProject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Create User (Optional but recommended)
```sql
CREATE USER 'revplay_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON revplayProject.* TO 'revplay_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Use Database
```sql
USE revplayProject;
```

### 5. Run Schema
```bash
# Exit MySQL first
exit

# Run schema file
mysql -u root -p revplayProject < schema.sql
```

Or copy-paste the schema.sql content directly in MySQL:
```bash
mysql -u root -p revplayProject
# Then paste the content of schema.sql
```

### 6. Verify Tables
```sql
USE revplayProject;
SHOW TABLES;
```

You should see:
- users
- artists
- songs
- albums
- playlists
- playlist_songs
- favorites
- listening_history
- playlist_followers

## Configuration

### Update Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/revplayProject?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=PranjalP@2003
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

If you created a custom user:
```properties
spring.datasource.username=revplay_user
spring.datasource.password=your_secure_password
```

## Verification

### Check Connection
```sql
mysql -u root -p revplayProject -e "SELECT 'Connection successful!' as status;"
```

### Check Tables
```sql
mysql -u root -p revplayProject -e "SHOW TABLES;"
```

### Insert Test Data
```sql
USE revplayProject;

-- Insert test user
INSERT INTO users (email, username, password, role) 
VALUES ('test@example.com', 'testuser', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'user');

-- Verify
SELECT * FROM users;
```

## Common Issues

### Issue: Access Denied
```bash
# Reset root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
exit
```

### Issue: Can't connect to MySQL server
```bash
# Check if MySQL is running
sudo systemctl status mysql  # Linux
brew services list           # macOS

# Start MySQL
sudo systemctl start mysql   # Linux
brew services start mysql    # macOS
```

### Issue: Unknown database 'revplayProject'
```sql
-- Create database again
CREATE DATABASE revplayProject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Issue: Table doesn't exist
```bash
# Re-run schema
mysql -u root -p revplayProject < schema.sql
```

## MySQL Workbench (GUI Tool)

### Installation
Download from: https://dev.mysql.com/downloads/workbench/

### Connect to Database
1. Open MySQL Workbench
2. Click "+" to create new connection
3. Enter:
   - Connection Name: RevPlay
   - Hostname: localhost
   - Port: 3306
   - Username: root
4. Test Connection
5. Click OK

### Run Schema
1. Open connection
2. File → Open SQL Script
3. Select schema.sql
4. Click Execute (⚡ icon)

## Backup and Restore

### Backup Database
```bash
mysqldump -u root -p revplayProject > revplay_backup.sql
```

### Restore Database
```bash
mysql -u root -p revplayProject < revplay_backup.sql
```

### Backup with Compression
```bash
mysqldump -u root -p revplayProject | gzip > revplay_backup.sql.gz
```

### Restore from Compressed Backup
```bash
gunzip < revplay_backup.sql.gz | mysql -u root -p revplayProject
```

## Performance Tuning

### Check Table Sizes
```sql
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'revplayProject'
ORDER BY (data_length + index_length) DESC;
```

### Optimize Tables
```sql
OPTIMIZE TABLE users, artists, songs, albums, playlists;
```

### Check Indexes
```sql
SHOW INDEX FROM songs;
SHOW INDEX FROM users;
```

## Security Best Practices

1. **Use Strong Passwords**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'VeryStr0ng!P@ssw0rd';
```

2. **Remove Anonymous Users**
```sql
DELETE FROM mysql.user WHERE User='';
FLUSH PRIVILEGES;
```

3. **Disable Remote Root Login**
```sql
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
FLUSH PRIVILEGES;
```

4. **Create Limited User for Application**
```sql
CREATE USER 'revplay_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON revplayProject.* TO 'revplay_app'@'localhost';
FLUSH PRIVILEGES;
```

## Monitoring

### Check Active Connections
```sql
SHOW PROCESSLIST;
```

### Check Database Size
```sql
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'revplayProject'
GROUP BY table_schema;
```

### Check Slow Queries
```sql
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
```

## Useful Commands

```sql
-- Show all databases
SHOW DATABASES;

-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE users;

-- Show table creation SQL
SHOW CREATE TABLE songs;

-- Count records
SELECT COUNT(*) FROM songs;

-- Show MySQL version
SELECT VERSION();

-- Show current user
SELECT USER();

-- Show database size
SELECT 
    SUM(data_length + index_length) / 1024 / 1024 AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'revplayProject';
```

## Troubleshooting Connection from Spring Boot

### Test Connection
```java
// Add this to RevPlayApplication.java main method
try (Connection conn = DriverManager.getConnection(
    "jdbc:mysql://localhost:3306/revplayProject?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC",
    "root",
    "PranjalP@2003")) {
    System.out.println("Database connection successful!");
} catch (Exception e) {
    System.err.println("Database connection failed: " + e.getMessage());
}
```

### Enable MySQL Logging
Edit `my.cnf` or `my.ini`:
```ini
[mysqld]
general_log = 1
general_log_file = /var/log/mysql/mysql.log
```

## Migration from PostgreSQL

If you had PostgreSQL data:

1. Export PostgreSQL data:
```bash
pg_dump -U postgres revplayProject > postgres_data.sql
```

2. Convert to MySQL format (manual adjustments needed):
- Change SERIAL to INT AUTO_INCREMENT
- Change BOOLEAN to TINYINT(1)
- Change TEXT to TEXT
- Adjust date/time functions

3. Import to MySQL:
```bash
mysql -u root -p revplayProject < converted_data.sql
```

## Support

For MySQL issues:
- Official Documentation: https://dev.mysql.com/doc/
- Community Forums: https://forums.mysql.com/
- Stack Overflow: https://stackoverflow.com/questions/tagged/mysql

## License

MySQL Community Edition is GPL licensed.

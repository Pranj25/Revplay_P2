-- Clean up artists with email addresses or invalid names
-- Run this script to remove artists that were created from user registration

-- First, let's see what we have
SELECT * FROM artists WHERE artist_name LIKE '%@%' OR artist_name LIKE '%.com%';

-- Delete artists with email addresses in their names
-- WARNING: This will also delete any songs associated with these artists
-- Make sure to backup your database first!

-- Option 1: Delete only artists with email addresses (safer)
DELETE FROM artists 
WHERE artist_name LIKE '%@%' 
   OR artist_name LIKE '%.com%'
   OR artist_name LIKE '%example%';

-- Option 2: Keep only artists that have songs
-- This will remove any artist without songs
DELETE FROM artists 
WHERE id NOT IN (
    SELECT DISTINCT artist_id 
    FROM songs 
    WHERE artist_id IS NOT NULL
);

-- After cleanup, verify the remaining artists
SELECT * FROM artists;

-- If you want to start fresh with artists, you can:
-- 1. Delete all artists
-- DELETE FROM artists;
-- 
-- 2. Then re-upload your songs
-- The system will automatically create clean artist entries from the song uploads

-- Migration: Add phone field to users table
-- Date: 2025-08-14

ALTER TABLE users ADD COLUMN phone VARCHAR(20);


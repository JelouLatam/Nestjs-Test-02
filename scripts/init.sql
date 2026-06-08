-- MySQL Initialization Script
-- This script runs automatically when MySQL container starts

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS todoapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user if it doesn't exist
CREATE USER IF NOT EXISTS 'todouser'@'%' IDENTIFIED BY 'todopassword';

-- Grant privileges
GRANT ALL PRIVILEGES ON todoapp.* TO 'todouser'@'%';
FLUSH PRIVILEGES;

-- Use the database
USE todoapp;

-- Set timezone
SET time_zone = '+00:00';
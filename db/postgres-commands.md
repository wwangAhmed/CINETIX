# CINETIX CINEMA BACKEND & DEPLOYMENT GUIDE

This document provides complete instructions and commands for running SQLite, PostgreSQL, deploying to Vercel, and backing up to Google Drive.

---

## 1. PostgreSQL Terminal Commands

### A. Connect to your PostgreSQL instance using `psql`
```bash
# Connect using connection URI
psql "postgres://username:password@localhost:5432/cinetix_db"

# Or using host parameters
psql -h localhost -p 5432 -U postgres -d cinetix_db
```

### B. Create Database and Run Migrations
```sql
-- Inside psql
CREATE DATABASE cinetix_db;
\c cinetix_db;
```

From terminal, pipe the provided `schema.sql` and `seed.sql`:
```bash
# Execute schema DDL
psql "postgres://username:password@localhost:5432/cinetix_db" -f db/schema.sql

# Execute seed data
psql "postgres://username:password@localhost:5432/cinetix_db" -f db/seed.sql
```

### C. Useful PostgreSQL Queries
```sql
-- Check total revenue and bookings per movie
SELECT 
    movie_title, 
    COUNT(*) AS total_tickets, 
    SUM(total_amount) AS revenue,
    screen_format
FROM bookings
WHERE status = 'confirmed'
GROUP BY movie_title, screen_format
ORDER BY revenue DESC;

-- Query available showtimes with theater details
SELECT 
    m.title, 
    t.name AS theater, 
    s.show_time, 
    s.screen_format, 
    s.ticket_price, 
    s.available_seats
FROM showtimes s
JOIN movies m ON s.movie_id = m.id
JOIN theaters t ON s.theater_id = t.id
ORDER BY s.ticket_price ASC;
```

---

## 2. SQLite CLI Commands

If you prefer local file-based SQLite:
```bash
# 1. Open or create database file
sqlite3 cinetix.db

# 2. Run schema and seed
sqlite3 cinetix.db < db/schema.sql
sqlite3 cinetix.db < db/seed.sql

# 3. Inspect tables
sqlite3 cinetix.db ".tables"
sqlite3 cinetix.db "SELECT id, title, rating FROM movies;"
```

---

## 3. Deploying to Vercel

The application is preconfigured with `vercel.json` for seamless Vite SPA routing and zero-config deployment.

### A. Deploy using Vercel CLI
```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy preview build
vercel

# Deploy to production
vercel --prod
```

### B. Deploy using Git (GitHub / GitLab / Bitbucket)
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: Cinetix amber revamp, dynamic SQLite DB, and full payment system"
   git push origin main
   ```
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Framework Preset: **Vite**.
5. Root Directory: `./` (default).
6. Build Command: `vite build` (or `npm run build`).
7. Output Directory: `dist`.
8. Click **Deploy**!

---

## 4. Google Drive Backup / Upload Instructions

### Option 1: One-Click Zip Archive for Google Drive
You can archive the complete codebase into a single zip file ready to drag-and-drop into Google Drive:
```powershell
# PowerShell command to package clean repository into Cinetix_CinemaMax_Build.zip
Compress-Archive -Path * -Exclude @("node_modules", ".git", "dist") -DestinationPath "..\Cinetix_CinemaMax_Build.zip" -Force
```
Then simply open [Google Drive](https://drive.google.com) in your browser and drag `Cinetix_CinemaMax_Build.zip` into your desired folder.

### Option 2: Using Google Drive CLI (`gdrive` / `rclone`)
If you have `rclone` or `gdrive` configured on your workstation:
```bash
# With rclone
rclone copy ../Cinetix_CinemaMax_Build.zip gdrive:CinemaMax_Backups/

# With gdrive CLI
gdrive upload ../Cinetix_CinemaMax_Build.zip
```

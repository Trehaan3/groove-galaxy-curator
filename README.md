
# Groove Galaxy - Playlist Manager

A simple playlist manager app that allows users to create and manage music playlists.

## Features

- Create and delete playlists
- Add and remove songs from playlists
- Search for songs and artists

## Tech Stack

- Frontend: React, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express
- Database: MySQL

## Setup Instructions

### Database Setup

The application requires a MySQL database named `qrate` with the following tables:
- `playlists`
- `songs`
- `albums`
- `song_playlist`
- `artists`

The database connection uses the following parameters:
- Host: localhost
- User: root
- Password: Nat!haan01
- Database: qrate

### Running the Backend Server

1. Navigate to the server directory:
```sh
cd src/server
```

2. Install dependencies:
```sh
npm install
```

3. Start the server:
```sh
npm start
```

The server will run on http://localhost:3001

### Running the Frontend

In a separate terminal:

1. Install dependencies (from the project root):
```sh
npm install
```

2. Start the development server:
```sh
npm run dev
```

The application will be available at http://localhost:8080

## API Endpoints

### Playlists
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create a new playlist
- `DELETE /api/playlists/:id` - Delete a playlist

### Songs
- `GET /api/playlists/:id/songs` - Get songs in a playlist
- `POST /api/playlists/:id/songs` - Add a song to a playlist
- `DELETE /api/playlists/:playlistId/songs/:songId` - Remove a song from a playlist

### Search
- `GET /api/search?q=query` - Search for songs and artists

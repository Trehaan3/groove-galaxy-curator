
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Nat!haan01',
  database: 'qrate',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get the promise-based interface
const promisePool = pool.promise();

// API Routes
// Get all playlists
app.get('/api/playlists', async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT playlist_id as id, name, description FROM playlists'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Create a playlist
app.post('/api/playlists', async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Playlist name is required' });
  }
  
  try {
    const [result] = await promisePool.query(
      'INSERT INTO playlists (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    
    const [newPlaylist] = await promisePool.query(
      'SELECT playlist_id as id, name, description FROM playlists WHERE playlist_id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newPlaylist[0]);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// Delete a playlist
app.delete('/api/playlists/:id', async (req, res) => {
  const playlistId = parseInt(req.params.id);
  
  if (isNaN(playlistId)) {
    return res.status(400).json({ error: 'Invalid playlist ID' });
  }

  try {
    // First delete from song_playlist junction table
    await promisePool.query('DELETE FROM song_playlist WHERE playlist_id = ?', [playlistId]);
    
    // Then delete the playlist
    const [result] = await promisePool.query('DELETE FROM playlists WHERE playlist_id = ?', [playlistId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

// Get songs in a playlist
app.get('/api/playlists/:id/songs', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await promisePool.query(
      `SELECT s.song_id as id, s.title, s.artist_name, s.album_name
       FROM songs s
       JOIN song_playlist sp ON s.song_id = sp.song_id
       WHERE sp.playlist_id = ?`,
      [id]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching playlist songs:', error);
    res.status(500).json({ error: 'Failed to fetch playlist songs' });
  }
});

// Add song to playlist
app.post('/api/playlists/:id/songs', async (req, res) => {
  const playlistId = parseInt(req.params.id);
  const songId = parseInt(req.body.songId);
  
  if (isNaN(playlistId) || isNaN(songId)) {
    return res.status(400).json({ error: 'Invalid playlist or song ID' });
  }
  
  try {
    // Check if the song is already in the playlist
    const [existing] = await promisePool.query(
      'SELECT * FROM song_playlist WHERE playlist_id = ? AND song_id = ?',
      [playlistId, songId]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Song is already in the playlist' });
    }
    
    await promisePool.query(
      'INSERT INTO song_playlist (playlist_id, song_id, date_added) VALUES (?, ?, CURDATE())',
      [playlistId, songId]
    );
    
    res.status(201).json({ message: 'Song added to playlist successfully' });
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).json({ error: 'Failed to add song to playlist' });
  }
});

// Remove song from playlist
app.delete('/api/playlists/:playlistId/songs/:songId', async (req, res) => {
  const { playlistId, songId } = req.params;
  
  try {
    const [result] = await promisePool.query(
      'DELETE FROM song_playlist WHERE playlist_id = ? AND song_id = ?',
      [playlistId, songId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Song not found in playlist' });
    }
    
    res.status(200).json({ message: 'Song removed from playlist successfully' });
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({ error: 'Failed to remove song from playlist' });
  }
});

// Search for songs and artists
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  try {
    // Search for songs with their details
    const [songs] = await promisePool.query(
      `SELECT song_id as id, title, artist_name, album_name
       FROM songs
       WHERE title LIKE ? OR artist_name LIKE ?`,
      [`%${q}%`, `%${q}%`]
    );
    
    res.json({ songs, artists: [] });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


import { toast } from "sonner";

const API_URL = "http://localhost:3001/api";

interface Playlist {
  id: number;  // maps to playlist_id
  name: string;
  description?: string;
}

interface Song {
  id: number;  // maps to song_id
  title: string;
  artist_name: string;
  album_name?: string;
}

export const api = {
  // Playlist actions
  async getPlaylists(): Promise<Playlist[]> {
    try {
      const response = await fetch(`${API_URL}/playlists`);
      if (!response.ok) throw new Error("Failed to fetch playlists");
      return await response.json();
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error("Failed to load playlists");
      return [];
    }
  },

  async createPlaylist(name: string, description?: string): Promise<Playlist | null> {
    try {
      const response = await fetch(`${API_URL}/playlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      
      if (!response.ok) throw new Error("Failed to create playlist");
      
      const playlist = await response.json();
      toast.success("Playlist created successfully");
      return playlist;
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast.error("Failed to create playlist");
      return null;
    }
  },

  async deletePlaylist(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/playlists/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete playlist");
      
      toast.success("Playlist deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error("Failed to delete playlist");
      return false;
    }
  },

  // Song actions
  async getPlaylistSongs(playlistId: number): Promise<Song[]> {
    try {
      const response = await fetch(`${API_URL}/playlists/${playlistId}/songs`);
      if (!response.ok) throw new Error("Failed to fetch playlist songs");
      return await response.json();
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      toast.error("Failed to load songs");
      return [];
    }
  },

  async addSongToPlaylist(playlistId: number, songId: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/playlists/${playlistId}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      });
      
      if (!response.ok) throw new Error("Failed to add song to playlist");
      
      toast.success("Song added to playlist");
      return true;
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      toast.error("Failed to add song to playlist");
      return false;
    }
  },

  async removeSongFromPlaylist(playlistId: number, songId: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/playlists/${playlistId}/songs/${songId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to remove song from playlist");
      
      toast.success("Song removed from playlist");
      return true;
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      toast.error("Failed to remove song from playlist");
      return false;
    }
  },

  // Search
  async searchSongsAndArtists(query: string): Promise<{ songs: Song[], artists: any[] }> {
    try {
      const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to search");
      return await response.json();
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Search failed");
      return { songs: [], artists: [] };
    }
  },
};

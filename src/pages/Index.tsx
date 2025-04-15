
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/services/api";
import PlaylistForm from "@/components/PlaylistForm";
import PlaylistItem from "@/components/PlaylistItem";
import SongItem from "@/components/SongItem";
import SearchBar from "@/components/SearchBar";
import { Music, ListMusic, Search } from "lucide-react";

interface Playlist {
  id: number;
  name: string;
  description?: string;
}

interface Song {
  id: number;
  title: string;
  artist_name: string;
  album_name?: string;
}

interface Artist {
  id: number;
  name: string;
}

const Index = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [searchResults, setSearchResults] = useState<{ songs: Song[], artists: Artist[] }>({ songs: [], artists: [] });
  const [activeTab, setActiveTab] = useState("playlists");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch playlists on mount
  useEffect(() => {
    fetchPlaylists();
  }, []);

  // Fetch playlist songs when a playlist is selected
  useEffect(() => {
    if (selectedPlaylistId) {
      fetchPlaylistSongs(selectedPlaylistId);
    } else {
      setPlaylistSongs([]);
    }
  }, [selectedPlaylistId]);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const fetchedPlaylists = await api.getPlaylists();
      setPlaylists(fetchedPlaylists);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlaylistSongs = async (playlistId: number) => {
    setIsLoading(true);
    try {
      const songs = await api.getPlaylistSongs(playlistId);
      setPlaylistSongs(songs);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaylistCreated = () => {
    fetchPlaylists();
  };

  const handlePlaylistDeleted = () => {
    fetchPlaylists();
    if (playlists.length > 0) {
      setSelectedPlaylistId(null);
    }
  };

  const handlePlaylistSelected = (id: number) => {
    setSelectedPlaylistId(id);
    setActiveTab("songs");
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const results = await api.searchSongsAndArtists(query);
      setSearchResults(results);
      setActiveTab("search");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSongToPlaylist = async (songId: number) => {
    if (!selectedPlaylistId) return;
    
    const success = await api.addSongToPlaylist(selectedPlaylistId, songId);
    if (success) {
      fetchPlaylistSongs(selectedPlaylistId);
    }
  };

  const handleRemoveSongFromPlaylist = async (songId: number) => {
    if (!selectedPlaylistId) return;
    
    const success = await api.removeSongFromPlaylist(selectedPlaylistId, songId);
    if (success) {
      fetchPlaylistSongs(selectedPlaylistId);
    }
  };

  // Find the currently selected playlist name
  const selectedPlaylist = playlists.find(playlist => playlist.id === selectedPlaylistId);

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 max-w-screen-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Music className="h-8 w-8 text-primary" />
          Groove Galaxy
        </h1>
        <p className="text-muted-foreground">Your personal playlist manager</p>
      </header>

      <SearchBar onSearch={handleSearch} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="playlists" className="flex items-center gap-1">
            <ListMusic className="h-4 w-4" />
            <span>Playlists</span>
          </TabsTrigger>
          <TabsTrigger 
            value="songs" 
            disabled={!selectedPlaylistId}
            className="flex items-center gap-1"
          >
            <Music className="h-4 w-4" />
            <span>Songs</span>
          </TabsTrigger>
          <TabsTrigger 
            value="search" 
            disabled={searchResults.songs.length === 0 && searchResults.artists.length === 0}
            className="flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Create New Playlist</h2>
            <PlaylistForm onPlaylistCreated={handlePlaylistCreated} />
          </div>
          
          <Separator />
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Your Playlists</h2>
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading playlists...</div>
            ) : playlists.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <PlaylistItem
                      key={playlist.id}
                      id={playlist.id}
                      name={playlist.name}
                      description={playlist.description}
                      onDeleted={handlePlaylistDeleted}
                      onSelected={handlePlaylistSelected}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No playlists found. Create your first playlist above!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="songs">
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Songs in "{selectedPlaylist?.name}"
            </h2>
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading songs...</div>
            ) : playlistSongs.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {playlistSongs.map((song) => (
                    <SongItem
                      key={song.id}
                      id={song.id}
                      title={song.title}
                      artist={song.artist_name}
                      album={song.album_name}
                      inPlaylist={true}
                      onRemoveFromPlaylist={handleRemoveSongFromPlaylist}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No songs in this playlist. Add songs from the search tab!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-6">
            {searchResults.songs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Songs</h2>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {searchResults.songs.map((song) => (
                      <SongItem
                        key={song.id}
                        id={song.id}
                        title={song.title}
                        artist={song.artist_name}
                        album={song.album_name}
                        inPlaylist={playlistSongs.some(s => s.id === song.id)}
                        onAddToPlaylist={
                          selectedPlaylistId && !playlistSongs.some(s => s.id === song.id)
                            ? handleAddSongToPlaylist
                            : undefined
                        }
                        onRemoveFromPlaylist={
                          selectedPlaylistId && playlistSongs.some(s => s.id === song.id)
                            ? handleRemoveSongFromPlaylist
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {searchResults.artists.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Artists</h2>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {searchResults.artists.map((artist) => (
                      <div key={artist.id} className="p-3 bg-secondary rounded-md">
                        <h3 className="font-medium">{artist.name}</h3>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {searchResults.songs.length === 0 && searchResults.artists.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No results found. Try a different search term.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;

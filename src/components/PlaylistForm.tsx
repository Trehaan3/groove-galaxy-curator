
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";

interface PlaylistFormProps {
  onPlaylistCreated: () => void;
}

export default function PlaylistForm({ onPlaylistCreated }: PlaylistFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await api.createPlaylist(name, description);
      if (result) {
        setName("");
        setDescription("");
        onPlaylistCreated();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !name.trim()}
      >
        Create Playlist
      </Button>
    </form>
  );
}

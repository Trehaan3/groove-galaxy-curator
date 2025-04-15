
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface SongItemProps {
  id: number;
  title: string;
  artist: string;
  album?: string;
  inPlaylist?: boolean;
  onAddToPlaylist?: (songId: number) => void;
  onRemoveFromPlaylist?: (songId: number) => void;
}

export default function SongItem({
  id,
  title,
  artist,
  album,
  inPlaylist,
  onAddToPlaylist,
  onRemoveFromPlaylist,
}: SongItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{artist}</p>
        {album && <p className="text-xs text-muted-foreground">{album}</p>}
      </div>
      {inPlaylist !== undefined && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (inPlaylist && onRemoveFromPlaylist) {
              onRemoveFromPlaylist(id);
            } else if (!inPlaylist && onAddToPlaylist) {
              onAddToPlaylist(id);
            }
          }}
          className={inPlaylist ? "text-destructive hover:text-destructive hover:bg-destructive/20" : ""}
        >
          {inPlaylist ? <Minus size={18} /> : <Plus size={18} />}
        </Button>
      )}
    </div>
  );
}

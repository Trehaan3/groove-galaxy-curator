
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { Trash2 } from "lucide-react";

interface PlaylistItemProps {
  id: number;
  name: string;
  description?: string;
  onDeleted: () => void;
  onSelected: (id: number) => void;
}

export default function PlaylistItem({ 
  id, 
  name, 
  description, 
  onDeleted, 
  onSelected 
}: PlaylistItemProps) {
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the playlist "${name}"?`)) {
      const success = await api.deletePlaylist(id);
      if (success) {
        onDeleted();
      }
    }
  };

  return (
    <div 
      className="flex items-center justify-between p-3 bg-secondary rounded-md hover:bg-secondary/80 cursor-pointer"
      onClick={() => onSelected(id)}
    >
      <div>
        <h3 className="font-medium">{name}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-destructive hover:text-destructive hover:bg-destructive/20"
        onClick={handleDelete}
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
}

import { Game } from "@/services/gameService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

interface GameCardProps {
  game: Game;
  onDelete: () => void;
}

export function GameCard({ game, onDelete }: GameCardProps) {
  const formattedDate = format(new Date(game.published_date), "MMMM d, yyyy");
  
  return (
    <Card className="flex flex-col h-full border border-secondary bg-card hover:border-primary transition-colors">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-2 text-lg">{game.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2 flex-grow">
        <p className="text-sm text-muted-foreground mb-1">By {game.author}</p>
        <p className="text-sm text-muted-foreground">Released: {formattedDate}</p>
      </CardContent>
      <CardFooter className="p-4 pt-2 grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onDelete}
          className="w-full"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Link to={`/edit/${game.id}`} className="col-span-1">
          <Button 
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        <Link to={`/game/${game.id}`} className="col-span-1">
          <Button className="w-full" size="sm">View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

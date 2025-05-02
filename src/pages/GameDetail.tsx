
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Game, gameService } from "@/services/gameService";
import { Header } from "@/components/Header";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      if (!id) {
        setError("Game ID not provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await gameService.getGameById(id);
        if (!data) {
          setError("Game not found");
        } else {
          setGame(data);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load game:", err);
        setError("Failed to load game details");
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, [id]);

  const formattedDate = game?.published_date
    ? format(new Date(game.published_date), "MMMM d, yyyy")
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 pb-12">
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            className="mr-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Button>
          <h1 className="text-3xl font-bold">Game Details</h1>
        </div>

        {isLoading ? (
          <div className="w-full max-w-2xl mx-auto">
            <div className="h-48 rounded-lg bg-secondary animate-pulse" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2 text-destructive">{error}</h2>
            <p className="text-muted-foreground mb-6">Try returning to the game list.</p>
            <Button onClick={() => navigate('/')}>Return to Game List</Button>
          </div>
        ) : game && (
          <Card className="w-full max-w-2xl mx-auto border border-secondary">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-2xl font-bold flex justify-between items-center">
                {game.name}
                <Link to={`/edit/${game.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Developer/Publisher</h3>
                  <p className="text-lg">{game.author}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Release Date</h3>
                  <p className="text-lg">{formattedDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                  <a 
                    href={game.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

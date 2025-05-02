
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Game, gameService } from "@/services/gameService";
import { GameForm } from "@/components/GameForm";
import { Header } from "@/components/Header";

export default function EditGame() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchGame = async () => {
      setIsLoading(true);
      try {
        const gameData = await gameService.getGameById(id);
        if (!gameData) {
          navigate('/');
          return;
        }
        setGame(gameData);
      } catch (error) {
        console.error("Failed to fetch game:", error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [id, navigate]);

  const handleSubmit = async (data: Omit<Game, 'id'>) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await gameService.updateGame(id, data);
      navigate('/');
    } catch (error) {
      console.error("Failed to update game:", error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pb-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Game</h1>
        
        <GameForm
          initialData={game}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          title={`Edit ${game.name}`}
        />
      </main>
    </div>
  );
}

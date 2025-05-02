
import { useState, useEffect } from "react";
import { Game, gameService, seedGames } from "@/services/gameService";
import { GameCard } from "@/components/GameCard";
import { DeleteGameDialog } from "@/components/DeleteGameDialog";
import { Header } from "@/components/Header";

export default function GameList() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    gameId: string | null;
    gameName: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    gameId: null,
    gameName: "",
    isDeleting: false,
  });

  useEffect(() => {
    loadGames();

    // Seed initial data if needed
    seedGames().catch(console.error);
  }, []);

  const loadGames = async () => {
    setIsLoading(true);
    try {
      const data = await gameService.getAllGames();
      setGames(data);
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (game: Game) => {
    setDeleteDialog({
      isOpen: true,
      gameId: game.id,
      gameName: game.name,
      isDeleting: false,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const confirmDelete = async () => {
    if (!deleteDialog.gameId) return;
    
    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
    try {
      await gameService.deleteGame(deleteDialog.gameId);
      setGames((prevGames) => prevGames.filter((g) => g.id !== deleteDialog.gameId));
    } catch (error) {
      console.error("Failed to delete game:", error);
    } finally {
      setDeleteDialog({
        isOpen: false,
        gameId: null,
        gameName: "",
        isDeleting: false,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pb-12">
        <h1 className="text-3xl font-bold mb-6">Game Library</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div 
                key={index} 
                className="h-48 rounded-lg bg-secondary animate-pulse"
              />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">No games found</h2>
            <p className="text-muted-foreground mb-6">Add your first game to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onDelete={() => handleDeleteClick(game)}
              />
            ))}
          </div>
        )}
      </main>
      
      <DeleteGameDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        gameName={deleteDialog.gameName}
        isLoading={deleteDialog.isDeleting}
      />
    </div>
  );
}


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Game, gameService } from "@/services/gameService";
import { GameForm } from "@/components/GameForm";
import { Header } from "@/components/Header";
import { toast } from "sonner";

export default function CreateGame() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Game, 'id'>) => {
    setIsSubmitting(true);
    try {
      await gameService.createGame(data);
      toast.success("Game added successfully");
      navigate('/');
    } catch (error) {
      console.error("Failed to create game:", error);
      toast.error("Failed to add game");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pb-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Add New Game</h1>
        
        <GameForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          title="Add New Game"
        />
      </main>
    </div>
  );
}

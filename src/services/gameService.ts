
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Game {
  id: string;
  name: string;
  url: string;
  author: string;
  published_date: string;
}

// Game service API using Supabase
export const gameService = {
  // GET /games
  async getAllGames(): Promise<Game[]> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Failed to fetch games:', error);
        toast.error('Failed to load games');
        return [];
      }
      
      return data.map(game => ({
        ...game,
        id: game.id.toString(),
        published_date: game.published_date
      }));
    } catch (error) {
      console.error('Failed to fetch games:', error);
      toast.error('Failed to load games');
      return [];
    }
  },

  // GET /games/:id
  async getGameById(id: string): Promise<Game | null> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error(`Failed to fetch game ${id}:`, error);
        toast.error('Failed to load game details');
        return null;
      }
      
      if (!data) {
        toast.error('Game not found');
        return null;
      }
      
      return {
        ...data,
        id: data.id.toString(),
        published_date: data.published_date
      };
    } catch (error) {
      console.error(`Failed to fetch game ${id}:`, error);
      toast.error('Failed to load game details');
      return null;
    }
  },

  // POST /games
  async createGame(gameData: Omit<Game, 'id'>): Promise<Game> {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert([gameData])
        .select()
        .single();
      
      if (error) {
        console.error('Failed to create game:', error);
        toast.error('Failed to create game');
        throw error;
      }
      
      toast.success('Game created successfully');
      return {
        ...data,
        id: data.id.toString(),
        published_date: data.published_date
      };
    } catch (error) {
      console.error('Failed to create game:', error);
      toast.error('Failed to create game');
      throw error;
    }
  },

  // PUT /games/:id
  async updateGame(id: string, gameData: Omit<Game, 'id'>): Promise<Game> {
    try {
      const { data, error } = await supabase
        .from('games')
        .update(gameData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Failed to update game ${id}:`, error);
        toast.error('Failed to update game');
        throw error;
      }
      
      toast.success('Game updated successfully');
      return {
        ...data,
        id: data.id.toString(),
        published_date: data.published_date
      };
    } catch (error) {
      console.error(`Failed to update game ${id}:`, error);
      toast.error('Failed to update game');
      throw error;
    }
  },

  // DELETE /games/:id
  async deleteGame(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Failed to delete game ${id}:`, error);
        toast.error('Failed to delete game');
        throw error;
      }
      
      toast.success('Game deleted successfully');
    } catch (error) {
      console.error(`Failed to delete game ${id}:`, error);
      toast.error('Failed to delete game');
      throw error;
    }
  }
};

// Initial seeding function - can be called once to populate the database if needed
export async function seedGames() {
  const existingGames = await gameService.getAllGames();
  
  if (existingGames.length === 0) {
    const sampleGames = [
      {
        name: 'Hollow Knight',
        url: 'https://hollowknight.com',
        author: 'Team Cherry',
        published_date: '2017-02-24T00:00:00.000Z'
      },
      {
        name: 'Celeste',
        url: 'http://www.celestegame.com',
        author: 'Maddy Makes Games',
        published_date: '2018-01-25T00:00:00.000Z'
      },
      {
        name: 'Hades',
        url: 'https://www.supergiantgames.com/games/hades',
        author: 'Supergiant Games',
        published_date: '2020-09-17T00:00:00.000Z'
      }
    ];

    for (const game of sampleGames) {
      await gameService.createGame(game);
    }
    
    console.log('Sample games seeded successfully');
  }
}

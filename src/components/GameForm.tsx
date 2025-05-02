
import { Game } from "@/services/gameService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface GameFormProps {
  initialData?: Game;
  onSubmit: (data: Omit<Game, 'id'>) => Promise<void>;
  isLoading: boolean;
  title: string;
}

export function GameForm({ initialData, onSubmit, isLoading, title }: GameFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<Game, 'id'>>({
    name: initialData?.name || '',
    url: initialData?.url || '',
    author: initialData?.author || '',
    published_date: initialData?.published_date 
      ? new Date(initialData.published_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the date properly
    const submissionData = {
      ...formData,
      published_date: new Date(formData.published_date).toISOString(),
    };
    
    await onSubmit(submissionData);
  };

  const isFormValid = () => {
    return formData.name && formData.url && formData.author && formData.published_date;
  };

  return (
    <Card className="w-full max-w-md mx-auto border border-secondary">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Game Title</Label>
            <Input 
              id="name"
              name="name"
              placeholder="Enter game title"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Game URL</Label>
            <Input 
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author/Developer</Label>
            <Input 
              id="author"
              name="author"
              placeholder="Enter game developer"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="published_date">Release Date</Label>
            <Input 
              id="published_date"
              name="published_date"
              type="date"
              value={formData.published_date}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading || !isFormValid()}
            className="relative"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary rounded-md">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            )}
            {initialData ? 'Update Game' : 'Add Game'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

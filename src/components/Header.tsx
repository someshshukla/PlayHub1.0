
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Plus, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Games", path: "/games" }
  ];

  const mobileMenu = (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col gap-4 pt-10">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className="text-lg font-medium px-4 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
  
  return (
    <header className="border-b border-secondary py-4 px-6 mb-8 bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isMobile && mobileMenu}
          <Link to="/" className="text-2xl font-bold text-primary-foreground">
            <span className="text-primary">Play</span>Hub Manager
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {!isMobile && (
            <nav className="mr-4">
              <ul className="flex space-x-4">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`px-2 py-1 rounded ${
                        location.pathname === item.path 
                          ? "text-primary font-medium" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          
          <Link to="/new">
            <Button size={isMobile ? "sm" : "default"}>
              <Plus className="mr-2 h-4 w-4" /> Add Game
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

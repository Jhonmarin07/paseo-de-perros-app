import { PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <a href="/" className="flex items-center">
            <PawPrint className="h-7 w-7 mr-2 text-primary" />
            <span className="font-bold text-lg font-headline">Patitas Seguras</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-2">
            <Button>Encuentra un Paseador</Button>
            <Button variant="outline">Quiero Ser Paseador</Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

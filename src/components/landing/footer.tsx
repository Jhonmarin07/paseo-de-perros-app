import { PawPrint, Twitter, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <PawPrint className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold font-headline text-foreground">Patitas Seguras</span>
          </div>
          <div className="text-center text-sm mb-4 md:mb-0">
            <p>Diseñado con la experticia en Análisis de Sistemas de Jhon Marín y el equipo de Equipo JM.</p>
            <p>La tecnología al servicio del mejor amigo del hombre.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary transition-colors"><Twitter /></a>
            <a href="#" className="hover:text-primary transition-colors"><Instagram /></a>
            <a href="#" className="hover:text-primary transition-colors"><Facebook /></a>
          </div>
        </div>
        <div className="text-center border-t mt-8 pt-4 text-xs">
          <p>&copy; {new Date().getFullYear()} Patitas Seguras. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

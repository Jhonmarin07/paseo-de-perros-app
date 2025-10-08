import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-dog-walk');

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight tracking-tighter">
          Paseos de Perros Seguros y Seguimiento GPS en Tiempo Real. ¡Contrata Hoy!
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90">
          Somos la plataforma web y móvil que simplifica tu vida. Conecta con paseadores verificados cerca de ti, revisa sus perfiles y asegura el bienestar de tu compañero con nuestro monitoreo avanzado.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="text-base">Encuentra un Paseador Cerca</Button>
          <Button size="lg" variant="secondary" className="text-base">Quiero Ser Paseador</Button>
        </div>
      </div>
    </section>
  );
}

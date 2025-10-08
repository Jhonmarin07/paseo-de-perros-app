import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Cta() {
  const ctaImage = PlaceHolderImages.find(img => img.id === 'join-community-dog');

  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
              ¿Eres un Apasionado de las Mascotas? Conviértete en Paseador Certificado.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Genera ingresos a tu propio ritmo. Te brindamos una plataforma segura, gestión de horarios flexibles y pagos garantizados. Únete al equipo de profesionales más confiable.
            </p>
            <Button size="lg" className="mt-8 text-base">
              Regístrate como Paseador Verificado
            </Button>
          </div>
          <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden shadow-xl">
             {ctaImage && (
              <Image
                src={ctaImage.imageUrl}
                alt={ctaImage.description}
                fill
                className="object-cover"
                data-ai-hint={ctaImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

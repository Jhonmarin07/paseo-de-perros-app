import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white">
      <Image
        src="/images/hero-background.png"
        alt="People walking dogs in a park"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tighter tracking-tighter">
          Paseos de Perros Seguros y Seguimiento GPS en Tiempo Real. ¡Contrata Hoy!
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white">
          Somos la plataforma web y móvil que simplifica tu vida. Conecta con paseadores verificados cerca de ti, revisa sus perfiles y asegura el bienestar de tu compañero con nuestro monitoreo avanzado.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="text-base">
            <Link href="/#find-walker">Encuentra un Paseador Cerca</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="text-base">
            <Link href="/#become-walker">Quiero Ser Paseador</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

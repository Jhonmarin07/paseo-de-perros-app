import { ClipboardList, Bell, Map, Star } from 'lucide-react';

const steps = [
  {
    icon: <ClipboardList className="w-8 h-8 text-primary" />,
    title: "1. Publica tu Oferta",
    description: "Registra a tu mascota y crea una solicitud con hora, zona y tiempo deseado.",
  },
  {
    icon: <Bell className="w-8 h-8 text-primary" />,
    title: "2. Aceptación en Tiempo Real",
    description: "Un paseador cercano y disponible acepta el servicio. Recibes una notificación instantánea.",
  },
  {
    icon: <Map className="w-8 h-8 text-primary" />,
    title: "3. Monitorea en Vivo",
    description: "El paseador activa el GPS y tú puedes ver todo el recorrido directamente en el mapa.",
  },
  {
    icon: <Star className="w-8 h-8 text-primary" />,
    title: "4. Finaliza y Califica",
    description: "El paseo termina, el pago se procesa automáticamente y calificas la experiencia.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
            Contratar un Paseo es tan Fácil como un Clic
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            En solo cuatro simples pasos, tu mejor amigo estará disfrutando de un paseo seguro y divertido.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.title} className="flex flex-col items-center text-center p-4">
              <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

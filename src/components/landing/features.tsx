import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, MapPin, CreditCard, Star } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: "Paseadores 100% Verificados",
    description: "Todos nuestros paseadores pasan por un riguroso proceso de verificación de identidad, documentos y antecedentes para garantizar tu paz mental.",
    keywords: "Verificación de identidad, Paseadores confiables",
  },
  {
    icon: <MapPin className="w-10 h-10 text-primary" />,
    title: "Rastreo GPS en Vivo",
    description: "Sigue el recorrido exacto de tu mascota en un mapa en tiempo real. Controla el tiempo transcurrido y la distancia desde tu móvil.",
    keywords: "Seguimiento GPS, Recorrido en mapa",
  },
  {
    icon: <CreditCard className="w-10 h-10 text-primary" />,
    title: "Pagos Seguros y Transparencia",
    description: "Procesamos todos los pagos a través de pasarelas reconocidas. Olvídate del efectivo y accede a tu historial de transacciones.",
    keywords: "Pagos seguros, Pasarelas de pago, Tarifas fijas",
  },
  {
    icon: <Star className="w-10 h-10 text-primary" />,
    title: "Reputación y Calificaciones",
    description: "Lee calificaciones y comentarios de otros dueños. Fomenta una comunidad de excelencia calificando a tu paseador después de cada servicio.",
    keywords: "Calificaciones, Reputación, Comentarios",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
            Seguridad, Control y Tranquilidad en Cada Paseo
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tu confianza es nuestra prioridad. Por eso hemos creado una plataforma con las mejores herramientas para tu tranquilidad.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                <CardDescription className="pt-2 text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

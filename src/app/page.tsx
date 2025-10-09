import { Features } from '@/components/landing/features';
import { GenAiMatcher } from '@/components/landing/gen-ai-matcher';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { BecomeWalkerForm } from '@/components/landing/become-walker-form';
import { AuthComponent } from '@/components/auth/Auth';

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <div className="container mx-auto px-4 py-16">
        <AuthComponent />
      </div>
      <div id="find-walker" className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <GenAiMatcher />
          <div id="become-walker">
            <BecomeWalkerForm />
          </div>
        </div>
      </div>
    </main>
  );
}

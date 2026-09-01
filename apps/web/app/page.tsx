import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { InteractiveCalculator } from '../components/landing/InteractiveCalculator';
import { ParcelBuilderSection } from '../components/landing/ParcelBuilderSection';
import { TimelineSection } from '../components/landing/TimelineSection';
import { EmergencyWithdrawalSection } from '../components/landing/EmergencyWithdrawalSection';
import { TestimonialsAndFaq } from '../components/landing/TestimonialsAndFaq';
import { Footer } from '../components/landing/Footer';

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      <Navbar />
      <HeroSection />
      <InteractiveCalculator />
      <ParcelBuilderSection />
      <TimelineSection />
      <EmergencyWithdrawalSection />
      <TestimonialsAndFaq />
      <Footer />
    </main>
  );
}

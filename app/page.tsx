import { AntiMlmBand } from "@/components/AntiMlmBand";
import { CostComparison } from "@/components/CostComparison";
import { Faq } from "@/components/Faq";
import { Flavors } from "@/components/Flavors";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Instrumentation } from "@/components/Instrumentation";
import { NutrientPanel } from "@/components/NutrientPanel";
import { NutrientTicker } from "@/components/NutrientTicker";
import { Offer } from "@/components/Offer";
import { PowderBand } from "@/components/PowderBand";
import { StickyBar } from "@/components/StickyBar";
import { StoreProvider } from "@/components/Store";
import { TopBar } from "@/components/TopBar";
import { WaitlistModal } from "@/components/WaitlistModal";
import { getRequestContext } from "@/lib/server-context";

export default async function LandingPage() {
  // La variante ya viene fijada por el middleware, así que el HTML del servidor
  // sale con el precio correcto desde la primera pintura.
  const { variant } = await getRequestContext();

  return (
    <StoreProvider variant={variant}>
      <TopBar />
      <Header />
      <main>
        <Hero variant={variant} />
        <HowItWorks />
        <CostComparison variant={variant} />
        <Flavors />
        <NutrientTicker />
        <NutrientPanel />
        <PowderBand />
        <Offer variant={variant} />
        <AntiMlmBand />
        <Faq />
      </main>
      <Footer />
      <StickyBar />
      <WaitlistModal />
      <Instrumentation />
    </StoreProvider>
  );
}

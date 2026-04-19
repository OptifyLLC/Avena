import { FloatingNav } from "@/components/landing/floating-nav";
import { Hero } from "@/components/landing/hero";
import { FeatureCards } from "@/components/landing/feature-cards";
import { WordmarkSection } from "@/components/landing/wordmark-section";
import { Pillars } from "@/components/landing/pillars";
import { ProductSpotlight } from "@/components/landing/product-spotlight";
import { Modules } from "@/components/landing/modules";
import { Pricing } from "@/components/landing/pricing";
import { SiteFooter } from "@/components/landing/site-footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#050505]">
      <FloatingNav />
      <main>
        <Hero />
        <FeatureCards />
        <WordmarkSection />
        <Pillars />
        <ProductSpotlight />
        <Pricing />
        <Modules />
      </main>
      <SiteFooter />
    </div>
  );
}

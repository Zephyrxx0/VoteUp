"use client";

import {
  Navbar,
  HeroSection,
  StoriesSection,
  HowItWorksSection,
  PipelineDemoSection,
  FeaturesSection,
  CommunitySection,
  JourneysSection,
  CTASection,
  Footer,
  ScrollReveal,
} from "@/components/landing";

export default function Home() {
  return (
    <div suppressHydrationWarning>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        <HeroSection />
        <StoriesSection />
        <HowItWorksSection />
        <PipelineDemoSection />
        <FeaturesSection />
        <CommunitySection />
        <JourneysSection />
        <CTASection />
      </main>
      <Footer />
      <ScrollReveal />
    </div>
  );
}

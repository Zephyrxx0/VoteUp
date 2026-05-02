"use client";

import { useMemo } from "react";
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
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboardingStore } from "@/lib/onboarding-store";

export default function Home() {
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const content = useMemo(() => {
    if (!hasCompletedOnboarding) {
      return <OnboardingShell />;
    }

    return (
      <>
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
      </>
    );
  }, [hasCompletedOnboarding]);

  return (
    <div suppressHydrationWarning>
      {content}
    </div>
  );
}

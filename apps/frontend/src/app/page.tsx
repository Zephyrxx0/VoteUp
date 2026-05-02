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
    <>
      {/* Skip to main */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
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

      {/* Footer */}
      <Footer />

      {/* Scroll reveal observer */}
      <ScrollReveal />
    </>
  );
}

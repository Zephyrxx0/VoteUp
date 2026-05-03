'use client';

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { 
  ArrowRight, 
  Globe, 
  UserCircle2, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";
import { Link } from "@/navigation";

export default function OnboardingPage() {
  const t = useTranslations('onboarding');

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-civic-indigo mb-4" style={{ fontFamily: 'var(--font-lora)' }}>
            {t('welcome')}
          </h1>
          <p className="text-xl text-civic-text-secondary">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Identity Section */}
          <Card className="border-civic-border hover:border-civic-indigo transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-civic-indigo-pale flex items-center justify-center mb-4">
                <UserCircle2 className="w-6 h-6 text-civic-indigo" />
              </div>
              <CardTitle className="font-serif" style={{ fontFamily: 'var(--font-lora)' }}>
                {t('identity.title')}
              </CardTitle>
              <CardDescription>
                Choose how you want to interact with VoteUp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-between h-auto py-4 px-6 border-civic-border hover:bg-civic-indigo-pale hover:text-civic-indigo transition-all group" asChild>
                <Link href="/dashboard">
                  <div className="text-left">
                    <div className="font-semibold">{t('identity.anonymous')}</div>
                    <div className="text-xs text-muted-foreground">{t('identity.anonymousDesc')}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button className="w-full justify-between h-auto py-4 px-6 bg-civic-indigo hover:bg-civic-indigo-light text-white shadow-lg shadow-indigo-100 group">
                <div className="text-left">
                  <div className="font-semibold">{t('identity.google')}</div>
                  <div className="text-xs text-white/80">{t('identity.googleDesc')}</div>
                </div>
                <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
              </Button>
            </CardContent>
          </Card>

          {/* Verification Section */}
          <Card className="border-civic-border bg-civic-gold-pale/30 border-dashed">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-civic-gold-pale flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-civic-gold" />
              </div>
              <CardTitle className="font-serif" style={{ fontFamily: 'var(--font-lora)' }}>
                {t('digilocker.title')}
              </CardTitle>
              <CardDescription>
                {t('digilocker.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full border-civic-gold/20 bg-white hover:bg-civic-gold-pale hover:text-civic-gold transition-all" disabled>
                Coming Soon
              </Button>
              <p className="text-xs text-center text-civic-text-muted italic">
                Verification is not required for basic access.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Link href="/dashboard" className="text-civic-indigo font-medium hover:underline inline-flex items-center gap-1">
            Skip for now and go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}

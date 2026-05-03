'use client';

import { use } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { 
  Vote, 
  Calendar, 
  CheckCircle2, 
  Users, 
  Gavel, 
  ChevronRight, 
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function ElectionGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('guide_page');
  
  const PILLARS = [
    {
      id: 'lok_sabha',
      icon: <Vote className="h-6 w-6 text-civic-indigo" />,
    },
    {
      id: 'rajya_sabha',
      icon: <Users className="h-6 w-6 text-civic-indigo" />,
    },
    {
      id: 'executive',
      icon: <Gavel className="h-6 w-6 text-civic-indigo" />,
    }
  ];

  const INDIA_STEPS = [
    {
      id: 'registration',
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "bg-green-100 text-green-700",
    },
    {
      id: 'schedule',
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: 'nominations',
      icon: <Users className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-700",
    },
    {
      id: 'polling',
      icon: <Vote className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-700",
    },
    {
      id: 'counting',
      icon: <ChevronDown className="h-5 w-5" />,
      color: "bg-indigo-100 text-indigo-700",
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans">
      <Navbar locale={locale} />
      
      <main id="main">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden border-b border-civic-border/50">
          <div className="dot-grid absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-civic-indigo-pale opacity-20 blur-3xl" />
          
          <div className="container relative mx-auto px-6">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-6 rounded-full border-civic-indigo text-civic-indigo bg-civic-indigo-pale/30 px-4 py-1 font-mono text-[11px] uppercase tracking-wider">
                {t('eyebrow')}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-civic-text mb-6 leading-tight" style={{ fontFamily: 'var(--font-lora)' }}>
                {t('title')}
              </h1>
              <p className="text-xl text-civic-text-secondary mb-10 leading-relaxed font-light">
                {t('description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#lifecycle" className="inline-flex items-center justify-center gap-2 rounded-xl bg-civic-coral px-8 py-4 text-white font-medium shadow-lg shadow-coral-100 hover:bg-civic-coral-light transition-all">
                  {t('cta_timeline')}
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl border border-civic-border bg-white px-8 py-4 text-civic-text font-medium hover:bg-gray-50 transition-all">
                  {t('cta_pm')}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PILLARS.map((pillar) => (
                <Card key={pillar.id} className="border-none shadow-none bg-civic-indigo-pale/10 rounded-2xl p-4 transition-all hover:bg-civic-indigo-pale/20">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
                      {pillar.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold text-civic-text mb-1" style={{ fontFamily: 'var(--font-lora)' }}>
                      {t(`pillars.${pillar.id}.title`)}
                    </CardTitle>
                    <CardDescription className="text-civic-indigo font-mono text-xs uppercase tracking-widest font-bold">
                      {t(`pillars.${pillar.id}.subtitle`)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-civic-text-secondary leading-relaxed font-light text-[15px]">
                      {t(`pillars.${pillar.id}.description`)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline/Lifecycle Section */}
        <section id="lifecycle" className="py-24 bg-civic-indigo-pale/5">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-civic-text mb-4" style={{ fontFamily: 'var(--font-lora)' }}>
                {t('lifecycle_title')}
              </h2>
              <p className="text-civic-text-secondary font-light text-lg">
                {t('lifecycle_subtitle')}
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-civic-border/50 -translate-x-1/2 hidden md:block" />
              
              <div className="space-y-12">
                {INDIA_STEPS.map((step, index) => (
                  <div key={step.id} className={`relative flex items-start gap-8 md:gap-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Circle on line */}
                    <div className="absolute left-6 md:left-1/2 top-0 -translate-x-1/2 z-10 hidden md:block">
                      <div className={`h-4 w-4 rounded-full border-4 border-white shadow-md ${step.color.split(' ')[1].replace('text', 'bg')}`} />
                    </div>

                    {/* Content Card */}
                    <div className="w-full md:w-[45%]">
                      <Card className="border border-civic-border/50 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
                        <div className={`h-1.5 w-full ${step.color.split(' ')[1].replace('text', 'bg')}`} />
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${step.color}`}>
                              {step.icon}
                            </div>
                            <span className="font-mono text-[10px] uppercase font-bold text-civic-text-muted bg-gray-100 px-2 py-0.5 rounded">
                              {t(`steps.${step.id}.timeline`)}
                            </span>
                          </div>
                          <CardTitle className="text-xl font-bold text-civic-text" style={{ fontFamily: 'var(--font-lora)' }}>
                            {t(`steps.${step.id}.title`)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-civic-text-secondary text-sm leading-relaxed font-light">
                            {t(`steps.${step.id}.details`)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white border-t border-civic-border/30">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-civic-text mb-6" style={{ fontFamily: 'var(--font-lora)' }}>
                {t('ready_title')}
              </h2>
              <p className="text-xl text-civic-text-secondary mb-10 font-light leading-relaxed">
                {t('ready_description')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/onboarding" className="inline-flex items-center justify-center gap-2 rounded-xl bg-civic-indigo px-8 py-4 text-white font-medium hover:bg-civic-indigo-light transition-all shadow-lg shadow-indigo-100">
                  {t('cta_journey')}
                </Link>
                <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl border border-civic-border bg-white px-8 py-4 text-civic-text font-medium hover:bg-gray-50 transition-all">
                  {t('cta_status')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

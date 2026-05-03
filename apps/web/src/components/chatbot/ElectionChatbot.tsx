'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Bot, Send, X, Globe, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ChatItem = {
  role: 'user' | 'assistant';
  content: string;
  meta?: string;
};

const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिन्दी' },
  { value: 'Bengali', label: 'বাংলা' },
  { value: 'Telugu', label: 'తెలుగు' },
  { value: 'Marathi', label: 'मराठी' },
  { value: 'Tamil', label: 'தமிழ்' },
];

export function ElectionChatbot() {
  const t = useTranslations('chatbot');
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [items, setItems] = useState<ChatItem[]>([
    {
      role: 'assistant',
      content: t('welcome'),
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;

    const message = input.trim();
    setInput('');
    setItems((prev) => [...prev, { role: 'user', content: message }]);
    setLoading(true);

    try {
      const history = items.slice(-8);
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          country: 'India',
          language,
          history,
        }),
      });

      const data = (await response.json()) as {
        answer?: string;
        source?: 'gemini' | 'fallback';
        diagnostics?: { geminiConfigured?: boolean; model?: string; modelUsed?: string | null; fallbackReason?: string | null };
      };
      setItems((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer?.trim() || 'No response generated. Please retry.',
          meta: data.source
            ? `${data.source.toUpperCase()}${data.source === 'gemini' && data.diagnostics?.modelUsed ? ` (${data.diagnostics.modelUsed})` : ''}`
            : undefined,
        },
      ]);
    } catch {
      setItems((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Network issue. Retry in few seconds.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70] font-sans">
      {open ? (
        <div className="flex w-[min(92vw,480px)] flex-col overflow-hidden rounded-[24px] border border-civic-border bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-10">
          {/* Header */}
          <div className="relative border-b border-civic-border bg-civic-indigo px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                  <Bot className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold tracking-tight" style={{ fontFamily: 'var(--font-lora)' }}>
                    {t('title')}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    <p className="text-[10px] font-medium text-white/70">{t('status')}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-8 min-w-[90px] border-white/20 bg-white/10 text-[11px] text-white hover:bg-white/20 focus:ring-0">
                    <Globe className="mr-1.5 size-3" />
                    <SelectValue placeholder="Lang" />
                  </SelectTrigger>
                  <SelectContent align="end" className="bg-white border-civic-border">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="text-xs">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 transition hover:bg-white/20"
                  aria-label="Close assistant"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex h-[500px] flex-col gap-4 overflow-y-auto bg-[#F8F9FB] p-6">
            {items.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={cn(
                  "max-w-[92%] rounded-2xl px-5 py-3.5 text-[14px] leading-relaxed shadow-sm",
                  item.role === 'assistant' 
                    ? "mr-auto rounded-bl-none bg-white text-civic-text border border-civic-border/50" 
                    : "ml-auto rounded-br-none bg-civic-indigo text-white shadow-indigo-100"
                )}
              >
                {item.role === 'assistant' ? (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({children}) => <strong className="font-bold text-civic-indigo">{children}</strong>,
                      ul: ({children}) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                      li: ({children}) => <li>{children}</li>,
                      h1: ({children}) => <h1 className="mb-2 mt-3 text-lg font-bold text-civic-indigo">{children}</h1>,
                      h2: ({children}) => <h2 className="mb-2 mt-3 text-base font-bold text-civic-indigo">{children}</h2>,
                      h3: ({children}) => <h3 className="mb-1 mt-2 text-sm font-bold text-civic-indigo">{children}</h3>,
                      code: ({children}) => <code className="rounded bg-civic-indigo-pale px-1 py-0.5 text-xs text-civic-indigo">{children}</code>,
                      a: ({children, href}) => <a href={href} className="text-civic-coral underline underline-offset-2 hover:text-civic-coral-light" target="_blank" rel="noopener noreferrer">{children}</a>,
                    }}
                  >
                    {item.content}
                  </ReactMarkdown>
                ) : (
                  item.content
                )}
                
                {item.role === 'assistant' && item.meta ? (
                  <div className="mt-2.5 flex items-center gap-1.5 opacity-30 border-t border-civic-border/30 pt-2">
                    <Sparkles className="size-3 text-civic-indigo" />
                    <p className="text-[9px] font-bold uppercase tracking-wider">{item.meta}</p>
                  </div>
                ) : null}
              </div>
            ))}
            {loading && (
              <div className="mr-auto flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm text-civic-text-muted shadow-sm">
                <span className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-civic-indigo/40" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-civic-indigo/40" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-civic-indigo/40" style={{ animationDelay: '300ms' }}></span>
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-civic-border bg-white p-5">
            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-civic-border bg-[#F1F3F7] px-4 transition-all focus-within:border-civic-indigo focus-within:bg-white focus-within:ring-2 focus-within:ring-civic-indigo/10">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t('placeholder')}
                  className="h-12 w-full bg-transparent text-sm text-civic-text outline-none placeholder:text-civic-text-muted/70"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-civic-indigo text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-md shadow-indigo-100"
                  aria-label="Send message"
                >
                  <Send className="size-4.5" />
                </button>
              </div>
            </form>
            <p className="mt-3 text-center text-[10px] text-civic-text-muted/50">
              {t('disclaimer')}
            </p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 rounded-full bg-civic-indigo p-2 pr-6 text-base font-bold text-white shadow-[0_10px_25px_rgba(79,70,229,0.3)] transition-all hover:scale-105 hover:bg-civic-indigo-light active:scale-95"
          aria-label="Open assistant"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform group-hover:rotate-12">
            <Bot className="size-6" />
          </div>
          <span>Ask Election AI</span>
        </button>
      )}
    </div>
  );
}

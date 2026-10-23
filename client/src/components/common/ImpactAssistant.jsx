import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles, LoaderCircle, RotateCcw, Bot, ShieldCheck } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const QUICK_PROMPTS = [
  'Find active campaigns',
  'How does NGO verification work?',
  'How can I track my donation?',
  'Explain milestones and escrow',
  'Tell me about AI Social Poster Studio',
];

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Hi! I’m Impact Assistant, ClearImpact’s conversational guide. I can help you explore verified campaigns, understand NGO statutory verification, track milestone escrow, and explain how to create AI social posters. What would you like to know?',
};

export default function ImpactAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFailedMessage, setLastFailedMessage] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      inputRef.current?.focus();
    }
  }, [open, messages, loading, error]);

  const sendMessage = async (rawMessage) => {
    const message = rawMessage.trim();
    if (!message || loading || message.length > 2000) return;

    const history = messages
      .filter((item) => item.role === 'user' || item.role === 'assistant')
      .slice(-8)
      .map(({ role, content }) => ({ role, content }));

    if (history.length && history[history.length - 1].role === 'user' && history[history.length - 1].content === message) {
      history.pop();
    }

    const alreadyVisible = messages[messages.length - 1]?.role === 'user' &&
      messages[messages.length - 1]?.content === message;
    if (!alreadyVisible) {
      setMessages((current) => [...current, { role: 'user', content: message }]);
    }
    setDraft('');
    setLoading(true);
    setError('');
    setLastFailedMessage('');

    try {
      const response = await api.post('/chat/message', { message, history });
      setMessages((current) => [...current, {
        role: 'assistant',
        content: response.data.reply || 'I could not prepare a response. Please try again.',
      }]);
    } catch (requestError) {
      const messageText = requestError.response?.data?.message ||
        'Impact Assistant is temporarily unavailable. Please try again.';
      setError(messageText);
      setLastFailedMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    sendMessage(draft);
  };

  const resetConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setDraft('');
    setError('');
    setLastFailedMessage('');
  };

  return (
    <>
      {open && (
        <section
          aria-label="Impact Assistant chat"
          className="fixed bottom-24 right-4 z-[100] flex h-[min(650px,calc(100dvh-8rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl sm:right-6 animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-800 to-teal-900 px-5 py-4 text-white shadow-md">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-inner">
                <Sparkles size={20} className="text-amber-300" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-sm leading-5">ClearImpact Assistant</h2>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-700/80 text-emerald-200 border border-emerald-500/30">
                    Live AI
                  </span>
                </div>
                <p className="truncate text-xs text-emerald-100/90 font-medium">
                  {user ? `Logged in as ${user.name ? user.name.split(' ')[0] : user.role}` : 'Grounded Donation Guidance'}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={resetConversation}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="rounded-xl p-2 text-emerald-100 transition hover:bg-white/15 focus:outline-hidden"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Close assistant"
                aria-label="Close assistant"
                className="rounded-xl p-2 text-emerald-100 transition hover:bg-white/15 focus:outline-hidden"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* Messages Body */}
          <div className="flex-1 space-y-3.5 overflow-y-auto bg-slate-50/70 p-4" aria-live="polite">
            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/80 px-3.5 py-2.5 text-xs leading-relaxed text-emerald-900 flex items-start gap-2 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Grounded Transparency Layer:</strong> Responses reference live database records with zero hallucination.
              </span>
            </div>

            {messages.map((item, index) => (
              <div key={`${index}-${item.role}`} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-xs leading-relaxed font-sans ${
                  item.role === 'user'
                    ? 'rounded-br-xs bg-emerald-800 text-white shadow-xs font-medium'
                    : 'rounded-bl-xs border border-slate-200 bg-white text-slate-800 shadow-2xs'
                }`}>
                  {item.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 w-fit">
                <LoaderCircle size={15} className="animate-spin text-emerald-600" aria-hidden="true" />
                <span>Checking verified records & preparing answer…</span>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 space-y-1.5" role="alert">
                <p className="font-semibold">{error}</p>
                {lastFailedMessage && (
                  <button
                    type="button"
                    onClick={() => sendMessage(lastFailedMessage)}
                    disabled={loading}
                    className="inline-flex items-center gap-1 font-bold text-rose-900 underline underline-offset-2 hover:text-rose-950"
                  >
                    <RotateCcw size={12} /> Try again
                  </button>
                )}
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="pt-2 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Quick Prompts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-left text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={submit} className="border-t border-slate-200/90 bg-white p-3 space-y-1.5">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-1.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition">
              <input
                id="impact-assistant-message"
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value.slice(0, 2000))}
                maxLength={2000}
                placeholder="Ask about campaigns, escrow, or verification…"
                className="flex-1 border-0 bg-transparent px-2.5 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 font-medium"
                disabled={loading}
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={loading || !draft.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white transition hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 font-medium">
              Powered by ClearImpact Database Grounding & Google Gemini AI
            </p>
          </form>
        </section>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Close Impact Assistant' : 'Open ClearImpact AI Assistant'}
        aria-expanded={open}
        className="fixed bottom-5 right-4 z-[100] flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-800 to-teal-800 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-emerald-950/20 transition hover:scale-105 hover:from-emerald-900 hover:to-teal-900 focus:outline-hidden sm:bottom-6 sm:right-6 border border-emerald-600/30 group"
      >
        {open ? (
          <X size={18} />
        ) : (
          <div className="relative">
            <MessageCircle size={18} className="group-hover:rotate-12 transition transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
          </div>
        )}
        <span>{open ? 'Close Chat' : 'ClearImpact AI Assistant'}</span>
      </button>
    </>
  );
}

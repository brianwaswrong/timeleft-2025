// ConciergeOverlay.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';

const TYPING_MS = 600;

export default function ConciergeOverlay({
  mode = 'planner', // "planner" | "feedback"
  open = false,
  onClose = () => {},
  onSubmit = () => {}, // (payload) => void
}) {
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [answers, setAnswers] = useState({}); // stepIndex -> {choice, text}
  const [step, setStep] = useState(0);

  const flows = useMemo(
    () => ({
      planner: [
        {
          role: 'assistant',
          text: 'Hey! What are you looking to get out of this week? Anything we can help plan?',
          chips: [
            'Professional Mentor',
            'Romantic Interest',
            'Creative Partner',
            'A dinner to reset',
            'Reconnect with a friend',
          ],
          placeholder: 'Make the most of this week',
        },
        {
          role: 'assistant',
          text: 'Got it. Which night(s) might work best?',
          chips: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
        },
        {
          role: 'assistant',
          text: 'Great, I’ll quietly use that to tune your matches. Anything else this week?',
          chips: ['All good', 'Suggest an event', 'Introduce me to 1–2 people'],
          placeholder: 'Optional details…',
        },
      ],
      feedback: [
        {
          role: 'assistant',
          text: 'Hi! How was the dinner? Meet anyone great?',
          chips: ['Vibed', 'Mixed', 'Didn’t click', 'Left early'],
          placeholder: 'One thing that made it great (or not)…',
        },
        {
          role: 'assistant',
          text: 'Anyone you want to see again?',
          chips: ['Yes — seat us again', 'Maybe later', 'No thanks'],
          placeholder: 'Optional: who & why?',
        },
        {
          role: 'assistant',
          text: 'Noted. I’ll update your matches.',
          chips: ['Done'],
        },
      ],
    }),
    []
  );

  const steps = mode === 'planner' ? flows.planner : flows.feedback;
  const isLast = step >= steps.length - 1;

  // Open/reset
  useEffect(() => {
    if (!open) return;
    setMessages([]);
    setAnswers({});
    setStep(0);
    setFreeText('');
    // seed first assistant message with typing
    setTyping(true);
    const id = setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: 'assistant', text: steps[0].text }]);
    }, TYPING_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode]);

  // Auto-scroll
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  function advance(nextStep) {
    if (nextStep < steps.length) {
      setTyping(true);
      const id = setTimeout(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          { role: 'assistant', text: steps[nextStep].text },
        ]);
        setStep(nextStep);
        setFreeText('');
      }, TYPING_MS);
      return () => clearTimeout(id);
    } else {
      // Submit
      onSubmit({ mode, answers });
      onClose();
    }
  }

  function pickChip(chip) {
    const idx = step;
    const prev = answers[idx] || {};
    const updated = { ...answers, [idx]: { ...prev, choice: chip } };
    setAnswers(updated);
    setMessages((m) => [...m, { role: 'user', text: chip }]);
    if (isLast) {
      // Optional: small grace before submit
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        onSubmit({ mode, answers: updated });
        onClose();
      }, TYPING_MS);
    } else {
      advance(step + 1);
    }
  }

  function sendText() {
    if (!freeText.trim()) return;
    const idx = step;
    const prev = answers[idx] || {};
    const updated = { ...answers, [idx]: { ...prev, text: freeText.trim() } };
    setAnswers(updated);
    setMessages((m) => [...m, { role: 'user', text: freeText.trim() }]);
    if (isLast) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        onSubmit({ mode, answers: updated });
        onClose();
      }, TYPING_MS);
    } else {
      advance(step + 1);
    }
  }

  const current = steps[step] || {};
  const showInput = !!current.placeholder;

  return (
    <div
      className={`fixed inset-0 z-[100] ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(120% 120% at 20% -10%, rgba(0,0,0,.85), rgba(8,9,12,.95))',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Chat panel */}
      <div
        className={`absolute inset-0 flex items-center justify-center px-5 transition-all duration-500 ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <div className="w-full max-w-xl h-[76vh] rounded-2xl border border-white/10 bg-white/[.04] text-white shadow-2xl flex flex-col relative">
          {/* Close */}
          <button
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>

          <div className="px-5 pt-6 pb-3 justify-items-center tracking-wide text-white/60">
            <img
              src="https://timeleft.com/staging/wp-content/uploads/sites/10/2024/06/timeleft-logo-white.png"
              alt="Timeleft Logo"
              className="w-auto h-8" // keeps consistent size
            />
          </div>

          {/* Header */}
          <div className="px-5 pt-6 pb-3 text-xs uppercase tracking-wide text-white/60">
            {mode === 'planner' ? 'Weekly Planner' : 'Post‑Event Check‑in'}
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="px-5 flex-1 overflow-y-auto space-y-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    m.role === 'assistant'
                      ? 'bg-white/10 border border-white/15'
                      : 'bg-white text-black'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2 text-sm bg-white/10 border border-white/15">
                  <span className="inline-flex gap-1">
                    <Dot /> <Dot style={{ animationDelay: '120ms' }} />{' '}
                    <Dot style={{ animationDelay: '240ms' }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Chip row */}
          <div className="px-5 pt-3 pb-2 flex flex-wrap gap-2 border-t border-white/10">
            {(current.chips || []).map((c) => (
              <button
                key={c}
                onClick={() => pickChip(c)}
                className="px-3 py-1 rounded-full border text-sm bg-white/10 text-white border-white/15 hover:bg-white/15"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Input row */}
          {showInput && (
            <div className="px-5 pb-5 flex gap-2">
              <input
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder={current.placeholder}
                className="flex-1 rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20"
              />
              <button
                onClick={sendText}
                className="rounded-xl px-4 py-2 font-bold bg-white text-black hover:bg-white/90"
              >
                Send
              </button>
            </div>
          )}

          {/* Footer hint */}
          {!showInput && (
            <div className="px-5 pb-4 text-[11px] text-white/45">
              Tap a pill to continue. We only ask 1–2 things, then get out of
              the way.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Tiny typing dot
function Dot(props) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse"
      {...props}
    />
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Sparkles } from "lucide-react";

import { ConstraintsStep } from "@/components/flow/ConstraintsStep";
import { OccasionStep } from "@/components/flow/OccasionStep";
import { VibeStep } from "@/components/flow/VibeStep";
import { useSessionStore } from "@/state/sessionStore";

const STEPS = [
  { title: "Occasion", question: "Where are you heading?" },
  { title: "Vibe", question: "What's the feeling?" },
  { title: "Constraints", question: "Any rules today?" },
] as const;

export default function Flow() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const occasion = useSessionStore((state) => state.occasion);
  const vibe = useSessionStore((state) => state.vibe);
  const isGenerating = useSessionStore((state) => state.isGenerating);
  const error = useSessionStore((state) => state.error);
  const styleMe = useSessionStore((state) => state.styleMe);

  const canAdvance =
    (step === 0 && occasion !== null) ||
    (step === 1 && vibe !== null) ||
    step === 2;

  const handleBack = () => {
    if (step === 0) {
      navigate("/");
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const handleNext = () => setStep((s) => Math.min(2, s + 1));

  const handleStyleMe = async () => {
    const success = await styleMe();
    if (success) navigate("/reveal");
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      {/* Dark editorial header */}
      <div className="px-5 pt-14 pb-8 bg-foreground text-background">
        {/* Back + progress bar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleBack}
            aria-label="Back"
            className="size-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 active:scale-95 transition-all"
          >
            <ChevronLeft size={18} className="text-background" />
          </button>

          <div className="flex-1 flex gap-1.5" aria-label="Flow progress">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                aria-label={`${s.title} step`}
                aria-current={i === step ? "step" : undefined}
                className={`flex-1 h-[3px] rounded-full transition-all ${
                  i < step
                    ? "bg-background/50"
                    : i === step
                      ? "bg-background"
                      : "bg-background/20"
                }`}
              />
            ))}
          </div>

          <span className="text-[11px] text-background/40 font-semibold tabular-nums">
            {step + 1} / 3
          </span>
        </div>

        <p className="text-[10px] tracking-[0.35em] uppercase text-background/40 font-semibold mb-1.5">
          {STEPS[step].title}
        </p>
        <h1 className="text-4xl font-black tracking-tight leading-tight text-background">
          {STEPS[step].question}
        </h1>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-8 gap-4">
        {step === 0 && <OccasionStep />}
        {step === 1 && <VibeStep />}
        {step === 2 && <ConstraintsStep />}

        {error !== null && (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-auto pt-4">
          {step < 2 ? (
            <button
              onClick={handleNext}
              disabled={!canAdvance}
              className="w-full h-14 rounded-2xl bg-foreground text-background text-sm font-bold tracking-wide disabled:opacity-30 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => void handleStyleMe()}
              disabled={isGenerating}
              className="w-full h-14 rounded-2xl bg-foreground text-background text-sm font-bold tracking-wide disabled:opacity-30 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                "Styling…"
              ) : (
                <>
                  <Sparkles size={15} strokeWidth={2} />
                  Style Me
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

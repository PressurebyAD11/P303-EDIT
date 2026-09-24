import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ConstraintsStep } from "@/components/flow/ConstraintsStep";
import { OccasionStep } from "@/components/flow/OccasionStep";
import { VibeStep } from "@/components/flow/VibeStep";
import { useSessionStore } from "@/state/sessionStore";

const STEP_TITLES = ["Occasion", "Vibe", "Constraints"] as const;

export default function Flow() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const occasion = useSessionStore((state) => state.occasion);
  const vibe = useSessionStore((state) => state.vibe);
  const isGenerating = useSessionStore((state) => state.isGenerating);
  const error = useSessionStore((state) => state.error);
  const styleMe = useSessionStore((state) => state.styleMe);

  const canAdvance = (step === 0 && occasion !== null) || (step === 1 && vibe !== null) || step === 2;

  const handleBack = () => {
    if (step === 0) {
      navigate("/");
      return;
    }

    setStep((currentStep) => Math.max(0, currentStep - 1));
  };

  const handleNext = () => {
    setStep((currentStep) => Math.min(2, currentStep + 1));
  };

  const handleStyleMe = async () => {
    const success = await styleMe();

    if (success) {
      navigate("/reveal");
    }
  };

  const showOccasion = step === 0;
  const showVibe = step === 1;
  const showConstraints = step === 2;

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col px-4 pb-6 pt-5 sm:px-6">
      <div className="mb-5 space-y-3">
        <div className="flex items-center gap-2" aria-label="Flow progress">
          {STEP_TITLES.map((title, index) => {
            const active = index === step;
            const complete = index < step;

            return (
              <div
                key={title}
                className={`h-2.5 flex-1 rounded-full transition-colors ${
                  active ? "bg-foreground" : complete ? "bg-foreground/60" : "bg-muted"
                }`}
                aria-current={active ? "step" : undefined}
                aria-label={`${title} step`}
              />
            );
          })}
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Step {step + 1} of 3</p>
            <h2 className="text-2xl font-semibold tracking-tight">Choose your look</h2>
          </div>
          <p className="text-sm text-muted-foreground">{STEP_TITLES[step]}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <div className="space-y-5 rounded-3xl border border-border/70 bg-background/90 p-4 shadow-sm backdrop-blur sm:p-5">
          {showOccasion ? <OccasionStep /> : null}
          {showVibe ? <VibeStep /> : null}
          {showConstraints ? <ConstraintsStep /> : null}
        </div>

        {error !== null ? (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mt-auto flex items-center gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={handleBack}>
            Back
          </Button>

          {step < 2 ? (
            <Button type="button" className="flex-1" disabled={!canAdvance} onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="button" className="flex-1" disabled={isGenerating} onClick={handleStyleMe}>
              {isGenerating ? "Styling…" : "Style Me"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

type UserInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
  onPromptTipClick?: (tip: string) => void;
  disabled: boolean;
  error: string;
  isComplete: boolean;
  resultHref: string;
  promptLabel?: string;
  promptHint?: string;
  placeholder?: string;
  promptTips?: string[];
  usedPromptTips?: string[];
};

export default function UserInput({
  value,
  onChange,
  onSubmit,
  onPromptTipClick,
  disabled,
  error,
  isComplete,
  resultHref,
  promptLabel = "What do you do next?",
  promptHint = "Describe your next action naturally. The story will continue from there.",
  placeholder = "I drift toward the panel and begin checking the oxygen readout.",
  promptTips = [],
  usedPromptTips = [],
}: UserInputProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-6xl rounded-[1.75rem] border border-white/10 bg-[#050816]/80 p-4 shadow-[0_-12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/40">
              {promptLabel}
            </p>
            {promptTips.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {promptTips.map((tip) => (
                  <button
                    key={tip}
                    type="button"
                    onClick={() => {
                      if (disabled || usedPromptTips.includes(tip)) {
                        return;
                      }

                      if (onPromptTipClick) {
                        onPromptTipClick(tip);
                        return;
                      }

                      onChange(tip);
                    }}
                    disabled={disabled || usedPromptTips.includes(tip)}
                    className={`rounded-full border px-4 py-2 text-xs transition ${
                      usedPromptTips.includes(tip)
                        ? "border-white/5 bg-white/5 text-white/20"
                        : "border-white/10 bg-white/[0.07] text-white/68 hover:border-[#8FD3FF]/40 hover:bg-[#8FD3FF]/10 hover:text-white"
                    }`}
                  >
                    {tip}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/58">{promptHint}</p>
            )}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <textarea
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  void onSubmit();
                }
              }}
              rows={2}
              placeholder={placeholder}
              className="min-h-14 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm leading-7 text-white/80 outline-none transition placeholder:text-white/30 focus:border-[#8FD3FF]/40 focus:bg-white/[0.08]"
              disabled={disabled}
            />

            <div className="flex items-end gap-3 md:w-[168px] md:flex-col md:justify-end">
              <button
                type="button"
                onClick={() => {
                  void onSubmit();
                }}
                disabled={disabled || !value.trim()}
                className="w-full rounded-2xl bg-white/80 px-8 py-3.5 text-sm font-medium text-[#02040A] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {disabled ? "Thinking..." : "Send"}
              </button>

              {isComplete ? (
                <a
                  href={resultHref}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-white/12 bg-white/8 px-5 py-3.5 text-sm text-white/84 transition hover:bg-white/12"
                >
                  View Result
                </a>
              ) : null}
            </div>
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </div>
      </motion.div>
    </div>
  );
}
